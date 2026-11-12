# Entornos del frontend

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../04_FRONTEND_REFERENCE.md).

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [environment.development.ts](#f-comercial-jhoel-app-src-environments-environment-development-ts) | .ts | Configuración de entorno | Arranque / configuración | Configuración de entorno: declara `environment` (sin comentario de documentación en el código). | 0 internas | 0 | Baja (0 consumidores) |
| [environment.ts](#f-comercial-jhoel-app-src-environments-environment-ts) | .ts | Configuración de entorno | Arranque / configuración | Configuración de entorno: declara `environment` (sin comentario de documentación en el código). | 0 internas | 68 | Alta (68 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-app-src-environments-environment-development-ts"></a>

### environment.development.ts

- **Ruta:** [environment.development.ts](../../../../comercial-jhoel-app/src/environments/environment.development.ts) (`comercial-jhoel-app/src/environments/environment.development.ts`, 5 líneas)
- **Tipo:** Configuración de entorno · **Capa:** Arranque / configuración · **Módulo:** Entornos del frontend
- **Responsabilidad:** Configuración de entorno: declara `environment` (sin comentario de documentación en el código).
- **Consumidores:** —

**Constantes exportadas:**

- `environment` (L1) = `{ production: false, apiUrl: 'http://localhost:3000/api', }`
<a id="f-comercial-jhoel-app-src-environments-environment-ts"></a>

### environment.ts

- **Ruta:** [environment.ts](../../../../comercial-jhoel-app/src/environments/environment.ts) (`comercial-jhoel-app/src/environments/environment.ts`, 5 líneas)
- **Tipo:** Configuración de entorno · **Capa:** Arranque / configuración · **Módulo:** Entornos del frontend
- **Responsabilidad:** Configuración de entorno: declara `environment` (sin comentario de documentación en el código).
- **Consumidores:** [auth.interceptor.ts](core-interceptors.md#f-comercial-jhoel-app-src-app-core-interceptors-auth-interceptor-ts), [cash-mutation.interceptor.spec.ts](core-interceptors.md#f-comercial-jhoel-app-src-app-core-interceptors-cash-mutation-interceptor-spec-ts), [cash-mutation.interceptor.ts](core-interceptors.md#f-comercial-jhoel-app-src-app-core-interceptors-cash-mutation-interceptor-ts), [account-receivable-payment.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-account-receivable-payment-service-ts), [account-receivable.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-account-receivable-service-ts), [account-type.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-account-type-service-ts), [alert-settings.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-alert-settings-service-ts), [alerts.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-alerts-service-ts), [asset.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-asset-service-ts), [auth.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-auth-service-ts), [bank-balance.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-balance-service-ts), [bank-deposit.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-deposit-service-ts), [bank-transfer.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-transfer-service-ts), [bank.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-bank-service-ts), [business.service.ts](core-services.md#f-comercial-jhoel-app-src-app-core-services-business-service-ts) y 53 más

**Constantes exportadas:**

- `environment` (L1) = `{ production: true, apiUrl: 'https://api.comercialjhoel.com/api', }`
