import React, { useState, useEffect } from 'react';
import { Building2, RefreshCw } from 'lucide-react';
import { companiesApi } from '../../services/companiesApi';
import CompaniesCrudTable from '../../components/admin/CompaniesCrudTable';

const AdminEmpresasPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const data = await companiesApi.list();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando empresas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleResetDemo = () => {
    if (window.confirm('¿Deseas restaurar el catálogo original por defecto?')) {
      const restored = companiesApi.resetToDefaults();
      setCompanies(restored);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Módulo CRUD · Administrador</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Directorio de Empresas Aliadas (CRUD)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sube logos desde tu computador, actualiza el objeto social, la categoría, el % de descuento y gestiona todas las empresas en formato de lista.
          </p>
        </div>

        <button
          onClick={handleResetDemo}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors self-start sm:self-auto"
          title="Restaurar lista por defecto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Restaurar Originales
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-400">
          Cargando directorio de empresas...
        </div>
      ) : (
        <CompaniesCrudTable
          companies={companies}
          onRefresh={loadCompanies}
        />
      )}
    </div>
  );
};

export default AdminEmpresasPage;
