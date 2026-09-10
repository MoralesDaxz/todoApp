# 🏗️ Technical Architecture & Design Blueprint

Este documento especifica las decisiones de arquitectura, el flujo de datos, el diseño de la base de datos y la estrategia de seguridad implementada en la aplicación.

---

## 1. Patrón de Arquitectura: Feature-Driven + Colocation

La aplicación sigue una **Arquitectura Basada en Características (Feature-Driven Architecture)**. En lugar de organizar el código por tipo de archivo, el proyecto se divide por dominios de negocio (`auth`, `todos`).

### Capas del Sistema

```text
[ Vistas / Páginas (src/pages) ]
              │
              ▼
[ Módulos de Feature (src/features/todos) ]
  ├── UI Components  ──────► Transiciones y Renderizado (Framer Motion / Tailwind)
  ├── Custom Hooks   ──────► Orquestación de Estado Servidor (TanStack Query)
  ├── API Services   ──────► Cliente Supabase (Queries, RPC, Mutaciones)
  └── Types          ──────► Contratos y Modelos de Datos (TypeScript)
              │
              ▼
[ Infraestructura & Backend (Supabase) ]
  ├── Auth System & Session Context
  ├── RLS Policies (Row Level Security)
  └── Database & RPC Functions (PostgreSQL)
  ```
  ---
##   2. Flujo de Datos y Gestión de Estado
El estado de la aplicación se divide estrictamente en tres niveles para evitar el acoplamiento:

Estado de Sesión Global (AuthContext): Almacena el token JWT y el perfil del usuario activo instanciado por el cliente de Supabase.

Estado de Servidor (TanStack Query): Maneja el almacenamiento en caché, la invalidación de datos y la sincronización en tiempo real tras mutaciones (creación, cambio de estado de tareas o eliminación de miembros).

Estado Local (React useState): Reservado para la interactividad de la UI (control de modales, inputs de texto temporal y estados de animación).
---
Ciclo de Mutación y Caché (Ejemplo: Gestión de Tareas)
Invocación: El usuario interactúa con un componente (ej. markAsDoneMutation).

Ejecución API: El hook ejecuta la llamada a Supabase mediante todoService.ts.

Invalidación de Caché: TanStack Query invalida la clave de consulta ['todos', listId].

Re-fetch Automático: Se obtiene el listado actualizado con las reglas de ordenamiento aplicadas (pending -> done_by_user -> confirmed).
---
## 3. Modelo de Base de Datos y Seguridad (Supabase PostgreSQL)
El backend delega la lógica de negocio sensible y la autorización a la base de datos mediante políticas RLS (Row Level Security) y funciones almacenadas RPC.
---
| Tabla | Campos Clave | Descripción |
|-------|--------------|-------------|
| profiles  | id (FK auth.users), nickname  | Almacena la identidad pública del usuario. |
| lists     | id, name, owner_id (FK profiles), invite_code | Contiene la información general de la lista. |
| list_members  | list_id (FK), user_id (FK), role (read | write)   |    Tabla intermedia de asignación de permisos.     |
| todos  | id, list_id (FK), task, status, created_by      |   Tareas con estados: pending, done_by_user, confirmed.      |
---
## 4. Políticas de Seguridad (RLS) & Transacciones RPC
**Acceso Granular:** Las consultas SELECT, INSERT y UPDATE en *todos* y *lists* verifican si *auth.uid()* coincide con *owner_id* o si el usuario existe en *list_members*.

**Eliminación de Miembros:**  Restringida por RLS únicamente al owner_id de la lista.

**Inserción Segura vía RPC (join_list_by_code):**  La incorporación de nuevos miembros se realiza mediante una función PostgreSQL almacenada que valida la existencia del código de invitación y evita duplicados transaccionalmente antes de insertar el registro.
