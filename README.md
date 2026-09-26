# 🌿 Plataforma Social con Propósito (PSP) - Urabá & Colombia

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-purple.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/Estado-Etapa%201%20Completada-emerald.svg)]()

> **Ecosistema Social, Productivo e Institucional de la Región de Urabá.**  
> Una aplicación web moderna desarrollada para articular al sector público-privado, productores agrícolas, comercio local, logística portuaria (**Puerto Antioquia 2026**) y la sociedad civil en los 11 municipios de la subregión de Urabá y Colombia.

---

## 🚀 Características Principales

### 🛒 1. Marketplace & Comercio Local
- **Directorio Productivo Subregional**: Catálogo directo de productos agrícolas, café especial de origen, miel orgánica de reservas naturales de Mutatá, artesanías en caña flecha de Necoclí y snacks de plátano.
- **Rutas de Transporte & Servicios**: Consulta de tarifas, tiempos estimados y frecuencias para conectar Apartadó, Turbo, Necoclí, Carepa y Chigorodó.
- **Carrito de Compras Integrado**: Gestión interactiva de ítems y simulación de compra directa con proveedores locales.

### 🏢 2. Directorio Institucional & Empresas Aliadas
- **Alianzas Estratégicas**: Mapeo de organizaciones clave como Augura, Fundauniban, Comfenalco, SENA, EPM y Puerto Antioquia S.A.
- **Métricas de Desarrollo**: Seguimiento de empleos generados, cobertura ODS e impacto comunitario.

### 💬 3. Foro Social & Diálogo Comunitario
- **Mecanismo Participativo**: Espacio abierto para la publicación de iniciativas comunitarias, debates sobre infraestructura regional y proyectos juveniles.

### 🔐 4. Autenticación Adaptativa & Perfil de Usuario
- **Registro Flexible**: Distinción entre **Persona Natural** (selector de género para avatar predeterminado masculino/femenino/neutral) y **Persona Jurídica / Empresa** (avatar empresarial con NIT).
- **Editor de Perfil**: Selector dinámico de avatares predeterminados y gestión de publicaciones propias.

### ⚖️ 5. Cumplimiento Legal Colombia (Etapa 1)
- **Ley 1581 de 2012 (Habeas Data)**: Casilla obligatoria de tratamiento de datos personales en el registro.
- **Páginas Legales Integradas**: Términos y Condiciones (`/terminos-y-condiciones`), Política de Privacidad (`/politica-de-privacidad`) y Política de Cookies (`/politica-de-cookies`).
- **Banner de Consentimiento**: Banner de aceptación de cookies y geolocalización subregional.

### 🎨 6. Sistema de Diseño Institucional & Responsivo
- **Modo Claro (Por Defecto) & Modo Oscuro**: Alternancia de tema accesible con persistencia en `localStorage`.
- **Paleta Institucional**: Verdes bosque (`#0c4236`, `#0f5144`) y tonos teal/emerald de alto contraste.
- **Diseño Mobile-First**: Adaptación perfecta a teléfonos móviles, tabletas y monitores de escritorio.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, React Router DOM v6
- **Build Tool**: Vite 6
- **Estilos & UI**: Tailwind CSS v3, PostCSS, Lucide React (Iconografía)
- **Gestión de Estado**: React Context API (`AuthContext`, `ThemeContext`, `CartContext`)

---

## 📁 Estructura del Proyecto

```text
PSP/
├── public/
│   ├── hero-banner-psp.jpg     # Banner principal hero procesado en alta nitidez
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/                 # Recursos gráficos
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx      # Barra de navegación con Menú Hamburguesa & Acceso
│   │   │   ├── Footer.jsx      # Pie de página institucional y legal
│   │   │   ├── CartDrawer.jsx  # Panel lateral del carrito de compras
│   │   │   ├── CookieConsentBanner.jsx
│   │   │   ├── GeoConsentBanner.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   └── EcommerceFloatingButton.jsx # Botón flotante discreto E-Commerce
│   ├── context/
│   │   ├── AuthContext.jsx     # Gestión de usuario y avatares por género/NIT
│   │   ├── ThemeContext.jsx    # Control de Modo Claro / Oscuro
│   │   └── CartContext.jsx     # Estado global del carrito de compras
│   ├── data/
│   │   └── mockData.js         # Productos, empresas, rutas y foros
│   ├── pages/
│   │   ├── HomePage.jsx        # Portada principal con Banner Hero
│   │   ├── ComercioPage.jsx    # Marketplace & Directorio
│   │   ├── EmpresasAliadasPage.jsx
│   │   ├── ForoPage.jsx
│   │   ├── AyudaPage.jsx
│   │   ├── AuthPage.jsx        # Login / Registro con Habeas Data
│   │   ├── ProfilePage.jsx     # Edición de perfil
│   │   ├── TerminosCondicionesPage.jsx
│   │   ├── PoliticaPrivacidadPage.jsx
│   │   └── PoliticaCookiesPage.jsx
│   ├── App.jsx                 # Enrutamiento principal
│   ├── main.jsx                # Punto de entrada
│   └── index.css               # Configuración base de Tailwind CSS
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## ⚙️ Instalación y Configuración Local

### Requisitos Previos
- **Node.js**: `v18.0.0` o superior
- **npm**: `v9.0.0` o superior (o `yarn` / `pnpm`)

### Pasos para Ejecutar en Desarrollo

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/plataforma-social-psp.git
   cd plataforma-social-psp
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo local:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000/`.

4. **Compilar para Producción:**
   ```bash
   npm run build
   ```
   Los archivos listos para despliegue se generarán en la carpeta `dist/`.

5. **Vista Previa de Producción:**
   ```bash
   npm run preview
   ```

---

## 🗺️ Roadmap de Desarrollo

- [x] **Etapa 1 (Completada)**: Maquetación SPA, sistema de diseño responsivo, legalidad colombiana (Habeas Data, Cookies, Términos), Modo Claro por defecto y Marketplace interactivo.
- [ ] **Etapa 2 (Próximamente)**: Integración con Backend REST API (`https://plataforma-social-back-66121269835.us-west1.run.app/api`), autenticación con JWT y recuperación de contraseña.
- [ ] **Etapa 3 (Próximamente)**: Pasarelas de pago (PSE, Nequi, Daviplata), sistema de reseñas verificadas y notificaciones en tiempo real.

---

## 📜 Licencia & Derechos

Desarrollado para la **Plataforma Social con Propósito (PSP)** • Urabá & Colombia © {new Date().getFullYear()}. Todos los derechos reservados.
