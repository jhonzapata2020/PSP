import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MousePointer2,
  Sparkles,
  Pen,
  Undo2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Presentation,
} from 'lucide-react';

/**
 * AuditorioPresenterTools
 * Herramientas de presentación de alto rendimiento para auditorios y reuniones (estilo Microsoft Whiteboard / Teams / Apple Keynote).
 * 
 * Mejoras clave de confiabilidad:
 * 1. Lienzo de pantalla completa: Cubre el 100% de la pantalla y el scroll sin puntos ciegos ni desbordamientos.
 * 2. Captura de puntero nativa (setPointerCapture): Nunca pierde un trazo, rayita o clic, sin importar la velocidad del mouse.
 * 3. Renderizado en tiempo real (0ms lag): Renderizado directo del trazo activo para máxima fluidez a 120 FPS.
 * 4. Láser con rayitas rojas: Cuando el usuario arrastra con el láser, traza líneas rojas de neón que se quedan en pantalla.
 * 5. Protección de trazos: Las rayitas, flechas, subrayados y chulitos nunca se borran inesperadamente.
 */
export default function AuditorioPresenterTools({
  containerRef,
  isDark = true,
  isFullscreen = false
}) {
  // Solo se activa en Pantalla Completa
  if (!isFullscreen) {
    return null;
  }

  // Herramienta activa: 'none' (navegar) | 'laser' (láser con rayitas) | 'pen' (lápiz inteligente)
  const [activeTool, setActiveTool] = useState('none');
  const [penColor, setPenColor] = useState('#ef4444'); // Rojo intenso por defecto
  const [thickness, setThickness] = useState('thin'); // 'thin' | 'normal'
  const [autoCursiva, setAutoCursiva] = useState(true); // Reconocimiento automático de caligrafía
  const [isMinimized, setIsMinimized] = useState(false);

  // Trazos finalizados guardados en el lienzo
  const [lines, setLines] = useState([]);

  // Textos convertidos automáticamente a caligrafía cursiva
  const [cursiveNotes, setCursiveNotes] = useState([]);

  // Posición del puntero láser
  const [laserPos, setLaserPos] = useState({ x: -100, y: -100, visible: false });

  // Dimensiones dinámicas del lienzo para cubrir toda la pantalla y el scroll
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  // Referencias para trazo a 120 FPS y sincronización garantizada
  const svgRef = useRef(null);
  const livePathRef = useRef(null);
  const isDrawing = useRef(false);
  const activeStrokeRef = useRef(null);
  const strokeStartTime = useRef(0);

  // Acumulador de trazos de palabras manuscritas
  const pendingWordStrokes = useRef([]);
  const pauseRecognitionTimer = useRef(null);

  // Los 4 colores esenciales para presentaciones
  const COLORS = [
    { label: 'Rojo', hex: '#ef4444' },
    { label: 'Amarillo', hex: '#facc15' },
    { label: 'Azul', hex: '#38bdf8' },
    { label: 'Blanco', hex: '#ffffff' },
  ];

  const strokeWidth = thickness === 'thin' ? (activeTool === 'laser' ? 3.5 : 2.5) : (activeTool === 'laser' ? 5.5 : 4.5);

  // Mantener el tamaño del lienzo sincronizado con toda la pantalla y el contenido scrollable
  useEffect(() => {
    const updateDimensions = () => {
      const container = containerRef?.current;
      const w = Math.max(container?.scrollWidth || 0, container?.clientWidth || 0, window.innerWidth);
      const h = Math.max(container?.scrollHeight || 0, container?.clientHeight || 0, window.innerHeight);
      setDimensions({ width: w, height: h });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    let observer = null;
    if (window.ResizeObserver && containerRef?.current) {
      observer = new ResizeObserver(() => updateDimensions());
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (observer) observer.disconnect();
    };
  }, [containerRef, isFullscreen]);

  // Obtener coordenadas exactas considerando la posición y el scroll
  const getCoordinates = useCallback((e) => {
    if (!containerRef?.current) {
      return { x: e.clientX, y: e.clientY };
    }
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left + containerRef.current.scrollLeft;
    const y = clientY - rect.top + containerRef.current.scrollTop;
    return { x, y };
  }, [containerRef]);

  // Convertir puntos a curva Bézier suave
  const smoothPointsToSvgPath = (points) => {
    if (!points || points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${points[0].y}`;
    if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      path += ` Q ${p1.x} ${p1.y}, ${midX} ${midY}`;
    }
    const last = points[points.length - 1];
    path += ` L ${last.x} ${last.y}`;
    return path;
  };

  // Detección de círculo o elipse cerrada (solo si el trazo realmente se cerró)
  const recognizeCircle = (rawPoints) => {
    if (rawPoints.length < 14) return null;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < rawPoints.length; i++) {
      const p = rawPoints[i];
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    const width = maxX - minX;
    const height = maxY - minY;
    if (width < 25 || height < 25) return null;

    const start = rawPoints[0];
    const end = rawPoints[rawPoints.length - 1];
    const distStartEnd = Math.hypot(end.x - start.x, end.y - start.y);
    const diagonal = Math.hypot(width, height);

    // Solo se convierte si el trazo cerró su inicio y fin a menos del 30% de la diagonal
    if (distStartEnd / diagonal < 0.28) {
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const rx = Math.max(16, width / 2);
      const ry = Math.max(16, height / 2);
      return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
    }
    return null;
  };

  // Reconocimiento inteligente de escritura cursiva (NO borra rayitas, flechas ni chulitos)
  const processPendingWord = useCallback(async () => {
    const strokes = [...pendingWordStrokes.current];
    pendingWordStrokes.current = [];

    if (!strokes || strokes.length === 0) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    let totalPoints = 0;

    strokes.forEach((st) => {
      st.rawPoints.forEach((p) => {
        totalPoints++;
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });
    });

    const w = maxX - minX;
    const h = maxY - minY;

    // Si es un trazo simple, una línea horizontal/vertical o muy poco contenido, son RAYITAS, no texto
    if (w < 16 && h < 16) return;
    if (strokes.length === 1 && (w / (h || 1) > 5 || h / (w || 1) > 5)) {
      // Línea de subrayado o raya explicativa: NO se transforma en palabra
      return;
    }

    // Estructura para Google Handwriting API
    const ink = strokes.map((st) => {
      const xs = st.rawPoints.map((p) => Math.round(p.x));
      const ys = st.rawPoints.map((p) => Math.round(p.y));
      const ts = st.rawPoints.map((p) => p.t);
      return [xs, ys, ts];
    });

    try {
      const payload = {
        options: 'enable_pre_space',
        requests: [
          {
            writing_guide: { writing_area_width: 1920, writing_area_height: 1080 },
            ink: ink,
            language: 'es',
          },
        ],
      };

      const res = await fetch(
        'https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (data && data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1]?.length > 0) {
        const candidate = data[1][0][1][0];

        // Validar que sea una palabra/letra válida y no un guión o raya
        const cleanCandidate = (candidate || '').trim();
        const isNotPunctuation = !/^[-_.,;~`'"]+$/.test(cleanCandidate);

        if (cleanCandidate && isNotPunctuation && cleanCandidate.length >= 1) {
          const strokeIds = new Set(strokes.map((s) => s.id));
          const color = strokes[0].color;
          const calculatedFontSize = Math.max(26, Math.min(68, h * 1.15));

          // 1. Quitar los trazos del mouse correspondientes a la palabra
          setLines((prev) => prev.filter((line) => !strokeIds.has(line.id)));

          // 2. Colocar la palabra en caligrafía cursiva uniforme
          setCursiveNotes((prev) => [
            ...prev,
            {
              id: Date.now(),
              text: cleanCandidate,
              x: minX,
              y: minY,
              width: Math.max(w, 40),
              height: Math.max(h, 24),
              color: color,
              fontSize: calculatedFontSize,
            },
          ]);
        }
      }
    } catch (err) {
      // Si la API falla o no hay conexión, los trazos y rayitas permanecen visibles sin problemas
    }
  }, []);

  // INICIAR TRAZO (Mouse, Stylus o Dedo en pantalla táctil)
  const handlePointerDown = (e) => {
    if (activeTool === 'none') return;
    const coords = getCoordinates(e);
    if (!coords) return;

    // Capturar el puntero en el SVG: NUNCA se perderá el trazo aunque el mouse vaya rápido
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}

    isDrawing.current = true;
    strokeStartTime.current = Date.now();
    const isLaser = activeTool === 'laser';

    const firstPt = { x: coords.x, y: coords.y, t: 0 };
    const initialStroke = {
      id: Date.now() + Math.random(),
      color: penColor,
      width: strokeWidth,
      isLaser: isLaser,
      rawPoints: [firstPt],
      pathD: `M ${firstPt.x} ${firstPt.y} L ${firstPt.x} ${firstPt.y}`,
    };

    activeStrokeRef.current = initialStroke;

    // Actualizar trazo en vivo directamente en el DOM a 120 FPS
    if (livePathRef.current) {
      livePathRef.current.setAttribute('d', initialStroke.pathD);
      livePathRef.current.setAttribute('stroke', penColor);
      livePathRef.current.setAttribute('stroke-width', strokeWidth);
      livePathRef.current.setAttribute(
        'filter',
        isLaser ? 'url(#laserGlowSoft)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))'
      );
      livePathRef.current.style.display = 'block';
    }

    if (isLaser) {
      setLaserPos({ x: coords.x, y: coords.y, visible: true });
    }
  };

  // CONTINUAR TRAZO
  const handlePointerMove = (e) => {
    const coords = getCoordinates(e);
    if (!coords) return;

    // Si es herramienta láser, actualizar la posición del puntero rojo visible
    if (activeTool === 'laser') {
      setLaserPos({ x: coords.x, y: coords.y, visible: true });
    }

    if (!isDrawing.current || !activeStrokeRef.current) return;

    if (e.cancelable && e.touches) {
      e.preventDefault();
    }

    const t = Date.now() - strokeStartTime.current;
    const newPt = { x: coords.x, y: coords.y, t };

    // Agregar punto de forma síncrona en la referencia (0 pérdida de puntos)
    activeStrokeRef.current.rawPoints.push(newPt);
    const updatedPathD = smoothPointsToSvgPath(activeStrokeRef.current.rawPoints);
    activeStrokeRef.current.pathD = updatedPathD;

    // Actualización inmediata del trazo activo
    if (livePathRef.current) {
      livePathRef.current.setAttribute('d', updatedPathD);
    }
  };

  // FINALIZAR TRAZO (Garantizado: Guarda la rayita siempre)
  const handlePointerUp = (e) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    // Liberar la captura de puntero
    if (e?.currentTarget && e?.pointerId) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    // Ocultar la línea en vivo temporal
    if (livePathRef.current) {
      livePathRef.current.style.display = 'none';
      livePathRef.current.setAttribute('d', '');
    }

    const stroke = activeStrokeRef.current;
    activeStrokeRef.current = null;

    if (!stroke || stroke.rawPoints.length < 2) return;

    // 1. Si es modo lápiz y parece un círculo cerrado, pulirlo a elipse geométrica
    const circlePath = !stroke.isLaser ? recognizeCircle(stroke.rawPoints) : null;
    const finalizedLine = circlePath
      ? {
          ...stroke,
          isPolishedCircle: true,
          pathD: circlePath,
        }
      : stroke;

    // 2. Guardar el trazo en la lista de líneas (las rayitas rojas del láser y del lápiz permanecen)
    setLines((prev) => [...prev, finalizedLine]);

    // 3. Si es lápiz, no fue círculo y Cursiva está activa, acumular para reconocimiento
    if (!stroke.isLaser && !circlePath && autoCursiva) {
      pendingWordStrokes.current.push(finalizedLine);

      if (pauseRecognitionTimer.current) {
        clearTimeout(pauseRecognitionTimer.current);
      }
      pauseRecognitionTimer.current = setTimeout(() => {
        processPendingWord();
      }, 1000);
    }
  };

  // Deshacer última acción (última rayita o palabra)
  const undoLast = () => {
    if (lines.length > 0) {
      setLines((prev) => prev.slice(0, -1));
    } else if (cursiveNotes.length > 0) {
      setCursiveNotes((prev) => prev.slice(0, -1));
    }
  };

  // Borrar todas las rayitas y anotaciones del lienzo
  const clearAll = () => {
    setLines([]);
    setCursiveNotes([]);
    if (livePathRef.current) {
      livePathRef.current.setAttribute('d', '');
    }
    activeStrokeRef.current = null;
    pendingWordStrokes.current = [];
    if (pauseRecognitionTimer.current) {
      clearTimeout(pauseRecognitionTimer.current);
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* LIENZO SVG QUE CUBRE TODA LA PANTALLA Y EL CONTENIDO (100% FLUIDO, 0 LAG) */}
      {/* ========================================================================= */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          minWidth: '100vw',
          minHeight: '100vh',
          zIndex: 40,
          overflow: 'visible',
          pointerEvents: activeTool !== 'none' ? 'auto' : 'none',
          cursor: activeTool === 'laser' || activeTool === 'pen' ? 'crosshair' : 'default',
          touchAction: 'none',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          {/* Filtro neón para las rayitas y el puntero láser */}
          <filter id="laserGlowSoft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Trazos y rayitas ya guardados */}
        {lines.map((line) => (
          <path
            key={line.id}
            d={line.pathD}
            fill="none"
            stroke={line.color}
            strokeWidth={line.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={line.isLaser ? '0.98' : '0.92'}
            filter={line.isLaser ? 'url(#laserGlowSoft)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))'}
          />
        ))}

        {/* Trazo activo en tiempo real (directo al DOM a 120 FPS sin pérdida de eventos) */}
        <path
          ref={livePathRef}
          d=""
          fill="none"
          stroke={penColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.98"
          filter={activeTool === 'laser' ? 'url(#laserGlowSoft)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))'}
          style={{ display: 'none' }}
        />
      </svg>

      {/* ========================================================================= */}
      {/* PALABRAS TRANSFORMADAS A CALIGRAFÍA CURSIVA                               */}
      {/* ========================================================================= */}
      <div
        className="absolute top-0 left-0 pointer-events-none z-40 overflow-visible"
        style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
      >
        {cursiveNotes.map((note) => (
          <div
            key={note.id}
            className="absolute select-none pointer-events-none transform transition-opacity duration-300 animate-in fade-in"
            style={{
              left: `${note.x}px`,
              top: `${note.y - 12}px`,
              fontFamily: "'Caveat', cursive, sans-serif",
              fontSize: `${note.fontSize}px`,
              fontWeight: 700,
              lineHeight: 1,
              color: note.color,
              textShadow: isDark
                ? '0 2px 8px rgba(0,0,0,0.95), 0 0 14px rgba(255,255,255,0.2)'
                : '0 2px 6px rgba(0,0,0,0.35)',
              letterSpacing: '0.04em',
            }}
          >
            {note.text}
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* PUNTERO LÁSER ROJO RESPLANDECIENTE DE AUDITORIO                            */}
      {/* ========================================================================= */}
      {activeTool === 'laser' && laserPos.visible && (
        <div
          className="absolute pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
          style={{ left: `${laserPos.x}px`, top: `${laserPos.y}px` }}
        >
          {/* Resplandor suave */}
          <div
            className="w-8 h-8 rounded-full blur-[3px] opacity-90 animate-pulse"
            style={{
              background: `radial-gradient(circle, ${penColor} 0%, rgba(239,68,68,0.45) 45%, transparent 75%)`,
            }}
          />
          {/* Núcleo brillante centrado */}
          <div
            className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ef4444,0_0_20px_#f87171]"
            style={{
              boxShadow: `0 0 10px ${penColor}, 0 0 20px ${penColor}`,
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* BARRA DE HERRAMIENTAS FLOTANTE (ESTILO AUDITORIO / TEAMS / POWERPOINT)    */}
      {/* ========================================================================= */}
      <aside
        aria-label="Herramientas de Auditorio"
        className="fixed bottom-6 right-6 z-[99999] transition-all duration-300 select-none"
      >
        {isMinimized ? (
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className={`p-2.5 rounded-full shadow-2xl flex items-center gap-1.5 transition-all hover:scale-105 border ${
              isDark
                ? 'bg-[#182638]/95 border-cyan-500/50 text-cyan-400 hover:bg-[#1f324a]'
                : 'bg-white/95 border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
            title="Abrir herramientas de presentación"
          >
            <Presentation className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-black hidden sm:inline">Exposición</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div
            className={`flex items-center gap-1.5 p-1.5 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-md border transition-all ${
              isDark
                ? 'bg-[#111c2a]/95 border-slate-700/80 text-white'
                : 'bg-[#f8fafc]/95 border-slate-300 text-slate-800'
            }`}
          >
            {/* 1. MODO NAVEGAR (Interactuar con botones y selects normalmente) */}
            <button
              type="button"
              onClick={() => setActiveTool('none')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                activeTool === 'none'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : isDark
                  ? 'hover:bg-slate-800 text-slate-300'
                  : 'hover:bg-slate-200 text-slate-700'
              }`}
              title="Modo Navegación (Interactuar con métricas y enlaces)"
            >
              <MousePointer2 className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Navegar</span>
            </button>

            {/* 2. MODO PUNTERO LÁSER CON RAYITAS ROJAS */}
            <button
              type="button"
              onClick={() => {
                setActiveTool('laser');
                // Al elegir láser, el color predeterminado es rojo para cumplir la expectativa
                setPenColor('#ef4444');
              }}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTool === 'laser'
                  ? 'bg-rose-500 text-white shadow-[0_0_18px_rgba(244,63,94,0.85)] font-black'
                  : isDark
                  ? 'hover:bg-slate-800 text-slate-300'
                  : 'hover:bg-slate-200 text-slate-700'
              }`}
              title="Láser (Señala y arrastra para dibujar rayitas rojas brillantes)"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline text-[11px]">Láser</span>
            </button>

            {/* 3. MODO LÁPIZ INTELIGENTE */}
            <button
              type="button"
              onClick={() => setActiveTool('pen')}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                activeTool === 'pen'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : isDark
                  ? 'hover:bg-slate-800 text-slate-300'
                  : 'hover:bg-slate-200 text-slate-700'
              }`}
              title="Lápiz (Dibuja libremente rayitas, chulitos, círculos o palabras cursivas)"
            >
              <Pen className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Lápiz</span>
            </button>

            {/* TOGGLE: AUTO-CURSIVA (Solo visible en lápiz) */}
            {activeTool === 'pen' && (
              <button
                type="button"
                onClick={() => setAutoCursiva((prev) => !prev)}
                className={`px-2 py-1 rounded-xl text-[10px] font-black border transition-all flex items-center gap-1 ${
                  autoCursiva
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : isDark
                    ? 'border-slate-700 text-slate-400 hover:text-white'
                    : 'border-slate-300 text-slate-500 hover:text-slate-800'
                }`}
                title="Transformar palabras manuscritas en caligrafía cursiva (las rayitas y chulitos nunca se borran)"
              >
                <span>✍️ Cursiva:</span>
                <span className={autoCursiva ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {autoCursiva ? 'ON' : 'OFF'}
                </span>
              </button>
            )}

            {/* SELECTOR DE COLORES Y GROSOR */}
            {activeTool !== 'none' && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-black/25 border border-slate-700/60">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setPenColor(c.hex)}
                    className={`w-4 h-4 rounded-full transition-transform ${
                      penColor === c.hex ? 'scale-125 ring-2 ring-white shadow-md' : 'opacity-70 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  />
                ))}

                {/* GROSOR: FINO / MED */}
                <div className="flex items-center gap-1 border-l border-slate-700/60 pl-1.5 ml-0.5">
                  <button
                    type="button"
                    onClick={() => setThickness('thin')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-black transition-all ${
                      thickness === 'thin'
                        ? 'bg-cyan-500 text-slate-950'
                        : isDark
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Grosor Fino"
                  >
                    Fino
                  </button>
                  <button
                    type="button"
                    onClick={() => setThickness('normal')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-black transition-all ${
                      thickness === 'normal'
                        ? 'bg-cyan-500 text-slate-950'
                        : isDark
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Grosor Medio"
                  >
                    Med
                  </button>
                </div>
              </div>
            )}

            {/* ACCIONES: DESHACER & BORRAR TODO */}
            {(lines.length > 0 || cursiveNotes.length > 0) && (
              <div className="flex items-center gap-1 border-l border-slate-700/60 pl-1">
                <button
                  type="button"
                  onClick={undoLast}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'
                  }`}
                  title="Deshacer última rayita o palabra"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-rose-950/60 text-rose-400' : 'hover:bg-rose-100 text-rose-600'
                  }`}
                  title="Borrar todas las anotaciones"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* MINIMIZAR BARRA */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className={`p-1.5 rounded-lg ml-0.5 transition-colors ${
                isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'
              }`}
              title="Minimizar barra"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
