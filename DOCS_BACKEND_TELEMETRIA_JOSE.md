# 📊 Guía de Implementación Backend: Telemetría y Métricas en Vivo para Jose (Antigravity)

> **Para Jose:**  
> Como programas con **Google Antigravity**, puedes copiar y pegar la sección *"Prompt para Antigravity"* directamente en el chat de tu sesión de Antigravity en el repositorio del backend (`Identity Hub`). Tu agente creará las tablas, migraciones y endpoints automáticamente.

---

## ⚡ Prompt Rápido para Pegar en Antigravity:
```text
Actúa como desarrollador backend en Antigravity para la API de Identity Hub (PSP).
Necesitamos implementar el módulo de telemetría y métricas para que el frontend (/admin/metricas) consuma clics y actividad en vivo en los 11 municipios de Urabá y Antioquia.

Por favor realiza:
1. Crea la tabla/migración 'metricas_eventos' con los campos:
   - id: SERIAL PRIMARY KEY
   - tipo: VARCHAR(50) NOT NULL ('visita_pagina', 'click_comercio', 'busqueda', 'catalogo_view')
   - municipio: VARCHAR(100) DEFAULT 'Apartadó' ('Apartadó', 'Turbo', 'Carepa', 'Chigorodó', 'Necoclí', etc.)
   - entidad_id: VARCHAR(100) (opcional, ID o slug del comercio o producto)
   - entidad_nombre: VARCHAR(255) (nombre del comercio o producto)
   - ip_hash: VARCHAR(64) (hash SHA-256 anónimo de la IP para visitas únicas)
   - user_agent_tipo: VARCHAR(20) ('mobile', 'desktop', 'tablet')
   - metadata: JSONB DEFAULT '{}'
   - creado_en: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   - Agrega índices en creado_en DESC, municipio y tipo.

2. Crea el endpoint POST /api/telemetry/event (público o autenticado):
   - Recibe: { tipo, municipio, entidad_id, entidad_nombre, userAgentTipo }
   - Registra el evento en metricas_eventos y responde: { ok: true, mensaje: 'Evento registrado' }.

3. Crea el endpoint GET /api/metricas/resumen (protegido con Bearer token JWT):
   - Agrega la información de los últimos 7 días y los usuarios activos en los últimos 5 minutos.
   - Retorna la estructura JSON requerida por el frontend con:
     * liveUsers (número de usuarios activos recientes)
     * kpis (visitasAcumuladas, nuevasConexiones, tasaCrecimiento, satisfaccion)
     * visitasSemanales (array con [{ dia, visitas, consultas }])
     * distribucionTerritorial (urabaPct y desglose por municipio)
     * topComercios (lista de comercios más consultados)
     * eventosEnVivo (últimos 5 eventos registrados para el ticker en vivo)
```

---

## 2. Esquema de Base de Datos (SQL / PostgreSQL)

Crea la siguiente tabla para almacenar eventos y telemetría de forma ligera y rápida:

```sql
-- 1. Tabla de eventos de telemetría y clics
CREATE TABLE IF NOT EXISTS metricas_eventos (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,              -- 'visita_pagina', 'click_comercio', 'busqueda', 'catalogo_view'
    municipio VARCHAR(100) DEFAULT 'Apartadó', -- 'Apartadó', 'Turbo', 'Carepa', 'Chigorodó', 'Necoclí', 'Medellín', etc.
    entidad_id VARCHAR(100),                -- ID o slug del comercio / producto consultado (opcional)
    entidad_nombre VARCHAR(255),            -- Nombre legible (ej. 'Snacks de Plátano Criollo')
    ip_hash VARCHAR(64),                    -- Hash anónimo de IP para visitas únicas (sin guardar IP cruda por privacidad)
    user_agent_tipo VARCHAR(20) DEFAULT 'mobile', -- 'mobile', 'desktop', 'tablet'
    metadata JSONB DEFAULT '{}',            -- Datos adicionales flexibles
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para consultas y agregaciones rápidas en tiempo real
CREATE INDEX IF NOT EXISTS idx_metricas_creado_en ON metricas_eventos (creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_metricas_municipio ON metricas_eventos (municipio);
CREATE INDEX IF NOT EXISTS idx_metricas_tipo ON metricas_eventos (tipo);
```

---

## 3. Endpoints REST a Implementar

### A. Registrar un Evento / Clic (Público o Autenticado)
* **Método:** `POST`
* **Ruta:** `/api/telemetry/event`
* **Cuerpo de la petición (JSON):**
```json
{
  "tipo": "click_comercio",
  "municipio": "Turbo",
  "entidad_id": "comercio_123",
  "entidad_nombre": "Snacks de Plátano Criollo",
  "userAgentTipo": "mobile"
}
```
* **Respuesta esperada (201 Created):**
```json
{
  "ok": true,
  "mensaje": "Evento registrado exitosamente"
}
```

---

### B. Obtener Resumen y Métricas Agregadas en Tiempo Real
* **Método:** `GET`
* **Ruta:** `/api/metricas/resumen`
* **Seguridad:** Requiere encabezado `Authorization: Bearer <token>` (Permiso: `roles.manage` o `users.read`).
* **Respuesta esperada (200 OK):**
```json
{
  "ok": true,
  "liveUsers": 6,
  "kpis": {
    "visitasAcumuladas": 184,
    "nuevasConexiones": 38,
    "tasaCrecimiento": 15.4,
    "satisfaccion": 4.9
  },
  "visitasSemanales": [
    { "dia": "Lun", "visitas": 20, "consultas": 12 },
    { "dia": "Mar", "visitas": 30, "consultas": 18 },
    { "dia": "Mié", "visitas": 40, "consultas": 25 },
    { "dia": "Jue", "visitas": 25, "consultas": 15 },
    { "dia": "Vie", "visitas": 50, "consultas": 32 },
    { "dia": "Sáb", "visitas": 65, "consultas": 42 },
    { "dia": "Dom", "visitas": 55, "consultas": 35 }
  ],
  "distribucionTerritorial": {
    "urabaPct": 85,
    "municipios": [
      { "nombre": "Apartadó", "porcentaje": 32, "visitas": 59 },
      { "nombre": "Turbo", "porcentaje": 28, "visitas": 52 },
      { "nombre": "Carepa", "porcentaje": 25, "visitas": 46 },
      { "nombre": "Chigorodó / Otros", "porcentaje": 15, "visitas": 27 }
    ]
  },
  "topComercios": [
    {
      "nombre": "Snacks de Plátano Criollo",
      "subtitulo": "Agroemprendedores de Turbo",
      "consultas": 58,
      "monto": "$28.000 cop"
    },
    {
      "nombre": "Leidy Marulanda Technology",
      "subtitulo": "Comercio Aliado Apartadó",
      "consultas": 42,
      "monto": "Tecnología & Móviles"
    },
    {
      "nombre": "Fundación Jóvenes+",
      "subtitulo": "Impacto Social Urabá",
      "consultas": 31,
      "monto": "Donaciones & Proyectos"
    }
  ],
  "eventosEnVivo": [
    {
      "tiempo": "Hace 8s",
      "ciudad": "Apartadó",
      "detalle": "Consulta directa a catálogo de emprendimiento agrícola",
      "tag": "Interacción"
    },
    {
      "tiempo": "Hace 24s",
      "ciudad": "Turbo",
      "detalle": "Usuario exploró comercios del sector puerto y gastronomía",
      "tag": "Visita"
    }
  ]
}
```

---

## 4. Conexión Frontend (Ya preparado)
En cuanto estos dos endpoints estén activos en Render, el frontend de React conectará `api.metricas()` consumiendo exactamente esta estructura JSON, reflejando en tiempo real los datos en el dashboard de `/admin/metricas`.
