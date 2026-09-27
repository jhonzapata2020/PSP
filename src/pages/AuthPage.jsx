import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Mail, 
  Building, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Determine initial tab based on route (/registro vs /ingresar)
  const [isRegister, setIsRegister] = useState(() => location.pathname === '/registro');
  const [personType, setPersonType] = useState('natural'); // 'natural' | 'juridica'
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [docType, setDocType] = useState('CC');
  const [docNum, setDocNum] = useState('');
  const [nit, setNit] = useState('');
  const [gender, setGender] = useState('femenino');

  // Legal Habeas Data Consent Checkbox (Colombia Ley 1581 de 2012)
  const [habeasDataConsent, setHabeasDataConsent] = useState(false);
  const [formError, setFormError] = useState('');
  const [socialLoading, setSocialLoading] = useState(null);

  // Sync tab if URL changes
  useEffect(() => {
    if (location.pathname === '/registro') {
      setIsRegister(true);
    } else if (location.pathname === '/ingresar') {
      setIsRegister(false);
    }
  }, [location.pathname]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister && !habeasDataConsent) {
      setFormError('Debes aceptar el tratamiento de datos personales (Ley 1581 de 2012) para registrarte.');
      return;
    }
    setFormError('');

    // Assign default avatar based on entity type & gender
    let defaultAvatar = '';
    if (personType === 'juridica') {
      defaultAvatar = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80';
    } else if (gender === 'femenino') {
      defaultAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80';
    } else if (gender === 'masculino') {
      defaultAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';
    } else {
      defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
    }

    login({
      name: name || (isRegister ? (personType === 'juridica' ? 'Empresa Aliada Urabá S.A.S.' : 'María Fernanda Gómez') : 'Jhon Zapata'),
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

  const handleSocialLogin = (provider) => {
    setSocialLoading(provider);
    setTimeout(() => {
      login({
        name: `Usuario ${provider}`,
        email: `usuario.${provider.toLowerCase()}@plataformasocial.co`,
        avatar: provider === 'Google' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'Usuario Verificado',
        personType: 'natural',
      });
      setSocialLoading(null);
      navigate('/mi-cuenta');
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0b1311] relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      
      {/* Mesh Gradient Ambient Light Glows */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-gradient-to-tr from-teal-300/30 via-emerald-200/40 to-cyan-300/20 dark:from-emerald-600/15 dark:via-teal-500/10 dark:to-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div 
        className="absolute -bottom-24 right-10 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-300/20 dark:from-teal-500/10 dark:to-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Main Floating Glassmorphic Modal Container */}
      <div className="max-w-md w-full bg-white/90 dark:bg-[#131c1a]/95 backdrop-blur-xl border border-slate-200/80 dark:border-teal-500/20 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl shadow-emerald-500/5 dark:shadow-emerald-950/40 relative z-10 transition-all duration-300">
        
        {/* Pill-Switcher Navigation */}
        <div className="bg-slate-100/90 dark:bg-slate-800/80 p-1.5 rounded-full flex items-center mb-6 border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setFormError(''); }}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/40 ${
              !isRegister
                ? 'bg-gradient-to-r from-[#0c4236] via-[#0d5c4b] to-teal-400 text-white shadow-md shadow-emerald-950/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-medium'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setFormError(''); }}
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500/40 ${
              isRegister
                ? 'bg-gradient-to-r from-[#0c4236] via-[#0d5c4b] to-teal-400 text-white shadow-md shadow-emerald-950/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-medium'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Header & Typography */}
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isRegister ? 'Crea tu Cuenta' : 'Bienvenido de Nuevo'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            {isRegister 
              ? 'Únete a la plataforma social y productiva de Colombia' 
              : 'Ingresa para acceder a tus servicios e iniciativas'}
          </p>
        </div>

        {/* Interactive Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Persona Natural / Jurídica Type Selector (Visible on Register) */}
          {isRegister && (
            <div className="space-y-2 mb-2 animate-fadeIn">
              <label className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Tipo de Persona
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPersonType('natural')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    personType === 'natural'
                      ? 'border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300 font-extrabold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <User className="w-3.5 h-3.5" /> Persona Natural
                </button>
                <button
                  type="button"
                  onClick={() => setPersonType('juridica')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    personType === 'juridica'
                      ? 'border-teal-500 bg-teal-500/10 text-teal-700 dark:text-teal-300 font-extrabold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" /> Empresa / NIT
                </button>
              </div>
            </div>
          )}

          {/* Registration Specific Fields */}
          {isRegister && (
            <div className="space-y-3.5 animate-fadeIn">
              <div>
                <label htmlFor="auth-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {personType === 'juridica' ? 'Razón Social / Nombre Empresa *' : 'Nombre Completo *'}
                </label>
                <div className="relative group">
                  <input
                    id="auth-name"
                    type="text"
                    required
                    placeholder={personType === 'juridica' ? 'Ej. Agrobanano S.A.S.' : 'Ej. María Fernanda Gómez'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>

              {personType === 'natural' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="auth-doctype" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tipo Doc. *
                    </label>
                    <select
                      id="auth-doctype"
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full px-3 py-2.5 sm:py-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
                    >
                      <option value="CC">Cédula (CC)</option>
                      <option value="CE">Cédula Ext. (CE)</option>
                      <option value="PAS">Pasaporte</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="auth-docnum" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nro. Documento *
                    </label>
                    <input
                      id="auth-docnum"
                      type="text"
                      required
                      placeholder="1017123456"
                      value={docNum}
                      onChange={(e) => setDocNum(e.target.value)}
                      className="w-full px-3 py-2.5 sm:py-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="auth-nit" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIT de la Empresa *
                  </label>
                  <input
                    id="auth-nit"
                    type="text"
                    required
                    placeholder="901.234.567-8"
                    value={nit}
                    onChange={(e) => setNit(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              )}
            </div>
          )}

          {/* Email Input Field */}
          <div>
            <label htmlFor="auth-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Correo Electrónico *
            </label>
            <div className="relative group">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-teal-500" />
              <input
                id="auth-email"
                type="email"
                required
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>
          </div>

          {/* Password Input Field with Interactive Eye Toggle */}
          <div>
            <label htmlFor="auth-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Contraseña *
            </label>
            <div className="relative group">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-teal-500" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Auxiliary Link */}
            {!isRegister && (
              <div className="flex justify-end mt-1.5">
                <Link
                  to="/ayuda"
                  className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}
          </div>

          {/* Legal Consent Checkbox (Habeas Data Colombia - Ley 1581 de 2012) */}
          {isRegister && (
            <div className="pt-1 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={habeasDataConsent}
                  onChange={(e) => {
                    setHabeasDataConsent(e.target.checked);
                    if (e.target.checked) setFormError('');
                  }}
                  className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                  Acepto el tratamiento de datos personales de acuerdo con la{' '}
                  <Link to="/politica-de-privacidad" target="_blank" className="text-teal-600 dark:text-teal-400 font-semibold underline hover:text-teal-700">
                    Política de Privacidad
                  </Link>{' '}
                  (Ley 1581 de 2012 Habeas Data) y los{' '}
                  <Link to="/terminos-y-condiciones" target="_blank" className="text-teal-600 dark:text-teal-400 font-semibold underline hover:text-teal-700">
                    Términos del Servicio
                  </Link>. *
                </span>
              </label>
            </div>
          )}

          {/* Error Banner */}
          {formError && (
            <div className="flex items-center gap-2 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900/50">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{formError}</span>
            </div>
          )}

          {/* Main CTA Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0c4236] via-[#0d5c4b] to-teal-400 hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-teal-500/25 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer group mt-2"
          >
            <span>{isRegister ? 'Completar Registro' : 'Iniciar Sesión'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        {/* Social Login Separator & Buttons */}
        <div className="relative flex py-5 items-center justify-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-3 text-xs text-slate-400 font-medium bg-transparent px-1">
            o continúa con
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Social Authentication Grid */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin('Google')}
            disabled={socialLoading !== null}
            aria-label="Continuar con Google"
            className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin('Apple')}
            disabled={socialLoading !== null}
            aria-label="Continuar con Apple"
            className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.1-.97.04-2.17.65-2.86 1.46-.62.72-1.16 1.88-1.01 3 .1.01 2.2.14 2.88-.64" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
