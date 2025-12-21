# 📱 Backend – Tienda de Celulares (NestJS)

Este proyecto es el backend de una tienda de celulares, desarrollado con **NestJS**, usando **PostgreSQL** como base de datos principal y **MongoDB** para algunos módulos específicos.

Este README funciona como una guía paso a paso para crear el proyecto desde cero, configurarlo y luego subirlo a GitHub.


## 📖 Descripción del Proyecto

El backend permite manejar las operaciones básicas de una tienda de celulares, como:

- **Autenticación** de usuarios con JWT
- **Gestión de usuarios** y roles
- **Catálogo** de celulares
- **Carrito** de compras
- **Órdenes** de compra y facturación
- **Control de inventario** (kardex)
- **Auditoría** de acciones del sistema
- **Manejo de proveedores**

El proyecto está organizado por módulos y sigue la estructura recomendada por NestJS.


## 🗂️ Módulos del Proyecto

Dentro de `src/` se manejan los siguientes módulos:

- `auth`
- `usuarios`
- `roles`
- `perfil-clientes`
- `celulares`
- `carrito`
- `producto_carrito`
- `orden-compras`
- `detalle_orden_compra`
- `factura`
- `detalle_factura`
- `kardex`
- `mail`
- `auditlog`
- `proveedores`
- `common`


## 🔀 Uso de Bases de Datos

### 🐘 PostgreSQL

Se usa para los datos relacionales y transaccionales:
usuarios, roles, celulares, carrito, órdenes, facturas y kardex.

### 🍃 MongoDB

Se usan dos colecciones en MongoDB:

- `proveedores`
- `auditlog`

MongoDB se usa aquí porque estos datos no requieren relaciones complejas y pueden variar en estructura.


## ⚙️ Prerrequisitos

- Node.js (v18 o superior)
- npm
- PostgreSQL
- MongoDB
- Git
- Visual Studio Code (recomendado)


## 🚀 Paso 1: Crear un Proyecto NestJS

Instalar Nest CLI:

```bash
npm install -g @nestjs/cli
```

Crear el proyecto (reemplazar por el nombre que desees):

```bash
nest new <nombre-del-proyecto>
```

Si hay problemas de permisos en PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Entrar al proyecto:

```bash
cd <nombre-del-proyecto>
```


## 📦 Paso 2: Instalar Dependencias

### Base de datos (PostgreSQL)

```bash
npm install @nestjs/typeorm typeorm pg
```

### Autenticación (JWT)

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer
```

### Variables de entorno

```bash
npm install @nestjs/config
```

### Tipos para bcrypt

```bash
npm install --save-dev @types/bcrypt
```


## 🔑 Paso 3: Configurar Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=<usuario_postgres>
DB_PASS=<password_postgres>
DB_NAME=<nombre_base_datos>

JWT_SECRET=<clave_secreta>
JWT_EXPIRES_IN=3600s

MONGO_URI=mongodb://localhost:27017/<nombre_bd_mongo>
```


## 🧱 Paso 4: Crear los Módulos del Proyecto

```bash
nest g module auth
nest g controller auth --no-spec
nest g service auth --no-spec

nest g module usuarios
nest g controller usuarios --no-spec
nest g service usuarios --no-spec

nest g module roles
nest g controller roles --no-spec
nest g service roles --no-spec

nest g module perfil-clientes
nest g controller perfil-clientes --no-spec
nest g service perfil-clientes --no-spec

nest g module celulares
nest g controller celulares --no-spec
nest g service celulares --no-spec

nest g module proveedores
nest g controller proveedores --no-spec
nest g service proveedores --no-spec

nest g module orden-compras
nest g controller orden-compras --no-spec
nest g service orden-compras --no-spec

nest g module detalle-orden-compra
nest g controller detalle-orden-compra --no-spec
nest g service detalle-orden-compra --no-spec

nest g module factura
nest g controller factura --no-spec
nest g service factura --no-spec

nest g module detalle-factura
nest g controller detalle-factura --no-spec
nest g service detalle-factura --no-spec

nest g module kardex
nest g controller kardex --no-spec
nest g service kardex --no-spec

nest g module carrito
nest g controller carrito --no-spec
nest g service carrito --no-spec

nest g module producto-carrito
nest g controller producto-carrito --no-spec
nest g service producto-carrito --no-spec

nest g module mail
nest g controller mail --no-spec
nest g service mail --no-spec

nest g module auditlog
nest g controller auditlog --no-spec
nest g service auditlog --no-spec

nest g module common
```


## ▶️ Paso 5: Ejecutar el Proyecto

```bash
npm run start:dev
```

El proyecto se ejecuta por defecto en:

```
http://localhost:3000
```


## 🧪 Prueba Rápida (Auth)

```http
POST /auth/login
```

```json
{
  "correo": "usuario@mail.com",
  "contrasena": "123456"
}
```


## ☁️ Paso 6: Subir el Proyecto a GitHub

```bash
git init
git add .
git commit -m "inicio del proyecto backend"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
git push -u origin main
```


## 📝 Notas Finales

- PostgreSQL se usa para la lógica principal del negocio.
- MongoDB se usa solo para `proveedores` y `auditlog`.
- La estructura es modular y permite seguir agregando funcionalidades.
