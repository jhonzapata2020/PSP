import React, { useState } from 'react';
import { productsApi } from '../../services/productsApi';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Download, Layers } from 'lucide-react';

export default function AdminProductosPage() {
  const [zipFile, setZipFile]       = useState(null);
  const [dataFile, setDataFile]     = useState(null);
  const [batchSize, setBatchSize]   = useState(25);
  const [autoApprove, setAutoApprove] = useState(true);
  const [status, setStatus]         = useState({ type: '', message: '' });
  const [importReport, setReport]   = useState(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [downloadingTpl, setDlTpl]  = useState(false);

  // ── Paso 1: Subir ZIP de imágenes ──────────────────────────────────────────
  const handleUploadZip = async () => {
    if (!zipFile) return;
    setIsLoading(true);
    setReport(null);
    setStatus({ type: 'info', message: 'Subiendo imágenes a Cloudflare R2... Espera un momento.' });

    try {
      const res = await productsApi.uploadBulkImages(zipFile);
      setStatus({ type: 'success', message: `¡Éxito! ${res.message}. Ahora puedes subir el archivo de productos.` });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Error al subir las imágenes.' });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Paso 2: Subir archivo de catálogo (.xlsx o .csv) ───────────────────────
  const handleUploadDataFile = async () => {
    if (!dataFile) return;
    setIsLoading(true);
    setReport(null);
    setStatus({ type: 'info', message: `Procesando productos en lotes de ${batchSize}...` });

    try {
      const res = await productsApi.uploadBulkProducts(dataFile, batchSize, autoApprove);
      setReport(res);
      setStatus({
        type: res.skipped > 0 ? 'warning' : 'success',
        message: res.message
      });
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Error al procesar el archivo de productos.' });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Descargar plantilla oficial ────────────────────────────────────────────
  const handleDownloadTemplate = async () => {
    setDlTpl(true);
    try {
      await productsApi.downloadBulkTemplate();
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Error al descargar la plantilla.' });
    } finally {
      setDlTpl(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Carga Masiva de Productos
        </h1>
        <button
          onClick={handleDownloadTemplate}
          disabled={downloadingTpl}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
          title="Descarga la plantilla con formato oficial y ejemplos listos para rellenar"
        >
          <Download className="w-4 h-4" />
          {downloadingTpl ? 'Generando plantilla...' : 'Descargar Plantilla Excel (.xlsx)'}
        </button>
      </div>

      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Importa catálogos enteros con sus imágenes vinculadas. Ahora admite archivos <strong>Excel (.xlsx)</strong> con codificación UTF-8 nativa y procesamiento en <strong>lotes automáticos</strong>.
      </p>

      {/* Banner de estado */}
      {status.message && (
        <div className={`p-4 mb-6 rounded-lg flex items-start gap-3 ${
          status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
          status.type === 'warning' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
          status.type === 'error'   ? 'bg-red-100 text-red-800 border border-red-200' :
          'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {status.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
          {status.type === 'warning' && <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />}
          {status.type === 'error'   && <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />}
          {status.type === 'info'    && <span className="animate-spin h-5 w-5 border-2 border-blue-800 border-t-transparent rounded-full shrink-0 mt-0.5" />}
          <div className="flex-1 font-medium">{status.message}</div>
        </div>
      )}

      {/* Reporte de lotes */}
      {importReport && (
        <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-psp-cyan" /> Resumen del Procesamiento por Lotes
            </h3>
            <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">
              {importReport.batches} lote(s) procesados
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
              <span className="block text-2xl font-bold text-slate-700 dark:text-slate-200">{importReport.total}</span>
              <span className="text-xs text-slate-400">Total leídos</span>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="block text-2xl font-bold text-green-600">{importReport.created}</span>
              <span className="text-xs text-green-600 font-medium">Creados con éxito</span>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <span className="block text-2xl font-bold text-amber-600">{importReport.skipped}</span>
              <span className="text-xs text-amber-600 font-medium">Omitidos / Errores</span>
            </div>
          </div>

          {importReport.errors && importReport.errors.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                Detalle de incidencias:
              </h4>
              <ul className="text-xs space-y-1 max-h-48 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                {importReport.errors.map((err, i) => (
                  <li key={i} className="text-red-600 dark:text-red-400">⚠️ {err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Paso 1: ZIP */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border-t-4 border-psp-cyan">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-cyan-100 text-psp-cyan p-3 rounded-full">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">Paso 1: Subir Imágenes (Comprimido)</h2>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Sube un archivo comprimido (<strong>.zip, .rar, .7z, .tar, .gz</strong>) con las carpetas de cada producto nombradas por su SKU (ej. <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">SOMB-001/01.jpg</code>).
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Archivo Comprimido (.zip, .rar, .7z, .tar, .gz)</label>
            <input
              type="file"
              accept=".zip,.rar,.7z,.tar,.gz,.tgz"
              onChange={(e) => setZipFile(e.target.files[0])}
              disabled={isLoading}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-cyan-50 file:text-psp-cyan
                hover:file:bg-cyan-100
                dark:file:bg-slate-700 dark:file:text-cyan-400
                cursor-pointer disabled:opacity-50"
            />
          </div>

          <button
            onClick={handleUploadZip}
            disabled={!zipFile || isLoading}
            className="w-full flex justify-center items-center gap-2 bg-psp-cyan text-white px-4 py-3 rounded-lg shadow-sm hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Subir Imágenes a Cloudflare R2
          </button>
        </div>

        {/* Paso 2: Excel / CSV */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border-t-4 border-emerald-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-xl text-slate-800 dark:text-slate-100">Paso 2: Subir Catálogo (Excel / CSV)</h2>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Sube tu archivo <strong>Excel (.xlsx)</strong> o <strong>CSV (.csv)</strong>. El sistema procesará los productos en lotes y vinculará automáticamente las fotos subidas en el Paso 1.
          </p>

          {/* Configuración de lotes */}
          <div className="flex items-center justify-between mb-3 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tamaño del lote:</span>
            <select
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              disabled={isLoading}
              className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 font-medium"
            >
              <option value={10}>10 productos / lote</option>
              <option value={25}>25 productos / lote (Recomendado)</option>
              <option value={50}>50 productos / lote</option>
              <option value={100}>100 productos / lote</option>
            </select>
          </div>

          {/* Opción Auto-aprobación */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <input
              type="checkbox"
              id="autoApprove"
              checked={autoApprove}
              onChange={(e) => setAutoApprove(e.target.checked)}
              disabled={isLoading}
              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 cursor-pointer"
            />
            <label htmlFor="autoApprove" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              Publicar productos inmediatamente al importar <span className="text-emerald-600 font-bold">(Aprobación automática)</span>
            </label>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Archivo Excel o CSV (.xlsx, .xls, .csv)</label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setDataFile(e.target.files[0])}
              disabled={isLoading}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-emerald-50 file:text-emerald-600
                hover:file:bg-emerald-100
                dark:file:bg-slate-700 dark:file:text-emerald-400
                cursor-pointer disabled:opacity-50"
            />
          </div>

          <button
            onClick={handleUploadDataFile}
            disabled={!dataFile || isLoading}
            className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Procesar Catálogo en Lotes
          </button>
        </div>
      </div>
    </div>
  );
}
