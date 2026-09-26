import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, Building, FileText, Phone, Calendar, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [personType, setPersonType] = useState('natural'); // 'natural' or 'juridica'
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [docType, setDocType] = useState('CC');
  const [docNum, setDocNum] = useState('');
  const [nit, setNit] = useState('');
  const [gender, setGender] = useState('femenino'); // 'femenino', 'masculino', 'otro'

  // Legal Habeas Data Consent Checkbox
  const [habeasDataConsent, setHabeasDataConsent] = useState(false);
  const [legalError, setLegalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister && !habeasDataConsent) {
      setLegalError('Debes aceptar el tratamiento de datos personales (Ley 1581 de 2012) para registrarte.');
      return;
    }
    setLegalError('');

    // Assign default avatar based on entity type & gender
    let defaultAvatar = '';
    if (personType === 'juridica') {
      // Company / Corporate default logo avatar
      defaultAvatar = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80';
    } else if (gender === 'femenino') {
      // Female default profile avatar
      defaultAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80';
    } else if (gender === 'masculino') {
      // Male default profile avatar
      defaultAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';
    } else {
      // Neutral default profile avatar
      defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
    }

    login({
      name: name || (personType === 'juridica' ? 'Agroservicios de Urabá S.A.S.' : 'Jhon Zapata'),
      email: email || 'usuario@plataformasocial.co',
      avatar: defaultAvatar,
      role: personType === 'juridica' ? 'Empresa Aliada' : 'Emprendedor Social',
      personType,
      gender: personType === 'natural' ? gender : null,
      documentType: docType,
      documentNumber: personType === 'juridica' ? nit : docNum,
    });
    navigate('/mi-cuenta');
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] py-8 sm:py-12 lg:py-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Toggle Login / Register */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl">
          <button
            onClick={() => { setIsRegister(false); setLegalError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              !isRegister
                ? 'bg-psp-cyan text-slate-950 shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => { setIsRegister(true); setLegalError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isRegister
                ? 'bg-psp-cyan text-slate-950 shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Registrarse
          </button>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {isRegister ? 'Crear Cuenta en PSP Urabá' : 'Bienvenido de Nuevo'}
          </h2>
          <p className="text-xs text-slate-500">
            {isRegister ? 'Únete a la red social y productiva de Colombia' : 'Ingresa para acceder a tus servicios e iniciativas'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Persona Type selector if registering */}
          {isRegister && (
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Tipo de Persona</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPersonType('natural')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                    personType === 'natural'
                      ? 'border-psp-cyan bg-psp-cyan/15 text-psp-cyan'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  <User className="w-3.5 h-3.5" /> Persona Natural
                </button>
                <button
                  type="button"
                  onClick={() => setPersonType('juridica')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                    personType === 'juridica'
                      ? 'border-psp-cyan bg-psp-cyan/15 text-psp-cyan'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" /> Empresa / NIT
                </button>
              </div>
            </div>
          )}

          {/* Registration Fields */}
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {personType === 'juridica' ? 'Razón Social / Nombre Empresa' : 'Nombre Completo'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={personType === 'juridica' ? 'Ej. Agrobanano S.A.S.' : 'Ej. María Fernanda Gómez'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              {personType === 'natural' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo Doc. *</label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="CC">Cédula (CC)</option>
                        <option value="CE">Cédula Ext. (CE)</option>
                        <option value="PAS">Pasaporte</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nro. Documento *</label>
                      <input
                        type="text"
                        required
                        placeholder="1017123456"
                        value={docNum}
                        onChange={(e) => setDocNum(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Gender Selector for Avatar Assignment */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Género (Para asignación de avatar por defecto) *
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="femenino">Femenino</option>
                      <option value="masculino">Masculino</option>
                      <option value="otro">Otro / Prefiero no decir</option>
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">NIT de la Empresa *</label>
                  <input
                    type="text"
                    required
                    placeholder="901.234.567-8"
                    value={nit}
                    onChange={(e) => setNit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </>
          )}

          {/* Email & Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico *</label>
            <input
              type="email"
              required
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Contraseña *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Habeas Data Checkbox (Colombia Ley 1581 de 2012) */}
          {isRegister && (
            <div className="pt-2 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={habeasDataConsent}
                  onChange={(e) => {
                    setHabeasDataConsent(e.target.checked);
                    if (e.target.checked) setLegalError('');
                  }}
                  className="mt-0.5 rounded border-slate-300 text-psp-cyan focus:ring-psp-cyan cursor-pointer"
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                  Acepto el tratamiento de mis datos personales de acuerdo con la{' '}
                  <Link to="/politica-de-privacidad" target="_blank" className="text-psp-cyan underline">
                    Política de Privacidad
                  </Link>{' '}
                  (Ley 1581 de 2012 Habeas Data Colombia) y los{' '}
                  <Link to="/terminos-y-condiciones" target="_blank" className="text-psp-cyan underline">
                    Términos del Servicio
                  </Link>. *
                </span>
              </label>

              {legalError && (
                <p className="text-[11px] font-bold text-rose-500 bg-rose-500/10 p-2 rounded-lg">
                  {legalError}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-psp-cyan to-psp-teal text-slate-950 font-extrabold text-sm shadow-lg shadow-psp-cyan/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            <span>{isRegister ? 'Completar Registro' : 'Iniciar Sesión'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default AuthPage;
