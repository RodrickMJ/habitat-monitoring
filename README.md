# 🐹 Monitoreo de Hábitat para Hámster

Proyecto universitario para monitorear en tiempo real el ambiente de un hámster (temperatura, luz, CO₂, cámara) con sensores y una interfaz web. El sistema incluye backend, frontend y despliegue en la nube (AWS).

## 🎯 Objetivos

- Automatizar el monitoreo del hábitat de un hámster
- Visualización en tiempo real con cámara y gráficos
- Registro histórico de las condiciones del entorno

## 🧠 Integrantes y Roles

| Nombre     | Rol                         |
|------------|-----------------------------|
| Rodrigo    | Frontend                    |
| Didier     | Backend, API, DB, sensores  |
| Margarita  | Análisis, documentación     |
| Sensores   | Equipo (Rodrigo + Didier)   |

## 🛠️ Tecnologías

- **Frontend:** React
- **Backend:** Node.js con Express
- **Base de datos:** MongoDB
- **Sensores:** ESP32 + varios módulos
- **Nube:** AWS EC2, S3, RDS

## 🧪 DevOps - Flujo de Ramas

- `main` → Producción
- `qa` → Validación
- `dev` → Desarrollo general
- `hu/#` → Historias de usuario (funcionalidades)
- `issue/#` → Correcciones y bugs
- `new/#` → cambios