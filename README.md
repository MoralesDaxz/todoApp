# 📝 To-Do App

Aplicación web para la gestión de listas de tareas en tiempo real. Permite crear listas, gestionar permisos de miembros (lectura/escritura), unirse mediante códigos de invitación y hacer seguimiento del estado de las tareas con una experiencia de usuario fluida y optimizada para dispositivos móviles (PWA).

---

## 🛠️ Stack Tecnológico

* **Frontend:** React + TypeScript + Vite
* **Estilos & UI:** Tailwind CSS + Framer Motion (animaciones)
* **Gestión de Estado & Cache:** TanStack Query (React Query v5)
* **Tablas de Datos:** TanStack Table (v9)
* **Backend & Base de Datos:** Supabase (PostgreSQL, Auth, RLS Policies & RPCs)
* **Iconos:** React Icons

---

## ✨ Características Principales

* 🔒 **Autenticación y Perfiles:** Registro e inicio de sesión integrados con perfiles de usuario personalizados en PostgreSQL.
* 📋 **Gestión de Listas:** Creación de listas propias y visualización de listas compartidas con indicadores de propietario e invitados.
* 👥 **Colaboración y Roles:**
  * Control de acceso granular (*Owner*, *Write*, *Read*).
  * Eliminación de miembros reservada exclusivamente al propietario mediante políticas RLS.
  * Inserción transaccional de miembros a través de funciones RPC (`join_list_by_code`).
* ⚡ **Control de Tareas:**
  * Estados jerárquicos: `pending` > `done_by_user` > `confirmed`.
  * Flujo de aprobación donde solo el propietario puede dar la confirmación final.
* 📱 **Experiencia Móvil (PWA):**
  * Ajuste dinámico de pantalla mediante `min-h-dvh` para evitar solapamientos con las barras del navegador.
  * Configuración de `manifest.json` y metadatos para ejecución en modo *standalone* (pantalla completa al instalar en el móvil).

---
## 📁 Estructura del Proyecto

El código está organizado siguiendo una **Arquitectura Basada en Características (Feature-Driven)**:

```text
src/
├── components/          # UI global reutilizable (Navbar, Modales genéricos, Layouts)
├── config/              # Inicialización de clientes (Supabase)
├── context/             # Contexto global de sesión (AuthContext)
├── features/            # Módulos encapsulados por dominio
│   ├── auth/            # Formularios y hooks de autenticación
│   └── todos/           # Listas, Tareas, Servicios API, Hooks y Tablas
├── pages/               # Páginas principales vinculadas al enrutador
├── routes/              # Configuración de React Router y Guardias de Navegación
└── utils/               # Utilidades generales (formateo de fechas, etc.)
```
---
## 🚀 Instalación y Configuración Local. 
* Requisitos previos
* Node.js 
* npm o Yarn
* Proyecto activo en Supabase
---
##  📱 Optimización para Experiencia Móvil Nativa (PWA & Mobile-First)
Para lograr que la aplicación web se comporte y visualice exactamente como una aplicación nativa en dispositivos iOS y Android, se implementaron los siguientes ajustes técnicos y de diseño:

**Gestión de Pantalla y Altura Dinámica (dvh):**

* Sustitución de 100vh por min-h-dvh (Dynamic Viewport Height) en la estructura principal. Esto evita que la barra de navegación del navegador móvil (Safari/Chrome) corte o solape los elementos inferiores de la interfaz al aparecer o desaparecer.

**Modo Standalone y Manifest (manifest.json):**

* Configuración del parámetro "display": "standalone" para ocultar la barra de direcciones y botones del navegador al abrir la app instalada.
* Definición de theme_color y background_color para alinear la barra de estado (status bar) del dispositivo con el modo oscuro de la aplicación.

**Metadatos y Soporte iOS (index.html):**

* Inclusión de metaetiquetas apple-mobile-web-app-capable y apple-mobile-web-app-status-bar-style (modo black-translucent).
* Uso de viewport-fit=cover para aprovechar el 100% del área de pantalla en móviles con notch o bordes redondeados.

**UI/UX Táctil Móvil:**

* Eliminación del destello azul de selección nativo al presionar botones mediante la regla CSS -webkit-tap-highlight-color: transparent.
* Áreas de contacto (touch targets) optimizadas a un tamaño mínimo accesible (mínimo 40px–44px) para botones de acción e iconos (FaUsers, FiShare2, checks de tareas).
* Modales y hojas flotantes animadas con Framer Motion y backdrop blur (backdrop-blur-sm), imitando las transiciones y capas nativas de las aplicaciones móviles.
