# Módulo backend `news-subscriptions`

> Documento **generado automáticamente** a partir del código fuente (análisis sintáctico con el compilador de TypeScript). Las descripciones vienen de los comentarios de documentación del código; donde no existen se indica. Los "consumidores" se calculan por imports y por uso en plantillas. Volver al [índice de referencia](../../03_BACKEND_REFERENCE.md).

## Endpoints HTTP y recorrido por capas

Para cada ruta: controlador → caso de uso → métodos del puerto de repositorio que invoca → funciones SQL y tablas de su implementación. "Frontend" = métodos de servicios Angular que llaman a esa ruta.

| Ruta | Controlador | Caso(s) de uso | Repositorio → SQL / tablas | Guards / roles | Frontend |
|---|---|---|---|---|---|
| `GET /api/news-subscribers` | [news-subscribers.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/news-subscribers.controller.ts#L38) `NewsSubscribersController.findAll` | [ListNewsSubscribersUseCase](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-list-news-subscribers-use-case-ts) | `NewsSubscriberRepository`.findAll | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsSubscriberService.getSubscribers` |
| `GET /api/news-subscribers/:id` | [news-subscribers.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/news-subscribers.controller.ts#L43) `NewsSubscribersController.findOne` | [GetNewsSubscriberByIdUseCase](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-news-subscriber-by-id-use-case-ts) | `NewsSubscriberRepository`.findById/findAuditLog<br>`NewsPushSubscriptionRepository`.findBySubscriber | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsSubscriberService.getSubscriberById` |
| `POST /api/news-subscribers/:id/activate` | [news-subscribers.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/news-subscribers.controller.ts#L48) `NewsSubscribersController.activate` | [SetNewsSubscriberActiveUseCase](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-set-news-subscriber-active-use-case-ts) | `NewsSubscriberRepository`.findById/setActive/recordAudit | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsSubscriberService.activateSubscriber` |
| `DELETE /api/news-subscribers/:id` | [news-subscribers.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/news-subscribers.controller.ts#L57) `NewsSubscribersController.deactivate` | [SetNewsSubscriberActiveUseCase](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-set-news-subscriber-active-use-case-ts) | `NewsSubscriberRepository`.findById/setActive/recordAudit | UseGuards(JwtAuthGuard, RolesGuard) Roles('ADMIN', 'SUPER_ADMIN') | `NewsSubscriberService.deactivateSubscriber` |
| `GET /api/public-news-subscriptions/types` | [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L44) `PublicNewsSubscriptionController.listTypes` | [ListActiveNewsTypesUseCase](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-list-active-news-types-use-case-ts) | `NewsTypeRepository`.findAll | — | `PublicNewsSubscriptionService.getActiveTypes` |
| `POST /api/public-news-subscriptions/subscribe` | [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L49) `PublicNewsSubscriptionController.subscribe` | [SubscribeToNewsUseCase](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-subscribe-to-news-use-case-ts) | `NewsSubscriberRepository`.findActiveByWhatsapp/replaceTypes/setConsent/recordAudit/findById/createWithTypes<br>`NewsTypeRepository`.findById | UseGuards(ThrottlerGuard) Throttle({ default: { limit: 10, ttl: 60_000 } }) | `PublicNewsSubscriptionService.subscribe` |
| `GET /api/public-news-subscriptions/push/vapid-public-key` | [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L58) `PublicNewsSubscriptionController.getVapidPublicKey` | — | — | — | `PublicNewsSubscriptionService.getVapidPublicKey` |
| `POST /api/public-news-subscriptions/push/subscribe` | [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L63) `PublicNewsSubscriptionController.registerPush` | [RegisterPushSubscriptionUseCase](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-register-push-subscription-use-case-ts) | `NewsSubscriberRepository`.findByManageToken/replaceTypes/setConsent/setActive/findById/createWithTypes/recordAudit<br>`NewsPushSubscriptionRepository`.upsertByEndpoint<br>`NewsTypeRepository`.findById | UseGuards(ThrottlerGuard) Throttle({ default: { limit: 20, ttl: 60_000 } }) | `PublicNewsSubscriptionService.registerPush` |
| `POST /api/public-news-subscriptions/push/unsubscribe` | [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L81) `PublicNewsSubscriptionController.unregisterPush` | [UnregisterPushSubscriptionUseCase](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-unregister-push-subscription-use-case-ts) | `NewsPushSubscriptionRepository`.deactivateByEndpoint | — | `PublicNewsSubscriptionService.unregisterPush` |
| `GET /api/public-news-subscriptions/:token` | [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L87) `PublicNewsSubscriptionController.getByToken` | [GetSubscriptionByTokenUseCase](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-subscription-by-token-use-case-ts) | `NewsSubscriberRepository`.findByManageToken | — | `PublicNewsSubscriptionService.getByToken` |
| `PATCH /api/public-news-subscriptions/:token` | [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L92) `PublicNewsSubscriptionController.updatePreferences` | [UpdateSubscriptionPreferencesUseCase](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-update-subscription-preferences-use-case-ts) | `NewsSubscriberRepository`.findByManageToken/replaceTypes/recordAudit<br>`NewsTypeRepository`.findById | — | `PublicNewsSubscriptionService.updatePreferences` |
| `POST /api/public-news-subscriptions/:token/unsubscribe` | [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L100) `PublicNewsSubscriptionController.unsubscribe` | [UnsubscribeUseCase](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-unsubscribe-use-case-ts) | `NewsSubscriberRepository`.findByManageToken/setActive/recordAudit | — | `PublicNewsSubscriptionService.unsubscribe` |

## Inventario de archivos

| Archivo | Ext. | Tipo | Capa | Responsabilidad | Dependencias internas | Consumidores | Importancia |
|---|---|---|---|---|---|---|---|
| [news-subscriber-output.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-application-dtos-news-subscriber-output-ts) | .ts | DTO de salida (aplicación) | Aplicación | Shape admin — número siempre enmascarado, nunca completo (punto 30 del pedido). | 3 internas | 6 | Media (6 consumidores) |
| [push-sender.port.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-application-ports-push-sender-port-ts) | .ts | Puerto (interfaz) | Aplicación | Puerto (interfaz): declara `PushSubscriptionTarget`, `PushNotificationPayload`, `PushSender`, `PushSendOutcome`, `PUSH_SENDER` (sin comentario de documentación en el código). | 0 internas | 4 | Media (4 consumidores) |
| [get-news-subscriber-by-id.use-case.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-news-subscriber-by-id-use-case-ts) | .ts | Caso de uso | Aplicación | Incluye el historial (punto 13 del pedido: "visualizar historial") y los dispositivos push registrados — número siempre enmascarado, igual que en el listado. | 4 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [get-subscription-by-token.use-case.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-subscription-by-token-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `GetSubscriptionByTokenUseCase` (sin comentario de documentación en el código). | 3 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [list-news-subscribers.use-case.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-list-news-subscribers-use-case-ts) | .ts | Caso de uso | Aplicación | Caso de uso: declara `ListNewsSubscribersUseCase` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [register-push-subscription.use-case.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-register-push-subscription-use-case-ts) | .ts | Caso de uso | Aplicación | Alta/actualización de un dispositivo de Web Push. | 6 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [send-push-for-article.use-case.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-send-push-for-article-use-case-ts) | .ts | Caso de uso | Aplicación | Determina destinatarios (por DISPOSITIVO, no por suscriptor — ver `findEligibleForArticle`), arma el payload una sola vez con datos reales de la noticia, y envía en paralelo a cada dispositivo elegible (`Promise.allSettled` — un fallo nunca bloquea a los demás). | 3 internas; ext.: @nestjs/common, @nestjs/config | 2 | Media (caso de uso) |
| [set-news-subscriber-active.use-case.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-set-news-subscriber-active-use-case-ts) | .ts | Caso de uso | Aplicación | Activar/desactivar desde el admin (punto 13 del pedido) — soft, nunca borra la fila; queda registrado en la bitácora con `performedBy`. | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [subscribe-to-news.use-case.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-subscribe-to-news-use-case-ts) | .ts | Caso de uso | Aplicación | Alta pública de suscripción. | 7 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [unregister-push-subscription.use-case.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-unregister-push-subscription-use-case-ts) | .ts | Caso de uso | Aplicación | Desactiva un único dispositivo por su `endpoint` — el mismo criterio de "credencial opaca" que ya usa `manageToken` (una URL de push generada por el navegador es, en la práctica, imposible de adivinar). | 1 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [unsubscribe.use-case.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-unsubscribe-use-case-ts) | .ts | Caso de uso | Aplicación | Soft — nunca borra físicamente la fila (punto 19/39 del pedido). | 2 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [update-subscription-preferences.use-case.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-update-subscription-preferences-use-case-ts) | .ts | Caso de uso | Aplicación | "Modificar preferencias" (punto 20 del pedido) — nunca "cancelar", solo cambia el conjunto de categorías. | 6 internas; ext.: @nestjs/common | 2 | Media (caso de uso) |
| [build-news-push-payload.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-application-utils-build-news-push-payload-ts) | .ts | Utilidad | Aplicación | Arma el payload que el navegador muestra — nunca contenido inventado, siempre el título/resumen reales de la noticia recién publicada (mismo criterio ya documentado en la extinta `buildNewsWhatsappMessage`). | 1 internas | 1 | Baja (1 consumidores) |
| [mask-whatsapp-number.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-application-utils-mask-whatsapp-number-ts) | .ts | Utilidad | Aplicación | Enmascara todo menos los últimos 4 dígitos — nunca se expone el número completo en ninguna respuesta admin (punto 30 del pedido: privacidad). | 0 internas | 1 | Baja (1 consumidores) |
| [normalize-whatsapp-number.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-application-utils-normalize-whatsapp-number-ts) | .ts | Utilidad | Aplicación | Normaliza un número de WhatsApp a solo dígitos (con `+` inicial opcional preservado) — mismo criterio permisivo que `company_settings.whatsapp`/ `users.phone` en este proyecto (sin validación E.164 estricta, ya que nada más en el código base la exige tampoco). | 0 internas | 1 | Baja (1 consumidores) |
| [news-subscriber.entity.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-entities-news-subscriber-entity-ts) | .ts | Entidad de dominio | Dominio | Un cliente suscrito a recibir noticias — dato enviado públicamente, sin cuenta/sesión (sin `createdBy`/`updatedBy`, mismo criterio que `CatalogRequest`). | 0 internas | 1 | Baja (1 consumidores) |
| [at-least-one-news-type-required.error.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-errors-at-least-one-news-type-required-error-ts) | .ts | Errores de dominio | Dominio | Errores de dominio: declara `AtLeastOneNewsTypeRequiredError` (sin comentario de documentación en el código). | 1 internas | 3 | Media (3 consumidores) |
| [consent-required.error.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-errors-consent-required-error-ts) | .ts | Errores de dominio | Dominio | Nunca se registra una suscripción sin consentimiento explícito — punto 5 del pedido. | 1 internas | 1 | Baja (1 consumidores) |
| [news-subscriber-not-found.error.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-errors-news-subscriber-not-found-error-ts) | .ts | Errores de dominio | Dominio | Reutilizado tanto para un id inválido (admin) como para un `manage_token` inválido/expirado (público) — nunca revela cuál de los dos casos ocurrió. | 1 internas | 5 | Media (5 consumidores) |
| [news-push-subscription.repository.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-push-subscription-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `UpsertPushSubscriptionData`, `PushSubscriptionSummary`, `EligiblePushSubscription`, `NewsPushSubscriptionRepository`, `NEWS_PUSH_SUBSCRIPTION_REPOSITORY` (sin comentario de documentación en el código). | 0 internas | 7 | Media (7 consumidores) |
| [news-subscriber.repository.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-subscriber-repository-ts) | .ts | Puerto de repositorio (interfaz) | Dominio | Puerto de repositorio (interfaz): declara `NewsSubscriberTypeSummary`, `NewsSubscriberListItem`, `NewsSubscriberAuditEntry`, `CreateNewsSubscriberData`, `RecordNewsSubscriberAuditData` (sin comentario de documentación en el código). | 1 internas | 12 | Alta (12 consumidores) |
| [news-push-subscription.orm-entity.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-push-subscription-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Un dispositivo/navegador suscrito a Web Push — ver el doc comment de la migración `CreateNewsPushSubscriptions` para el porqué de cada columna. | 0 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [news-subscriber-audit-log.orm-entity.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-subscriber-audit-log-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Línea de tiempo de consentimiento/preferencias/cancelación — mismo patrón que `day_audit_logs`, no solo columnas `createdBy`/`updatedBy`. | 2 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [news-subscriber-type.orm-entity.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-subscriber-type-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Relación M:N suscriptor↔tipo de noticia — PK compuesta, mismo idioma que `catalog_likes` (ver `modules/likes`). | 0 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [news-subscriber.orm-entity.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-subscriber-orm-entity-ts) | .ts | Entidad ORM (TypeORM) | Infraestructura | Entidad ORM (TypeORM): declara `NewsSubscriberOrmEntity` (sin comentario de documentación en el código). | 0 internas; ext.: typeorm | 2 | Baja (2 consumidores) |
| [typeorm-news-push-subscription.repository.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-typeorm-news-push-subscription-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmNewsPushSubscriptionRepository` (sin comentario de documentación en el código). | 2 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [typeorm-news-subscriber.repository.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-typeorm-news-subscriber-repository-ts) | .ts | Repositorio (implementación) | Infraestructura | Repositorio (implementación): declara `TypeOrmNewsSubscriberRepository` (sin comentario de documentación en el código). | 4 internas; ext.: @nestjs/common, @nestjs/typeorm, typeorm | 1 | Media (repositorio (implementación)) |
| [web-push-sender.service.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-services-web-push-sender-service-ts) | .ts | Servicio | Infraestructura | Implementación real contra Web Push estándar (VAPID) vía la librería `web-push` — sin proveedor externo (ni Firebase ni ningún BSP): el propio navegador del suscriptor es el "proveedor", `web-push` solo firma y cifra el mensaje según RFC 8291/8292. | 1 internas; ext.: @nestjs/common, @nestjs/config, web-push | 1 | Baja (1 consumidores) |
| [news-subscriptions.module.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts) | .ts | Módulo | Arranque / configuración | Suscripción de clientes a Noticias — suscriptores, preferencias (M:N normalizada contra `NewsTypesModule`), consentimiento, bitácora, y ahora Web Push (VAPID) multidispositivo (`news_push_subscriptions`) — reemplaza, para avisar de una noticia nueva, al envío automático por WhatsApp removido en 693299a. | 23 internas; ext.: @nestjs/common, @nestjs/typeorm | 2 | Baja (2 consumidores) |
| [news-subscribers.controller.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-news-subscribers-controller-ts) | .ts | Controlador | Presentación | "Sistema → Suscriptores de Noticias" — admin-only de punta a punta, incluidos los `GET` (expone WhatsApp/consentimiento/preferencias de clientes, nunca abierto ni siquiera a un rol autenticado no-admin) — mismo criterio que `RolesController`. | 8 internas; ext.: @nestjs/common | 1 | Media (controlador) |
| [public-news-subscription.controller.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts) | .ts | Controlador | Presentación | Público, sin guard — backs la sección "Recibe nuestras noticias por WhatsApp" de la landing, el banner de notificaciones push, y la página de autoservicio de preferencias (`/noticias/preferencias/:token`). | 13 internas; ext.: @nestjs/common, @nestjs/config, @nestjs/throttler | 1 | Media (controlador) |
| [news-subscriber.response.dto.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-news-subscriber-response-dto-ts) | .ts | DTO de respuesta | Presentación | DTO de respuesta: declara `NewsSubscriberTypeSummaryDto`, `NewsSubscriberResponseDto`, `NewsSubscriberAuditEntryResponseDto`, `PushSubscriptionSummaryResponseDto`, `NewsSubscriberDetailResponseDto` (sin comentario de documentación en el código). | 0 internas | 2 | Baja (2 consumidores) |
| [register-push-subscription.request.dto.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-register-push-subscription-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `PushSubscriptionKeysDto`, `RegisterPushSubscriptionRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator, class-transformer | 1 | Baja (1 consumidores) |
| [subscribe-to-news.request.dto.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-subscribe-to-news-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `SubscribeToNewsRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [unregister-push-subscription.request.dto.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-unregister-push-subscription-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UnregisterPushSubscriptionRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |
| [update-subscription-preferences.request.dto.ts](#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-update-subscription-preferences-request-dto-ts) | .ts | DTO de entrada | Presentación | DTO de entrada: declara `UpdateSubscriptionPreferencesRequestDto` (sin comentario de documentación en el código). | 0 internas; ext.: class-validator | 1 | Baja (1 consumidores) |

## Detalle por archivo

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-application-dtos-news-subscriber-output-ts"></a>

### news-subscriber-output.ts

- **Ruta:** [news-subscriber-output.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/dtos/news-subscriber-output.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/application/dtos/news-subscriber-output.ts`, 77 líneas)
- **Tipo:** DTO de salida (aplicación) · **Capa:** Aplicación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Shape admin — número siempre enmascarado, nunca completo (punto 30 del pedido).
- **Depende de (archivos del proyecto):** [news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-subscriber-repository-ts), [news-push-subscription.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-push-subscription-repository-ts), [mask-whatsapp-number.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-utils-mask-whatsapp-number-ts)
- **Consumidores:** [get-news-subscriber-by-id.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-news-subscriber-by-id-use-case-ts), [get-subscription-by-token.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-subscription-by-token-use-case-ts), [list-news-subscribers.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-list-news-subscribers-use-case-ts), [register-push-subscription.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-register-push-subscription-use-case-ts), [subscribe-to-news.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-subscribe-to-news-use-case-ts), [update-subscription-preferences.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-update-subscription-preferences-use-case-ts)

**Interfaces, tipos y enums:**

- `interface NewsSubscriberOutput` (L10): Shape admin — número siempre enmascarado, nunca completo (punto 30 del pedido). — miembros: `id`, `whatsappMasked`, `name`, `isActive`, `consentGiven`, `consentAt`, `createdAt`, `updatedAt`, `types`
- `interface NewsSubscriberAuditEntryOutput` (L22): sin documentación — miembros: `id`, `action`, `previousTypeIds`, `newTypeIds`, `performedBy`, `performedByUsername`, `createdAt`
- `interface NewsSubscriberDetailOutput` (L33) extends NewsSubscriberOutput: Detalle admin — igual que el listado, más la bitácora y los dispositivos push registrados (activos e inactivos). — miembros: `auditLog`, `pushDevices`
- `interface SubscriptionOutput` (L44): Shape público — devuelto solo a quien ya posee el `manageToken` secreto (el propio suscriptor). — miembros: `whatsappNumber`, `name`, `manageToken`, `types`
#### Función `toNewsSubscriberOutput` (L51–63)

- **Tipo:** función exportada
- **Firma:** `toNewsSubscriberOutput(item: NewsSubscriberListItem): NewsSubscriberOutput` — [news-subscriber-output.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/dtos/news-subscriber-output.ts#L51)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Dependencias:** `maskWhatsappNumber`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-news-subscriber-by-id.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-news-subscriber-by-id-use-case-ts)

#### Función `toNewsSubscriberAuditEntryOutput` (L65–67)

- **Tipo:** función exportada
- **Firma:** `toNewsSubscriberAuditEntryOutput(entry: NewsSubscriberAuditEntry): NewsSubscriberAuditEntryOutput` — [news-subscriber-output.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/dtos/news-subscriber-output.ts#L65)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** sin llamadas detectadas desde otros archivos

#### Función `toSubscriptionOutput` (L69–76)

- **Tipo:** función exportada
- **Firma:** `toSubscriptionOutput(item: NewsSubscriberListItem): SubscriptionOutput` — [news-subscriber-output.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/dtos/news-subscriber-output.ts#L69)
- **Propósito / descripción:** Sin JSDoc en el código.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [get-subscription-by-token.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-subscription-by-token-use-case-ts), [register-push-subscription.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-register-push-subscription-use-case-ts), [subscribe-to-news.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-subscribe-to-news-use-case-ts), [update-subscription-preferences.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-update-subscription-preferences-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-application-ports-push-sender-port-ts"></a>

### push-sender.port.ts

- **Ruta:** [push-sender.port.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/ports/push-sender.port.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/application/ports/push-sender.port.ts`, 38 líneas)
- **Tipo:** Puerto (interfaz) · **Capa:** Aplicación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Puerto (interfaz): declara `PushSubscriptionTarget`, `PushNotificationPayload`, `PushSender`, `PushSendOutcome`, `PUSH_SENDER` (sin comentario de documentación en el código).
- **Consumidores:** [send-push-for-article.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-send-push-for-article-use-case-ts), [build-news-push-payload.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-utils-build-news-push-payload-ts), [web-push-sender.service.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-services-web-push-sender-service-ts), [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts)

**Interfaces, tipos y enums:**

- `interface PushSubscriptionTarget` (L3): sin documentación — miembros: `endpoint`, `p256dh`, `auth`
- `interface PushNotificationPayload` (L16): Payload exacto que espera el Service Worker de Angular (`SwPush`) — ver `buildNewsPushPayload`. — miembros: `title`, `body`, `icon`, `onActionClickUrl`
- `interface PushSender` (L35): Puerto de envío de Web Push — nunca lanza (mismo contrato que el extinto `WhatsAppSender`): cualquier resultado, incluido un endpoint muerto (410/404 del navegador/proveedor push), vuelve como un `PushSendOutcome` normal para que el llamador decida qué columna de `news_push_deliveries` actualizar — nunca una excepción sin capturar. — miembros: `send`
- `type PushSendOutcome` (L23) = `\| { result: 'sent' } \| { result: 'expired'; errorMessage: string } \| { result: 'failed'; errorMessage: string }`

**Constantes exportadas:**

- `PUSH_SENDER` (L1) = `Symbol('PUSH_SENDER')`
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-news-subscriber-by-id-use-case-ts"></a>

### get-news-subscriber-by-id.use-case.ts

- **Ruta:** [get-news-subscriber-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/get-news-subscriber-by-id.use-case.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/get-news-subscriber-by-id.use-case.ts`, 39 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Incluye el historial (punto 13 del pedido: "visualizar historial") y los dispositivos push registrados — número siempre enmascarado, igual que en el listado.
- **Depende de (archivos del proyecto):** [news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-subscriber-repository-ts), [news-push-subscription.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-push-subscription-repository-ts), [news-subscriber-not-found.error.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-errors-news-subscriber-not-found-error-ts), [news-subscriber-output.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-dtos-news-subscriber-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts), [news-subscribers.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-news-subscribers-controller-ts)

#### Clase `GetNewsSubscriberByIdUseCase` (L14–38)

- **Decoradores:** `@Injectable()`
- **Propósito:** Incluye el historial (punto 13 del pedido: "visualizar historial") y los dispositivos push registrados — número siempre enmascarado, igual que en el listado.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_SUBSCRIBER_REPOSITORY) newsSubscriberRepository: NewsSubscriberRepository`, `@Inject(NEWS_PUSH_SUBSCRIPTION_REPOSITORY) newsPushSubscriptionRepository: NewsPushSubscriptionRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 23–37 | `id: string` | `Promise<NewsSubscriberDetailOutput>` |

##### `GetNewsSubscriberByIdUseCase.execute`

- **Firma:** `execute(id: string): Promise<NewsSubscriberDetailOutput>` — [get-news-subscriber-by-id.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/get-news-subscriber-by-id.use-case.ts#L23) (L23–37)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsSubscriberRepository.findById`, `new NewsSubscriberNotFoundError`, `Promise.all`, `this.newsSubscriberRepository.findAuditLog`, `this.newsPushSubscriptionRepository.findBySubscriber`, `toNewsSubscriberOutput`, `auditLog.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsSubscriberNotFoundError()`
- **Consumidores:** [news-subscribers.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-news-subscribers-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-subscription-by-token-use-case-ts"></a>

### get-subscription-by-token.use-case.ts

- **Ruta:** [get-subscription-by-token.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/get-subscription-by-token.use-case.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/get-subscription-by-token.use-case.ts`, 22 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Caso de uso: declara `GetSubscriptionByTokenUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-subscriber-repository-ts), [news-subscriber-not-found.error.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-errors-news-subscriber-not-found-error-ts), [news-subscriber-output.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-dtos-news-subscriber-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts), [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

#### Clase `GetSubscriptionByTokenUseCase` (L7–21)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_SUBSCRIBER_REPOSITORY) newsSubscriberRepository: NewsSubscriberRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–20 | `token: string` | `Promise<SubscriptionOutput>` |

##### `GetSubscriptionByTokenUseCase.execute`

- **Firma:** `execute(token: string): Promise<SubscriptionOutput>` — [get-subscription-by-token.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/get-subscription-by-token.use-case.ts#L14) (L14–20)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsSubscriberRepository.findByManageToken`, `new NewsSubscriberNotFoundError`, `toSubscriptionOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsSubscriberNotFoundError()`
- **Consumidores:** [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-list-news-subscribers-use-case-ts"></a>

### list-news-subscribers.use-case.ts

- **Ruta:** [list-news-subscribers.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/list-news-subscribers.use-case.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/list-news-subscribers.use-case.ts`, 18 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Caso de uso: declara `ListNewsSubscribersUseCase` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-subscriber-repository-ts), [news-subscriber-output.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-dtos-news-subscriber-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts), [news-subscribers.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-news-subscribers-controller-ts)

#### Clase `ListNewsSubscribersUseCase` (L6–17)

- **Decoradores:** `@Injectable()`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_SUBSCRIBER_REPOSITORY) newsSubscriberRepository: NewsSubscriberRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 13–16 | `includeInactive?` | `Promise<NewsSubscriberOutput[]>` |

##### `ListNewsSubscribersUseCase.execute`

- **Firma:** `execute(includeInactive?): Promise<NewsSubscriberOutput[]>` — [list-news-subscribers.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/list-news-subscribers.use-case.ts#L13) (L13–16)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsSubscriberRepository.findAll`, `items.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [news-subscribers.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-news-subscribers-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-register-push-subscription-use-case-ts"></a>

### register-push-subscription.use-case.ts

- **Ruta:** [register-push-subscription.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/register-push-subscription.use-case.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/register-push-subscription.use-case.ts`, 108 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Alta/actualización de un dispositivo de Web Push.
- **Depende de (archivos del proyecto):** [news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-subscriber-repository-ts), [news-push-subscription.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-push-subscription-repository-ts), [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts), [invalid-news-type.error.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-errors-invalid-news-type-error-ts), [at-least-one-news-type-required.error.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-errors-at-least-one-news-type-required-error-ts), [news-subscriber-output.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-dtos-news-subscriber-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts), [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

**Interfaces, tipos y enums:**

- `interface RegisterPushSubscriptionInput` (L12): sin documentación — miembros: `endpoint`, `p256dh`, `auth`, `userAgent`, `typeIds`, `existingManageToken`

#### Clase `RegisterPushSubscriptionUseCase` (L40–107)

- **Decoradores:** `@Injectable()`
- **Propósito:** Alta/actualización de un dispositivo de Web Push. Reutiliza COMPLETAMENTE el módulo de suscriptores existente — nunca un "suscriptor push" paralelo: mismo `NewsSubscriber` (`whatsappNumber: null` cuando no hay número), mismas categorías vía `news_subscriber_types`, mismo `manageToken` de autoservicio. Lo único genuinamente nuevo es la fila en `news_push_subscriptions` (el dispositivo en sí) — ver `NewsPushSubscriptionRepository.upsertByEndpoint` para por qué reintentar desde el mismo navegador nunca duplica.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_SUBSCRIBER_REPOSITORY) newsSubscriberRepository: NewsSubscriberRepository`, `@Inject(NEWS_PUSH_SUBSCRIPTION_REPOSITORY) newsPushSubscriptionRepository: NewsPushSubscriptionRepository`, `@Inject(NEWS_TYPE_REPOSITORY) newsTypeRepository: NewsTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 51–81 | `input: RegisterPushSubscriptionInput` | `Promise<SubscriptionOutput>` |
| `linkToExisting` | método private async | 83–89 | `subscriberId: string`, `typeIds: string[]`, `now: Date` | (inferido) |
| `createNew` | método private async | 91–106 | `typeIds: string[]`, `now: Date` | (inferido) |

##### `RegisterPushSubscriptionUseCase.execute`

- **Firma:** `execute(input: RegisterPushSubscriptionInput): Promise<SubscriptionOutput>` — [register-push-subscription.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/register-push-subscription.use-case.ts#L51) (L51–81)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new Set`, `new AtLeastOneNewsTypeRequiredError`, `this.newsTypeRepository.findById`, `new InvalidNewsTypeError`, `new Date`, `this.newsSubscriberRepository.findByManageToken`, `this.linkToExisting`, `this.createNew`, `this.newsPushSubscriptionRepository.upsertByEndpoint`, `toSubscriptionOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new AtLeastOneNewsTypeRequiredError()`, `new InvalidNewsTypeError()`
- **Consumidores:** [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

##### `RegisterPushSubscriptionUseCase.linkToExisting`

- **Firma:** `linkToExisting(subscriberId: string, typeIds: string[], now: Date)` — [register-push-subscription.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/register-push-subscription.use-case.ts#L83) (L83–89)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsSubscriberRepository.replaceTypes`, `this.newsSubscriberRepository.setConsent`, `this.newsSubscriberRepository.setActive`, `this.newsSubscriberRepository.findById`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `RegisterPushSubscriptionUseCase.createNew`

- **Firma:** `createNew(typeIds: string[], now: Date)` — [register-push-subscription.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/register-push-subscription.use-case.ts#L91) (L91–106)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsSubscriberRepository.createWithTypes`, `this.newsSubscriberRepository.recordAudit`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-send-push-for-article-use-case-ts"></a>

### send-push-for-article.use-case.ts

- **Ruta:** [send-push-for-article.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/send-push-for-article.use-case.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/send-push-for-article.use-case.ts`, 104 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Determina destinatarios (por DISPOSITIVO, no por suscriptor — ver `findEligibleForArticle`), arma el payload una sola vez con datos reales de la noticia, y envía en paralelo a cada dispositivo elegible (`Promise.allSettled` — un fallo nunca bloquea a los demás).
- **Depende de (archivos del proyecto):** [news-push-subscription.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-push-subscription-repository-ts), [push-sender.port.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-ports-push-sender-port-ts), [build-news-push-payload.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-utils-build-news-push-payload-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/config`
- **Consumidores:** [create-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-create-news-article-use-case-ts), [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts)

**Interfaces, tipos y enums:**

- `interface SendPushForArticleInput` (L9): sin documentación — miembros: `articleId`, `slug`, `title`, `excerpt`, `newsTypeId`

#### Clase `SendPushForArticleUseCase` (L32–103)

- **Decoradores:** `@Injectable()`
- **Propósito:** Determina destinatarios (por DISPOSITIVO, no por suscriptor — ver `findEligibleForArticle`), arma el payload una sola vez con datos reales de la noticia, y envía en paralelo a cada dispositivo elegible (`Promise.allSettled` — un fallo nunca bloquea a los demás). Un endpoint que el navegador confirma muerto (410/404) se marca inactivo de inmediato: los demás dispositivos del mismo suscriptor siguen funcionando sin cambios (punto explícito del pedido). Reemplaza, para el canal push, lo que `CreateNewsNotificationsForArticleUseCase`+`SendPendingNewsNotificationsUseCase` hacían para WhatsApp (ambos removidos en 693299a) — mismo criterio de "nunca bloquear ni poder tumbar la publicación de la noticia", ahora en un solo use case.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_PUSH_SUBSCRIPTION_REPOSITORY) newsPushSubscriptionRepository: NewsPushSubscriptionRepository`, `@Inject(PUSH_SENDER) pushSender: PushSender`, `configService: ConfigService`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 44–102 | `input: SendPushForArticleInput` | `Promise<{ sent: number; failed: number }>` |

##### `SendPushForArticleUseCase.execute`

- **Firma:** `execute(input: SendPushForArticleInput): Promise<{ sent: number; failed: number }>` — [send-push-for-article.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/send-push-for-article.use-case.ts#L44) (L44–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsPushSubscriptionRepository.findEligibleForArticle`, `(this.configService.get<string>('app.frontendUrl') ?? 'http://localhost:4200').replace`, `this.configService.get`, `buildNewsPushPayload`, `Promise.allSettled`, `eligible.map`, `this.newsPushSubscriptionRepository.createDelivery`, `this.pushSender.send`, `this.newsPushSubscriptionRepository.markDeliverySent`, `this.newsPushSubscriptionRepository.markDeliveryExpired`, `this.newsPushSubscriptionRepository.deactivateByEndpoint`, `this.newsPushSubscriptionRepository.markDeliveryFailed`, `this.logger.warn`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [create-news-article.use-case.ts](news.md#f-comercial-jhoel-api-src-modules-news-application-use-cases-create-news-article-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-set-news-subscriber-active-use-case-ts"></a>

### set-news-subscriber-active.use-case.ts

- **Ruta:** [set-news-subscriber-active.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/set-news-subscriber-active.use-case.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/set-news-subscriber-active.use-case.ts`, 29 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Activar/desactivar desde el admin (punto 13 del pedido) — soft, nunca borra la fila; queda registrado en la bitácora con `performedBy`.
- **Depende de (archivos del proyecto):** [news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-subscriber-repository-ts), [news-subscriber-not-found.error.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-errors-news-subscriber-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts), [news-subscribers.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-news-subscribers-controller-ts)

#### Clase `SetNewsSubscriberActiveUseCase` (L7–28)

- **Decoradores:** `@Injectable()`
- **Propósito:** Activar/desactivar desde el admin (punto 13 del pedido) — soft, nunca borra la fila; queda registrado en la bitácora con `performedBy`.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_SUBSCRIBER_REPOSITORY) newsSubscriberRepository: NewsSubscriberRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–27 | `id: string`, `isActive: boolean`, `performedBy: string` | `Promise<void>` |

##### `SetNewsSubscriberActiveUseCase.execute`

- **Firma:** `execute(id: string, isActive: boolean, performedBy: string): Promise<void>` — [set-news-subscriber-active.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/set-news-subscriber-active.use-case.ts#L14) (L14–27)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsSubscriberRepository.findById`, `new NewsSubscriberNotFoundError`, `this.newsSubscriberRepository.setActive`, `this.newsSubscriberRepository.recordAudit`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsSubscriberNotFoundError()`
- **Consumidores:** [news-subscribers.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-news-subscribers-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-subscribe-to-news-use-case-ts"></a>

### subscribe-to-news.use-case.ts

- **Ruta:** [subscribe-to-news.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/subscribe-to-news.use-case.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/subscribe-to-news.use-case.ts`, 87 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Alta pública de suscripción.
- **Depende de (archivos del proyecto):** [news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-subscriber-repository-ts), [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts), [invalid-news-type.error.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-errors-invalid-news-type-error-ts), [consent-required.error.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-errors-consent-required-error-ts), [at-least-one-news-type-required.error.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-errors-at-least-one-news-type-required-error-ts), [normalize-whatsapp-number.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-utils-normalize-whatsapp-number-ts), [news-subscriber-output.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-dtos-news-subscriber-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts), [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

**Interfaces, tipos y enums:**

- `interface SubscribeToNewsInput` (L12): sin documentación — miembros: `whatsappNumber`, `name`, `typeIds`, `consent`

#### Clase `SubscribeToNewsUseCase` (L27–86)

- **Decoradores:** `@Injectable()`
- **Propósito:** Alta pública de suscripción. Si el número ya tiene una suscripción activa, se trata como una actualización de sus preferencias (reemplaza sus categorías, reconfirma el consentimiento) en vez de rechazar con un duplicado — un visitante real reenviando el formulario está cambiando de opinión, no cometiendo un error. Nunca se registra nada sin `consent === true` (punto 5 del pedido).
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_SUBSCRIBER_REPOSITORY) newsSubscriberRepository: NewsSubscriberRepository`, `@Inject(NEWS_TYPE_REPOSITORY) newsTypeRepository: NewsTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 36–85 | `input: SubscribeToNewsInput` | `Promise<SubscriptionOutput>` |

##### `SubscribeToNewsUseCase.execute`

- **Firma:** `execute(input: SubscribeToNewsInput): Promise<SubscriptionOutput>` — [subscribe-to-news.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/subscribe-to-news.use-case.ts#L36) (L36–85)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `new ConsentRequiredError`, `new Set`, `new AtLeastOneNewsTypeRequiredError`, `this.newsTypeRepository.findById`, `new InvalidNewsTypeError`, `normalizeWhatsappNumber`, `input.name?.trim`, `new Date`, `this.newsSubscriberRepository.findActiveByWhatsapp`, `this.newsSubscriberRepository.replaceTypes`, `this.newsSubscriberRepository.setConsent`, `this.newsSubscriberRepository.recordAudit`, `existing.types.map`, `this.newsSubscriberRepository.findById`, `toSubscriptionOutput`, `this.newsSubscriberRepository.createWithTypes`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new ConsentRequiredError()`, `new AtLeastOneNewsTypeRequiredError()`, `new InvalidNewsTypeError()`
- **Consumidores:** [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-unregister-push-subscription-use-case-ts"></a>

### unregister-push-subscription.use-case.ts

- **Ruta:** [unregister-push-subscription.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/unregister-push-subscription.use-case.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/unregister-push-subscription.use-case.ts`, 23 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Desactiva un único dispositivo por su `endpoint` — el mismo criterio de "credencial opaca" que ya usa `manageToken` (una URL de push generada por el navegador es, en la práctica, imposible de adivinar).
- **Depende de (archivos del proyecto):** [news-push-subscription.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-push-subscription-repository-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts), [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

#### Clase `UnregisterPushSubscriptionUseCase` (L12–22)

- **Decoradores:** `@Injectable()`
- **Propósito:** Desactiva un único dispositivo por su `endpoint` — el mismo criterio de "credencial opaca" que ya usa `manageToken` (una URL de push generada por el navegador es, en la práctica, imposible de adivinar). Nunca toca otros dispositivos del mismo suscriptor (punto explícito del pedido) ni el propio suscriptor/sus preferencias — solo ese endpoint.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_PUSH_SUBSCRIPTION_REPOSITORY) newsPushSubscriptionRepository: NewsPushSubscriptionRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 19–21 | `endpoint: string` | `Promise<void>` |

##### `UnregisterPushSubscriptionUseCase.execute`

- **Firma:** `execute(endpoint: string): Promise<void>` — [unregister-push-subscription.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/unregister-push-subscription.use-case.ts#L19) (L19–21)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsPushSubscriptionRepository.deactivateByEndpoint`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-unsubscribe-use-case-ts"></a>

### unsubscribe.use-case.ts

- **Ruta:** [unsubscribe.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/unsubscribe.use-case.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/unsubscribe.use-case.ts`, 32 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Soft — nunca borra físicamente la fila (punto 19/39 del pedido).
- **Depende de (archivos del proyecto):** [news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-subscriber-repository-ts), [news-subscriber-not-found.error.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-errors-news-subscriber-not-found-error-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts), [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

#### Clase `UnsubscribeUseCase` (L7–31)

- **Decoradores:** `@Injectable()`
- **Propósito:** Soft — nunca borra físicamente la fila (punto 19/39 del pedido). Idempotente: desuscribirse dos veces con el mismo token no falla.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_SUBSCRIBER_REPOSITORY) newsSubscriberRepository: NewsSubscriberRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 14–30 | `token: string` | `Promise<void>` |

##### `UnsubscribeUseCase.execute`

- **Firma:** `execute(token: string): Promise<void>` — [unsubscribe.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/unsubscribe.use-case.ts#L14) (L14–30)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsSubscriberRepository.findByManageToken`, `new NewsSubscriberNotFoundError`, `this.newsSubscriberRepository.setActive`, `this.newsSubscriberRepository.recordAudit`, `subscriber.types.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsSubscriberNotFoundError()`
- **Consumidores:** [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-update-subscription-preferences-use-case-ts"></a>

### update-subscription-preferences.use-case.ts

- **Ruta:** [update-subscription-preferences.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/update-subscription-preferences.use-case.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/update-subscription-preferences.use-case.ts`, 57 líneas)
- **Tipo:** Caso de uso · **Capa:** Aplicación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** "Modificar preferencias" (punto 20 del pedido) — nunca "cancelar", solo cambia el conjunto de categorías.
- **Depende de (archivos del proyecto):** [news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-subscriber-repository-ts), [news-type.repository.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-repositories-news-type-repository-ts), [invalid-news-type.error.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-domain-errors-invalid-news-type-error-ts), [news-subscriber-not-found.error.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-errors-news-subscriber-not-found-error-ts), [at-least-one-news-type-required.error.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-errors-at-least-one-news-type-required-error-ts), [news-subscriber-output.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-dtos-news-subscriber-output-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts), [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

#### Clase `UpdateSubscriptionPreferencesUseCase` (L17–56)

- **Decoradores:** `@Injectable()`
- **Propósito:** "Modificar preferencias" (punto 20 del pedido) — nunca "cancelar", solo cambia el conjunto de categorías. El consentimiento ya dado se conserva tal cual (no se pide de nuevo ni se resetea `consent_at`); el cambio queda registrado en la bitácora igualmente.
- **Dependencias inyectadas (constructor):** `@Inject(NEWS_SUBSCRIBER_REPOSITORY) newsSubscriberRepository: NewsSubscriberRepository`, `@Inject(NEWS_TYPE_REPOSITORY) newsTypeRepository: NewsTypeRepository`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `execute` | método public async | 26–55 | `token: string`, `typeIds: string[]` | `Promise<SubscriptionOutput>` |

##### `UpdateSubscriptionPreferencesUseCase.execute`

- **Firma:** `execute(token: string, typeIds: string[]): Promise<SubscriptionOutput>` — [update-subscription-preferences.use-case.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/use-cases/update-subscription-preferences.use-case.ts#L26) (L26–55)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.newsSubscriberRepository.findByManageToken`, `new NewsSubscriberNotFoundError`, `new Set`, `new AtLeastOneNewsTypeRequiredError`, `this.newsTypeRepository.findById`, `new InvalidNewsTypeError`, `this.newsSubscriberRepository.replaceTypes`, `this.newsSubscriberRepository.recordAudit`, `subscriber.types.map`, `toSubscriptionOutput`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Errores que lanza:** `new NewsSubscriberNotFoundError()`, `new AtLeastOneNewsTypeRequiredError()`, `new InvalidNewsTypeError()`
- **Consumidores:** [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-application-utils-build-news-push-payload-ts"></a>

### build-news-push-payload.ts

- **Ruta:** [build-news-push-payload.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/utils/build-news-push-payload.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/application/utils/build-news-push-payload.ts`, 27 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Arma el payload que el navegador muestra — nunca contenido inventado, siempre el título/resumen reales de la noticia recién publicada (mismo criterio ya documentado en la extinta `buildNewsWhatsappMessage`).
- **Depende de (archivos del proyecto):** [push-sender.port.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-ports-push-sender-port-ts)
- **Consumidores:** [send-push-for-article.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-send-push-for-article-use-case-ts)

**Interfaces, tipos y enums:**

- `interface NewsPushPayloadInput` (L3): sin documentación — miembros: `title`, `excerpt`, `url`, `iconUrl`
#### Función `buildNewsPushPayload` (L17–26)

- **Tipo:** función exportada
- **Firma:** `buildNewsPushPayload(input: NewsPushPayloadInput): PushNotificationPayload` — [build-news-push-payload.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/utils/build-news-push-payload.ts#L17)
- **Propósito / descripción:** Arma el payload que el navegador muestra — nunca contenido inventado, siempre el título/resumen reales de la noticia recién publicada (mismo criterio ya documentado en la extinta `buildNewsWhatsappMessage`).
- **Dependencias:** `input.excerpt.slice(0, EXCERPT_LENGTH).trimEnd`, `input.excerpt.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [send-push-for-article.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-send-push-for-article-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-application-utils-mask-whatsapp-number-ts"></a>

### mask-whatsapp-number.ts

- **Ruta:** [mask-whatsapp-number.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/utils/mask-whatsapp-number.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/application/utils/mask-whatsapp-number.ts`, 18 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Enmascara todo menos los últimos 4 dígitos — nunca se expone el número completo en ninguna respuesta admin (punto 30 del pedido: privacidad).
- **Descripción del autor (comentario del archivo):** Enmascara todo menos los últimos 4 dígitos — nunca se expone el número completo en ninguna respuesta admin (punto 30 del pedido: privacidad). Ej. "50212345678" → "+502 **** 5678". `null` (suscriptor solo-push, sin WhatsApp) se devuelve tal cual — nunca se inventa un número.
- **Consumidores:** [news-subscriber-output.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-dtos-news-subscriber-output-ts)
#### Función `maskWhatsappNumber` (L7–17)

- **Tipo:** función exportada
- **Firma:** `maskWhatsappNumber(value: string \| null): string \| null` — [mask-whatsapp-number.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/utils/mask-whatsapp-number.ts#L7)
- **Propósito / descripción:** Enmascara todo menos los últimos 4 dígitos — nunca se expone el número completo en ninguna respuesta admin (punto 30 del pedido: privacidad). Ej. "50212345678" → "+502 **** 5678". `null` (suscriptor solo-push, sin WhatsApp) se devuelve tal cual — nunca se inventa un número.
- **Dependencias:** `value.replace`, `'*'.repeat`, `digits.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [news-subscriber-output.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-dtos-news-subscriber-output-ts)

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-application-utils-normalize-whatsapp-number-ts"></a>

### normalize-whatsapp-number.ts

- **Ruta:** [normalize-whatsapp-number.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/utils/normalize-whatsapp-number.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/application/utils/normalize-whatsapp-number.ts`, 14 líneas)
- **Tipo:** Utilidad · **Capa:** Aplicación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Normaliza un número de WhatsApp a solo dígitos (con `+` inicial opcional preservado) — mismo criterio permisivo que `company_settings.whatsapp`/ `users.phone` en este proyecto (sin validación E.164 estricta, ya que nada más en el código base la exige tampoco).
- **Descripción del autor (comentario del archivo):** Normaliza un número de WhatsApp a solo dígitos (con `+` inicial opcional preservado) — mismo criterio permisivo que `company_settings.whatsapp`/ `users.phone` en este proyecto (sin validación E.164 estricta, ya que nada más en el código base la exige tampoco). Así "+502 1234-5678" y "50212345678" se guardan de forma consistente y comparable.
- **Consumidores:** [subscribe-to-news.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-subscribe-to-news-use-case-ts)
#### Función `normalizeWhatsappNumber` (L8–13)

- **Tipo:** función exportada
- **Firma:** `normalizeWhatsappNumber(value: string): string` — [normalize-whatsapp-number.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/application/utils/normalize-whatsapp-number.ts#L8)
- **Propósito / descripción:** Normaliza un número de WhatsApp a solo dígitos (con `+` inicial opcional preservado) — mismo criterio permisivo que `company_settings.whatsapp`/ `users.phone` en este proyecto (sin validación E.164 estricta, ya que nada más en el código base la exige tampoco). Así "+502 1234-5678" y "50212345678" se guardan de forma consistente y comparable.
- **Dependencias:** `value.trim`, `trimmed.startsWith`, `trimmed.replace`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** [subscribe-to-news.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-subscribe-to-news-use-case-ts)

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-domain-entities-news-subscriber-entity-ts"></a>

### news-subscriber.entity.ts

- **Ruta:** [news-subscriber.entity.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/domain/entities/news-subscriber.entity.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/domain/entities/news-subscriber.entity.ts`, 31 líneas)
- **Tipo:** Entidad de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Un cliente suscrito a recibir noticias — dato enviado públicamente, sin cuenta/sesión (sin `createdBy`/`updatedBy`, mismo criterio que `CatalogRequest`).
- **Descripción del autor (comentario del archivo):** Un cliente suscrito a recibir noticias — dato enviado públicamente, sin cuenta/sesión (sin `createdBy`/`updatedBy`, mismo criterio que `CatalogRequest`). `manageToken` es el mecanismo de autoservicio para cancelar/editar preferencias sin usar el número como autenticación. Las categorías suscritas viven en `news_subscriber_types` (relación normalizada, nunca texto separado por comas) — nunca en estas props. `whatsappNumber` es opcional: un suscriptor puede haberse dado de alta solo por WhatsApp, solo por notificaciones push del navegador (`news_push_subscriptions`), o por ambos — la misma fila 
- **Consumidores:** [news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-subscriber-repository-ts)

**Interfaces, tipos y enums:**

- `interface NewsSubscriberProps` (L20): Un cliente suscrito a recibir noticias — dato enviado públicamente, sin cuenta/sesión (sin `createdBy`/`updatedBy`, mismo criterio que `CatalogRequest`). — miembros: `id`, `whatsappNumber`, `name`, `isActive`, `consentGiven`, `consentAt`, `manageToken`, `createdAt`, `updatedAt`
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-domain-errors-at-least-one-news-type-required-error-ts"></a>

### at-least-one-news-type-required.error.ts

- **Ruta:** [at-least-one-news-type-required.error.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/domain/errors/at-least-one-news-type-required.error.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/domain/errors/at-least-one-news-type-required.error.ts`, 10 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Errores de dominio: declara `AtLeastOneNewsTypeRequiredError` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [register-push-subscription.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-register-push-subscription-use-case-ts), [subscribe-to-news.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-subscribe-to-news-use-case-ts), [update-subscription-preferences.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-update-subscription-preferences-use-case-ts)

#### Clase `AtLeastOneNewsTypeRequiredError` (L3–9)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-domain-errors-consent-required-error-ts"></a>

### consent-required.error.ts

- **Ruta:** [consent-required.error.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/domain/errors/consent-required.error.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/domain/errors/consent-required.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Nunca se registra una suscripción sin consentimiento explícito — punto 5 del pedido.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [subscribe-to-news.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-subscribe-to-news-use-case-ts)

#### Clase `ConsentRequiredError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Nunca se registra una suscripción sin consentimiento explícito — punto 5 del pedido.
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-domain-errors-news-subscriber-not-found-error-ts"></a>

### news-subscriber-not-found.error.ts

- **Ruta:** [news-subscriber-not-found.error.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/domain/errors/news-subscriber-not-found.error.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/domain/errors/news-subscriber-not-found.error.ts`, 11 líneas)
- **Tipo:** Errores de dominio · **Capa:** Dominio · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Reutilizado tanto para un id inválido (admin) como para un `manage_token` inválido/expirado (público) — nunca revela cuál de los dos casos ocurrió.
- **Depende de (archivos del proyecto):** [domain-error.ts](shared.md#f-comercial-jhoel-api-src-shared-domain-domain-error-ts)
- **Consumidores:** [get-news-subscriber-by-id.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-news-subscriber-by-id-use-case-ts), [get-subscription-by-token.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-subscription-by-token-use-case-ts), [set-news-subscriber-active.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-set-news-subscriber-active-use-case-ts), [unsubscribe.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-unsubscribe-use-case-ts), [update-subscription-preferences.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-update-subscription-preferences-use-case-ts)

#### Clase `NewsSubscriberNotFoundError` (L4–10)

- **Herencia / contratos:** extends DomainError
- **Propósito:** Reutilizado tanto para un id inválido (admin) como para un `manage_token` inválido/expirado (público) — nunca revela cuál de los dos casos ocurrió.
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-push-subscription-repository-ts"></a>

### news-push-subscription.repository.ts

- **Ruta:** [news-push-subscription.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/domain/repositories/news-push-subscription.repository.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/domain/repositories/news-push-subscription.repository.ts`, 52 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `UpsertPushSubscriptionData`, `PushSubscriptionSummary`, `EligiblePushSubscription`, `NewsPushSubscriptionRepository`, `NEWS_PUSH_SUBSCRIPTION_REPOSITORY` (sin comentario de documentación en el código).
- **Consumidores:** [news-subscriber-output.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-dtos-news-subscriber-output-ts), [get-news-subscriber-by-id.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-news-subscriber-by-id-use-case-ts), [register-push-subscription.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-register-push-subscription-use-case-ts), [send-push-for-article.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-send-push-for-article-use-case-ts), [unregister-push-subscription.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-unregister-push-subscription-use-case-ts), [typeorm-news-push-subscription.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-typeorm-news-push-subscription-repository-ts), [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts)

**Interfaces, tipos y enums:**

- `interface UpsertPushSubscriptionData` (L3): sin documentación — miembros: `subscriberId`, `endpoint`, `p256dh`, `auth`, `userAgent`
- `interface PushSubscriptionSummary` (L11): sin documentación — miembros: `id`, `userAgent`, `isActive`, `lastSeenAt`, `createdAt`
- `interface EligiblePushSubscription` (L20): Un dispositivo/navegador con sus datos ya resueltos para intentar el envío — nunca solo el id, el llamador (el sender) siempre necesita endpoint/p256dh/auth juntos. — miembros: `id`, `endpoint`, `p256dh`, `auth`
- `interface NewsPushSubscriptionRepository` (L27): sin documentación — miembros: `upsertByEndpoint`, `deactivateByEndpoint`, `findBySubscriber`, `findEligibleForArticle`, `createDelivery`, `markDeliverySent`, `markDeliveryFailed`, `markDeliveryExpired`

**Constantes exportadas:**

- `NEWS_PUSH_SUBSCRIPTION_REPOSITORY` (L1) = `Symbol('NEWS_PUSH_SUBSCRIPTION_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-subscriber-repository-ts"></a>

### news-subscriber.repository.ts

- **Ruta:** [news-subscriber.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/domain/repositories/news-subscriber.repository.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/domain/repositories/news-subscriber.repository.ts`, 66 líneas)
- **Tipo:** Puerto de repositorio (interfaz) · **Capa:** Dominio · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Puerto de repositorio (interfaz): declara `NewsSubscriberTypeSummary`, `NewsSubscriberListItem`, `NewsSubscriberAuditEntry`, `CreateNewsSubscriberData`, `RecordNewsSubscriberAuditData` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-subscriber.entity.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-entities-news-subscriber-entity-ts)
- **Consumidores:** [news-subscriber-output.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-dtos-news-subscriber-output-ts), [get-news-subscriber-by-id.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-news-subscriber-by-id-use-case-ts), [get-subscription-by-token.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-subscription-by-token-use-case-ts), [list-news-subscribers.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-list-news-subscribers-use-case-ts), [register-push-subscription.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-register-push-subscription-use-case-ts), [set-news-subscriber-active.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-set-news-subscriber-active-use-case-ts), [subscribe-to-news.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-subscribe-to-news-use-case-ts), [unsubscribe.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-unsubscribe-use-case-ts), [update-subscription-preferences.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-update-subscription-preferences-use-case-ts), [news-subscriber-audit-log.orm-entity.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-subscriber-audit-log-orm-entity-ts), [typeorm-news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-typeorm-news-subscriber-repository-ts), [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts)

**Interfaces, tipos y enums:**

- `interface NewsSubscriberTypeSummary` (L13): sin documentación — miembros: `id`, `name`, `slug`, `isWildcard`
- `interface NewsSubscriberListItem` (L21) extends NewsSubscriberProps: Una fila de listado/detalle más sus categorías suscritas — el join vive siempre en el repositorio, nunca se reconstruye en la aplicación desde ids sueltos. — miembros: `types`
- `interface NewsSubscriberAuditEntry` (L25): sin documentación — miembros: `id`, `action`, `previousTypeIds`, `newTypeIds`, `performedBy`, `performedByUsername`, `createdAt`
- `interface CreateNewsSubscriberData` (L35): sin documentación — miembros: `whatsappNumber`, `name`, `consentAt`, `typeIds`
- `interface RecordNewsSubscriberAuditData` (L42): sin documentación — miembros: `subscriberId`, `action`, `previousTypeIds`, `newTypeIds`, `performedBy`
- `interface NewsSubscriberRepository` (L50): sin documentación — miembros: `findAll`, `findById`, `findActiveByWhatsapp`, `findByManageToken`, `createWithTypes`, `replaceTypes`, `setConsent`, `setActive`, `recordAudit`, `findAuditLog`
- `type NewsSubscriberAuditAction` (L5) = `\| 'SUBSCRIBED' \| 'PREFERENCES_UPDATED' \| 'UNSUBSCRIBED' \| 'REACTIVATED' \| 'ADMIN_ACTIVATED' \| 'ADMIN_DEACTIVATED'`

**Constantes exportadas:**

- `NEWS_SUBSCRIBER_REPOSITORY` (L3) = `Symbol('NEWS_SUBSCRIBER_REPOSITORY')`
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-push-subscription-orm-entity-ts"></a>

### news-push-subscription.orm-entity.ts

- **Ruta:** [news-push-subscription.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/news-push-subscription.orm-entity.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/news-push-subscription.orm-entity.ts`, 36 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Un dispositivo/navegador suscrito a Web Push — ver el doc comment de la migración `CreateNewsPushSubscriptions` para el porqué de cada columna.
- **Paquetes externos:** `typeorm`
- **Consumidores:** [typeorm-news-push-subscription.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-typeorm-news-push-subscription-repository-ts), [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts)

#### Clase `NewsPushSubscriptionOrmEntity` (L4–35)

- **Decoradores:** `@Entity('news_push_subscriptions')`
- **Propósito:** Un dispositivo/navegador suscrito a Web Push — ver el doc comment de la migración `CreateNewsPushSubscriptions` para el porqué de cada columna.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column subscriberId: string`, `@Column endpoint: string`, `@Column p256dh: string`, `@Column auth: string`, `@Column userAgent: string \| null`, `@Column isActive: boolean`, `@Column lastSeenAt: Date \| null`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-subscriber-audit-log-orm-entity-ts"></a>

### news-subscriber-audit-log.orm-entity.ts

- **Ruta:** [news-subscriber-audit-log.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/news-subscriber-audit-log.orm-entity.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/news-subscriber-audit-log.orm-entity.ts`, 33 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Línea de tiempo de consentimiento/preferencias/cancelación — mismo patrón que `day_audit_logs`, no solo columnas `createdBy`/`updatedBy`.
- **Depende de (archivos del proyecto):** [user.orm-entity.ts](users.md#f-comercial-jhoel-api-src-modules-users-infrastructure-persistence-user-orm-entity-ts), [news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-subscriber-repository-ts)
- **Paquetes externos:** `typeorm`
- **Consumidores:** [typeorm-news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-typeorm-news-subscriber-repository-ts), [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts)

#### Clase `NewsSubscriberAuditLogOrmEntity` (L6–32)

- **Decoradores:** `@Entity('news_subscriber_audit_log')`
- **Propósito:** Línea de tiempo de consentimiento/preferencias/cancelación — mismo patrón que `day_audit_logs`, no solo columnas `createdBy`/`updatedBy`.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column subscriberId: string`, `@Column action: NewsSubscriberAuditAction`, `@Column previousTypeIds: string[] \| null`, `@Column newTypeIds: string[] \| null`, `@Column performedBy: string \| null`, `@ManyToOne performedByUser: UserOrmEntity \| null`, `@CreateDateColumn createdAt: Date`
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-subscriber-type-orm-entity-ts"></a>

### news-subscriber-type.orm-entity.ts

- **Ruta:** [news-subscriber-type.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/news-subscriber-type.orm-entity.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/news-subscriber-type.orm-entity.ts`, 15 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Relación M:N suscriptor↔tipo de noticia — PK compuesta, mismo idioma que `catalog_likes` (ver `modules/likes`).
- **Paquetes externos:** `typeorm`
- **Consumidores:** [typeorm-news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-typeorm-news-subscriber-repository-ts), [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts)

#### Clase `NewsSubscriberTypeOrmEntity` (L4–14)

- **Decoradores:** `@Entity('news_subscriber_types')`
- **Propósito:** Relación M:N suscriptor↔tipo de noticia — PK compuesta, mismo idioma que `catalog_likes` (ver `modules/likes`).
- **Datos / estado que administra:** `@CreateDateColumn createdAt: Date`
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-subscriber-orm-entity-ts"></a>

### news-subscriber.orm-entity.ts

- **Ruta:** [news-subscriber.orm-entity.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/news-subscriber.orm-entity.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/news-subscriber.orm-entity.ts`, 32 líneas)
- **Tipo:** Entidad ORM (TypeORM) · **Capa:** Infraestructura · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Entidad ORM (TypeORM): declara `NewsSubscriberOrmEntity` (sin comentario de documentación en el código).
- **Paquetes externos:** `typeorm`
- **Consumidores:** [typeorm-news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-typeorm-news-subscriber-repository-ts), [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts)

#### Clase `NewsSubscriberOrmEntity` (L3–31)

- **Decoradores:** `@Entity('news_subscribers')`
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Datos / estado que administra:** `@PrimaryGeneratedColumn id: string`, `@Column whatsappNumber: string \| null`, `@Column name: string \| null`, `@Column isActive: boolean`, `@Column consentGiven: boolean`, `@Column consentAt: Date \| null`, `@Column manageToken: string`, `@CreateDateColumn createdAt: Date`, `@UpdateDateColumn updatedAt: Date`
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-typeorm-news-push-subscription-repository-ts"></a>

### typeorm-news-push-subscription.repository.ts

- **Ruta:** [typeorm-news-push-subscription.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts`, 127 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmNewsPushSubscriptionRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-push-subscription.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-push-subscription-repository-ts), [news-push-subscription.orm-entity.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-push-subscription-orm-entity-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts)

#### Clase `TypeOrmNewsPushSubscriptionRepository` (L12–126)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements NewsPushSubscriptionRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(NewsPushSubscriptionOrmEntity) repository: Repository<NewsPushSubscriptionOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `upsertByEndpoint` | método public async | 27–41 | `data: UpsertPushSubscriptionData` | `Promise<void>` |
| `deactivateByEndpoint` | método public async | 43–45 | `endpoint: string` | `Promise<void>` |
| `findBySubscriber` | método public async | 47–59 | `subscriberId: string` | `Promise<PushSubscriptionSummary[]>` |
| `findEligibleForArticle` | método public async | 68–82 | `newsTypeId: string` | `Promise<EligiblePushSubscription[]>` |
| `createDelivery` | método public async | 92–101 | `newsArticleId: string`, `pushSubscriptionId: string` | `Promise<boolean>` |
| `markDeliverySent` | método public async | 103–109 | `newsArticleId: string`, `pushSubscriptionId: string` | `Promise<void>` |
| `markDeliveryFailed` | método public async | 111–117 | `newsArticleId: string`, `pushSubscriptionId: string`, `errorMessage: string` | `Promise<void>` |
| `markDeliveryExpired` | método public async | 119–125 | `newsArticleId: string`, `pushSubscriptionId: string`, `errorMessage: string` | `Promise<void>` |

##### `TypeOrmNewsPushSubscriptionRepository.upsertByEndpoint`

- **Firma:** `upsertByEndpoint(data: UpsertPushSubscriptionData): Promise<void>` — [typeorm-news-push-subscription.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts#L27) (L27–41)
- **Propósito / descripción:** `ON CONFLICT (endpoint) DO UPDATE` — el mismo navegador reintentando la suscripción (ej. tras revocar y volver a conceder permiso) reescribe la fila existente (incluida `subscriber_id`, por si ahora se está vinculando a un `manageToken` distinto) en vez de crear una segunda. `is_active` siempre vuelve a `true` aquí — es literalmente un registro/re-registro.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsPushSubscriptionRepository.deactivateByEndpoint`

- **Firma:** `deactivateByEndpoint(endpoint: string): Promise<void>` — [typeorm-news-push-subscription.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts#L43) (L43–45)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsPushSubscriptionRepository.findBySubscriber`

- **Firma:** `findBySubscriber(subscriberId: string): Promise<PushSubscriptionSummary[]>` — [typeorm-news-push-subscription.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts#L47) (L47–59)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.find`, `orms.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsPushSubscriptionRepository.findEligibleForArticle`

- **Firma:** `findEligibleForArticle(newsTypeId: string): Promise<EligiblePushSubscription[]>` — [typeorm-news-push-subscription.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts#L68) (L68–82)
- **Propósito / descripción:** Mismo criterio wildcard/categoría que ya usaba `createForArticle` de la extinta `news_notifications` — `nt.is_wildcard = true` (nunca comparado contra el nombre/slug) es "Comercial recibe todo". Ahora resuelto por DISPOSITIVO (`news_push_subscriptions`), no por suscriptor: un suscriptor con 3 dispositivos activos produce 3 filas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`
- **Efectos secundarios:** Tablas en su SQL: `news_push_subscriptions`, `news_subscribers`, `news_subscriber_types`, `news_types`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsPushSubscriptionRepository.createDelivery`

- **Firma:** `createDelivery(newsArticleId: string, pushSubscriptionId: string): Promise<boolean>` — [typeorm-news-push-subscription.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts#L92) (L92–101)
- **Propósito / descripción:** `RETURNING id`, no un conteo de filas afectadas — `manager.query()` en esta configuración devuelve solo el array de filas (confirmado directamente, no asumido), nunca una tupla `[rows, affectedCount]`. Con `RETURNING`, una fila que chocó contra `ON CONFLICT DO NOTHING` simplemente no aparece en el array — `rows.length &gt; 0` es la única señal confiable de "sí se insertó" bajo este driver.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`
- **Efectos secundarios:** Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsPushSubscriptionRepository.markDeliverySent`

- **Firma:** `markDeliverySent(newsArticleId: string, pushSubscriptionId: string): Promise<void>` — [typeorm-news-push-subscription.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts#L103) (L103–109)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`
- **Efectos secundarios:** Tablas en su SQL: `news_push_deliveries`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsPushSubscriptionRepository.markDeliveryFailed`

- **Firma:** `markDeliveryFailed(newsArticleId: string, pushSubscriptionId: string, errorMessage: string): Promise<void>` — [typeorm-news-push-subscription.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts#L111) (L111–117)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `errorMessage.slice`
- **Efectos secundarios:** Tablas en su SQL: `news_push_deliveries`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsPushSubscriptionRepository.markDeliveryExpired`

- **Firma:** `markDeliveryExpired(newsArticleId: string, pushSubscriptionId: string, errorMessage: string): Promise<void>` — [typeorm-news-push-subscription.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-push-subscription.repository.ts#L119) (L119–125)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.query`, `errorMessage.slice`
- **Efectos secundarios:** Tablas en su SQL: `news_push_deliveries`; Ejecuta SQL crudo (`query`)
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-typeorm-news-subscriber-repository-ts"></a>

### typeorm-news-subscriber.repository.ts

- **Ruta:** [typeorm-news-subscriber.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts`, 189 líneas)
- **Tipo:** Repositorio (implementación) · **Capa:** Infraestructura · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Repositorio (implementación): declara `TypeOrmNewsSubscriberRepository` (sin comentario de documentación en el código).
- **Depende de (archivos del proyecto):** [news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-subscriber-repository-ts), [news-subscriber.orm-entity.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-subscriber-orm-entity-ts), [news-subscriber-type.orm-entity.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-subscriber-type-orm-entity-ts), [news-subscriber-audit-log.orm-entity.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-subscriber-audit-log-orm-entity-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`, `typeorm`
- **Consumidores:** [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts)

#### Clase `TypeOrmNewsSubscriberRepository` (L16–188)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements NewsSubscriberRepository
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
- **Dependencias inyectadas (constructor):** `@InjectRepository(NewsSubscriberOrmEntity) repository: Repository<NewsSubscriberOrmEntity>`, `@InjectRepository(NewsSubscriberAuditLogOrmEntity) auditRepository: Repository<NewsSubscriberAuditLogOrmEntity>`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `batchTypesFor` | método private async | 33–61 | `subscriberIds: string[]`, `manager?: EntityManager` | `Promise<Map<string, NewsSubscriberTypeSummary[]>>` |
| `toItem` | método private | 64–77 | `orm: NewsSubscriberOrmEntity`, `types: NewsSubscriberTypeSummary[]` | `NewsSubscriberListItem` |
| `toListItem` | método private async | 79–82 | `orm: NewsSubscriberOrmEntity` | `Promise<NewsSubscriberListItem>` |
| `findAll` | método public async | 84–92 | `options?: { activeOnly?: boolean }` | `Promise<NewsSubscriberListItem[]>` |
| `findById` | método public async | 94–97 | `id: string` | `Promise<NewsSubscriberListItem \| null>` |
| `findActiveByWhatsapp` | método public async | 99–102 | `whatsappNumber: string` | `Promise<NewsSubscriberListItem \| null>` |
| `findByManageToken` | método public async | 104–107 | `token: string` | `Promise<NewsSubscriberListItem \| null>` |
| `createWithTypes` | método public async | 109–136 | `data: CreateNewsSubscriberData` | `Promise<NewsSubscriberListItem>` |
| `replaceTypes` | método public async | 138–151 | `subscriberId: string`, `typeIds: string[]` | `Promise<void>` |
| `setConsent` | método public async | 153–155 | `subscriberId: string`, `consentAt: Date` | `Promise<void>` |
| `setActive` | método public async | 157–159 | `subscriberId: string`, `isActive: boolean` | `Promise<void>` |
| `recordAudit` | método public async | 161–171 | `data: RecordNewsSubscriberAuditData` | `Promise<void>` |
| `findAuditLog` | método public async | 173–187 | `subscriberId: string` | `Promise<NewsSubscriberAuditEntry[]>` |

##### `TypeOrmNewsSubscriberRepository.batchTypesFor`

- **Firma:** `batchTypesFor(subscriberIds: string[], manager?: EntityManager): Promise<Map<string, NewsSubscriberTypeSummary[]>>` — [typeorm-news-subscriber.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts#L33) (L33–61)
- **Propósito / descripción:** Batch — una sola consulta para los tipos de todos los suscriptores del listado, nunca N+1. Acepta un `manager` explícito para poder leer dentro de la MISMA transacción que acaba de escribir (leer por el manager por defecto del repositorio, en otra conexión, vería la transacción todavía sin confirmar — bug real ya encontrado y corregido aquí en pruebas end-to-end).
- **Dependencias (llamadas en su cuerpo):** `new Map`, `manager.query`, `map.get`, `list.push`, `map.set`
- **Efectos secundarios:** Tablas en su SQL: `news_subscriber_types`, `news_types`; Ejecuta SQL crudo (`query`)
- **Consumidores:** (mismo archivo)

##### `TypeOrmNewsSubscriberRepository.toItem`

- **Firma:** `toItem(orm: NewsSubscriberOrmEntity, types: NewsSubscriberTypeSummary[]): NewsSubscriberListItem` — [typeorm-news-subscriber.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts#L64) (L64–77)
- **Propósito / descripción:** Construye el item plano directamente desde las columnas del ORM — nunca copiando (spread) una instancia de dominio, cuyos getters no son propiedades propias enumerables.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmNewsSubscriberRepository.toListItem`

- **Firma:** `toListItem(orm: NewsSubscriberOrmEntity): Promise<NewsSubscriberListItem>` — [typeorm-news-subscriber.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts#L79) (L79–82)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `(await this.batchTypesFor([orm.id])).get`, `this.batchTypesFor`, `this.toItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `TypeOrmNewsSubscriberRepository.findAll`

- **Firma:** `findAll(options?: { activeOnly?: boolean }): Promise<NewsSubscriberListItem[]>` — [typeorm-news-subscriber.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts#L84) (L84–92)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.createQueryBuilder('s').orderBy`, `this.repository.createQueryBuilder`, `qb.andWhere`, `qb.getMany`, `this.batchTypesFor`, `orms.map`, `this.toItem`, `typesBySubscriber.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsSubscriberRepository.findById`

- **Firma:** `findById(id: string): Promise<NewsSubscriberListItem \| null>` — [typeorm-news-subscriber.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts#L94) (L94–97)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `this.toListItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsSubscriberRepository.findActiveByWhatsapp`

- **Firma:** `findActiveByWhatsapp(whatsappNumber: string): Promise<NewsSubscriberListItem \| null>` — [typeorm-news-subscriber.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts#L99) (L99–102)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `this.toListItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsSubscriberRepository.findByManageToken`

- **Firma:** `findByManageToken(token: string): Promise<NewsSubscriberListItem \| null>` — [typeorm-news-subscriber.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts#L104) (L104–107)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.findOne`, `this.toListItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsSubscriberRepository.createWithTypes`

- **Firma:** `createWithTypes(data: CreateNewsSubscriberData): Promise<NewsSubscriberListItem>` — [typeorm-news-subscriber.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts#L109) (L109–136)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.transaction`, `manager.save`, `manager.create`, `manager.createQueryBuilder().insert().into(NewsSubscriberTypeOrmEntity).values`, `manager.createQueryBuilder().insert().into`, `manager.createQueryBuilder().insert`, `manager.createQueryBuilder`, `data.typeIds.map`, `manager.findOneOrFail`, `(await this.batchTypesFor([subscriber.id], manager)).get`, `this.batchTypesFor`, `this.toItem`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsSubscriberRepository.replaceTypes`

- **Firma:** `replaceTypes(subscriberId: string, typeIds: string[]): Promise<void>` — [typeorm-news-subscriber.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts#L138) (L138–151)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.manager.transaction`, `manager.delete`, `manager.createQueryBuilder().insert().into(NewsSubscriberTypeOrmEntity).values`, `manager.createQueryBuilder().insert().into`, `manager.createQueryBuilder().insert`, `manager.createQueryBuilder`, `typeIds.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsSubscriberRepository.setConsent`

- **Firma:** `setConsent(subscriberId: string, consentAt: Date): Promise<void>` — [typeorm-news-subscriber.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts#L153) (L153–155)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsSubscriberRepository.setActive`

- **Firma:** `setActive(subscriberId: string, isActive: boolean): Promise<void>` — [typeorm-news-subscriber.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts#L157) (L157–159)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.repository.update`
- **Efectos secundarios:** Actualiza estado (signals): `this.repository.update`
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsSubscriberRepository.recordAudit`

- **Firma:** `recordAudit(data: RecordNewsSubscriberAuditData): Promise<void>` — [typeorm-news-subscriber.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts#L161) (L161–171)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.auditRepository.save`, `this.auditRepository.create`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `TypeOrmNewsSubscriberRepository.findAuditLog`

- **Firma:** `findAuditLog(subscriberId: string): Promise<NewsSubscriberAuditEntry[]>` — [typeorm-news-subscriber.repository.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/persistence/typeorm-news-subscriber.repository.ts#L173) (L173–187)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.auditRepository.find`, `orms.map`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-services-web-push-sender-service-ts"></a>

### web-push-sender.service.ts

- **Ruta:** [web-push-sender.service.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/services/web-push-sender.service.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/services/web-push-sender.service.ts`, 112 líneas)
- **Tipo:** Servicio · **Capa:** Infraestructura · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Implementación real contra Web Push estándar (VAPID) vía la librería `web-push` — sin proveedor externo (ni Firebase ni ningún BSP): el propio navegador del suscriptor es el "proveedor", `web-push` solo firma y cifra el mensaje según RFC 8291/8292.
- **Depende de (archivos del proyecto):** [push-sender.port.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-ports-push-sender-port-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/config`, `web-push`
- **Consumidores:** [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts)

#### Clase `WebPushSenderService` (L22–111)

- **Decoradores:** `@Injectable()`
- **Herencia / contratos:** implements PushSender, OnModuleInit
- **Propósito:** Implementación real contra Web Push estándar (VAPID) vía la librería `web-push` — sin proveedor externo (ni Firebase ni ningún BSP): el propio navegador del suscriptor es el "proveedor", `web-push` solo firma y cifra el mensaje según RFC 8291/8292. Traduce el payload genérico al sobre exacto que espera el Service Worker de Angular (`SwPush`) — `{ notification: { title, body, icon, data: { onActionClick: { default: { operation: 'focusLastFocusedOrOpen', url } } } } }`. `focusLastFocusedOrOpen` es el mecanismo NATIVO de Angular para enfocar una pestaña ya abierta de comercialjhoel.com en vez de abrir una nueva — nunca lógica de click propia en un service worker aparte.
- **Dependencias inyectadas (constructor):** `configService: ConfigService`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `onModuleInit` | método public | 29–40 | — | `void` |
| `send` | método public async | 42–90 | `target: PushSubscriptionTarget`, `payload: PushNotificationPayload` | `Promise<PushSendOutcome>` |
| `extractStatusCode` | método private | 92–98 | `error: unknown` | `number \| null` |
| `extractErrorMessage` | método private | 100–105 | `error: unknown` | `string` |
| `shortEndpoint` | método private | 108–110 | `endpoint: string` | `string` |

##### `WebPushSenderService.onModuleInit`

- **Firma:** `onModuleInit(): void` — [web-push-sender.service.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/services/web-push-sender.service.ts#L29) (L29–40)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.configService.get`, `this.logger.warn`, `webpush.setVapidDetails`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `WebPushSenderService.send`

- **Firma:** `send(target: PushSubscriptionTarget, payload: PushNotificationPayload): Promise<PushSendOutcome>` — [web-push-sender.service.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/services/web-push-sender.service.ts#L42) (L42–90)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `JSON.stringify`, `webpush.sendNotification`, `this.extractStatusCode`, `this.extractErrorMessage`, `this.logger.warn`, `this.shortEndpoint`, `errorMessage.slice`, `this.logger.error`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `WebPushSenderService.extractStatusCode`

- **Firma:** `extractStatusCode(error: unknown): number \| null` — [web-push-sender.service.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/services/web-push-sender.service.ts#L92) (L92–98)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `WebPushSenderService.extractErrorMessage`

- **Firma:** `extractErrorMessage(error: unknown): string` — [web-push-sender.service.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/services/web-push-sender.service.ts#L100) (L100–105)
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

##### `WebPushSenderService.shortEndpoint`

- **Firma:** `shortEndpoint(endpoint: string): string` — [web-push-sender.service.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/infrastructure/services/web-push-sender.service.ts#L108) (L108–110)
- **Propósito / descripción:** Nunca se registra el endpoint completo en logs — es, en la práctica, un identificador único del dispositivo del visitante.
- **Dependencias (llamadas en su cuerpo):** `endpoint.slice`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** (mismo archivo)

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts"></a>

### news-subscriptions.module.ts

- **Ruta:** [news-subscriptions.module.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/news-subscriptions.module.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/news-subscriptions.module.ts`, 66 líneas)
- **Tipo:** Módulo · **Capa:** Arranque / configuración · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Suscripción de clientes a Noticias — suscriptores, preferencias (M:N normalizada contra `NewsTypesModule`), consentimiento, bitácora, y ahora Web Push (VAPID) multidispositivo (`news_push_subscriptions`) — reemplaza, para avisar de una noticia nueva, al envío automático por WhatsApp removido en 693299a.
- **Depende de (archivos del proyecto):** [news-types.module.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-news-types-module-ts), [news-subscriber.orm-entity.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-subscriber-orm-entity-ts), [news-subscriber-type.orm-entity.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-subscriber-type-orm-entity-ts), [news-subscriber-audit-log.orm-entity.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-subscriber-audit-log-orm-entity-ts), [news-push-subscription.orm-entity.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-news-push-subscription-orm-entity-ts), [typeorm-news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-typeorm-news-subscriber-repository-ts), [typeorm-news-push-subscription.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-persistence-typeorm-news-push-subscription-repository-ts), [web-push-sender.service.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-infrastructure-services-web-push-sender-service-ts), [news-subscriber.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-subscriber-repository-ts), [news-push-subscription.repository.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-domain-repositories-news-push-subscription-repository-ts), [push-sender.port.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-ports-push-sender-port-ts), [subscribe-to-news.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-subscribe-to-news-use-case-ts), [get-subscription-by-token.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-subscription-by-token-use-case-ts), [update-subscription-preferences.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-update-subscription-preferences-use-case-ts), [unsubscribe.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-unsubscribe-use-case-ts) y 8 más
- **Paquetes externos:** `@nestjs/common`, `@nestjs/typeorm`
- **Consumidores:** [app.module.ts](root.md#f-comercial-jhoel-api-src-app-module-ts), [news.module.ts](news.md#f-comercial-jhoel-api-src-modules-news-news-module-ts)

#### Clase `NewsSubscriptionsModule` (L37–65)

- **Decoradores:** `@Module({ imports: [ TypeOrmModule.forFeature([ NewsSubscriberOrmEntity, NewsSubscriberTypeOrmEntity, NewsSubscriberAuditLogOrmEntity, NewsPushSubscriptionOrmEnt`
- **Propósito:** Suscripción de clientes a Noticias — suscriptores, preferencias (M:N normalizada contra `NewsTypesModule`), consentimiento, bitácora, y ahora Web Push (VAPID) multidispositivo (`news_push_subscriptions`) — reemplaza, para avisar de una noticia nueva, al envío automático por WhatsApp removido en 693299a. El mismo `NewsSubscriber`/`manageToken`/ `news_subscriber_types` sirve para ambos canales — un suscriptor solo-push simplemente tiene `whatsappNumber: null`, nunca una tabla de suscriptores paralela.
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-news-subscribers-controller-ts"></a>

### news-subscribers.controller.ts

- **Ruta:** [news-subscribers.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/news-subscribers.controller.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/news-subscribers.controller.ts`, 66 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** "Sistema → Suscriptores de Noticias" — admin-only de punta a punta, incluidos los `GET` (expone WhatsApp/consentimiento/preferencias de clientes, nunca abierto ni siquiera a un rol autenticado no-admin) — mismo criterio que `RolesController`.
- **Depende de (archivos del proyecto):** [jwt-auth.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-jwt-auth-guard-ts), [roles.guard.ts](auth.md#f-comercial-jhoel-api-src-modules-auth-infrastructure-guards-roles-guard-ts), [roles.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-roles-decorator-ts), [current-user.decorator.ts](shared.md#f-comercial-jhoel-api-src-shared-decorators-current-user-decorator-ts), [list-news-subscribers.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-list-news-subscribers-use-case-ts), [get-news-subscriber-by-id.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-news-subscriber-by-id-use-case-ts), [set-news-subscriber-active.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-set-news-subscriber-active-use-case-ts), [news-subscriber.response.dto.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-news-subscriber-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`
- **Consumidores:** [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts)

#### Clase `NewsSubscribersController` (L28–65)

- **Decoradores:** `@UseGuards(JwtAuthGuard, RolesGuard)` `@Roles('ADMIN', 'SUPER_ADMIN')` `@Controller('news-subscribers')`
- **Propósito:** "Sistema → Suscriptores de Noticias" — admin-only de punta a punta, incluidos los `GET` (expone WhatsApp/consentimiento/preferencias de clientes, nunca abierto ni siquiera a un rol autenticado no-admin) — mismo criterio que `RolesController`.
- **Dependencias inyectadas (constructor):** `listNewsSubscribersUseCase: ListNewsSubscribersUseCase`, `getNewsSubscriberByIdUseCase: GetNewsSubscriberByIdUseCase`, `setNewsSubscriberActiveUseCase: SetNewsSubscriberActiveUseCase`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `findAll` | método public | 38–41 | `includeInactive?: string` | `Promise<NewsSubscriberResponseDto[]>` |
| `findOne` | método public | 43–46 | `id: string` | `Promise<NewsSubscriberDetailResponseDto>` |
| `activate` | método public | 48–55 | `id: string`, `userId: string` | `Promise<void>` |
| `deactivate` | método public | 57–64 | `id: string`, `userId: string` | `Promise<void>` |

##### `NewsSubscribersController.findAll`

- **Firma:** `findAll(includeInactive?: string): Promise<NewsSubscriberResponseDto[]>` — [news-subscribers.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/news-subscribers.controller.ts#L38) (L38–41)
- **Decoradores:** `@Get()`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Query('includeInactive') includeInactive`
- **Dependencias (llamadas en su cuerpo):** `this.listNewsSubscribersUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsSubscribersController.findOne`

- **Firma:** `findOne(id: string): Promise<NewsSubscriberDetailResponseDto>` — [news-subscribers.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/news-subscribers.controller.ts#L43) (L43–46)
- **Decoradores:** `@Get(':id')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`
- **Dependencias (llamadas en su cuerpo):** `this.getNewsSubscriberByIdUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsSubscribersController.activate`

- **Firma:** `activate(id: string, userId: string): Promise<void>` — [news-subscribers.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/news-subscribers.controller.ts#L48) (L48–55)
- **Decoradores:** `@Post(':id/activate')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.setNewsSubscriberActiveUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `NewsSubscribersController.deactivate`

- **Firma:** `deactivate(id: string, userId: string): Promise<void>` — [news-subscribers.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/news-subscribers.controller.ts#L57) (L57–64)
- **Decoradores:** `@Delete(':id')` `@HttpCode(HttpStatus.NO_CONTENT)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('id', ParseUUIDPipe) id`, `@CurrentUser('userId') userId`
- **Dependencias (llamadas en su cuerpo):** `this.setNewsSubscriberActiveUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts"></a>

### public-news-subscription.controller.ts

- **Ruta:** [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts`, 106 líneas)
- **Tipo:** Controlador · **Capa:** Presentación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** Público, sin guard — backs la sección "Recibe nuestras noticias por WhatsApp" de la landing, el banner de notificaciones push, y la página de autoservicio de preferencias (`/noticias/preferencias/:token`).
- **Depende de (archivos del proyecto):** [list-active-news-types.use-case.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-application-use-cases-list-active-news-types-use-case-ts), [news-type.response.dto.ts](news-types.md#f-comercial-jhoel-api-src-modules-news-types-presentation-dtos-news-type-response-dto-ts), [subscribe-to-news.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-subscribe-to-news-use-case-ts), [get-subscription-by-token.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-get-subscription-by-token-use-case-ts), [update-subscription-preferences.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-update-subscription-preferences-use-case-ts), [unsubscribe.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-unsubscribe-use-case-ts), [register-push-subscription.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-register-push-subscription-use-case-ts), [unregister-push-subscription.use-case.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-application-use-cases-unregister-push-subscription-use-case-ts), [subscribe-to-news.request.dto.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-subscribe-to-news-request-dto-ts), [update-subscription-preferences.request.dto.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-update-subscription-preferences-request-dto-ts), [register-push-subscription.request.dto.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-register-push-subscription-request-dto-ts), [unregister-push-subscription.request.dto.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-unregister-push-subscription-request-dto-ts), [news-subscriber.response.dto.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-news-subscriber-response-dto-ts)
- **Paquetes externos:** `@nestjs/common`, `@nestjs/config`, `@nestjs/throttler`
- **Consumidores:** [news-subscriptions.module.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-news-subscriptions-module-ts)

#### Clase `PublicNewsSubscriptionController` (L31–105)

- **Decoradores:** `@Controller('public-news-subscriptions')`
- **Propósito:** Público, sin guard — backs la sección "Recibe nuestras noticias por WhatsApp" de la landing, el banner de notificaciones push, y la página de autoservicio de preferencias (`/noticias/preferencias/:token`). `:token` nunca es el número de WhatsApp — es el `manageToken` opaco generado al suscribirse (punto 19 del pedido original: no usar el número como autenticación). Rutas literales (`types`, `subscribe`, `push/...`) declaradas antes que `:token` para que Nest nunca las confunda con un token — mismo criterio ya usado en `SalesController` (`GET /sales/current` antes de `GET /sales/:id`).
- **Dependencias inyectadas (constructor):** `listActiveNewsTypesUseCase: ListActiveNewsTypesUseCase`, `subscribeToNewsUseCase: SubscribeToNewsUseCase`, `getSubscriptionByTokenUseCase: GetSubscriptionByTokenUseCase`, `updateSubscriptionPreferencesUseCase: UpdateSubscriptionPreferencesUseCase`, `unsubscribeUseCase: UnsubscribeUseCase`, `registerPushSubscriptionUseCase: RegisterPushSubscriptionUseCase`, `unregisterPushSubscriptionUseCase: UnregisterPushSubscriptionUseCase`, `configService: ConfigService`

| Método | Tipo | Líneas | Parámetros (tipo de entrada) | Retorno |
|---|---|---|---|---|
| `listTypes` | método public | 44–47 | — | `Promise<PublicNewsTypeResponseDto[]>` |
| `subscribe` | método public | 49–55 | `dto: SubscribeToNewsRequestDto` | `Promise<SubscriptionResponseDto>` |
| `getVapidPublicKey` | método public | 58–61 | — | `{ publicKey: string \| null }` |
| `registerPush` | método public | 63–79 | `dto: RegisterPushSubscriptionRequestDto`, `userAgent: string \| undefined` | `Promise<SubscriptionResponseDto>` |
| `unregisterPush` | método public | 81–85 | `dto: UnregisterPushSubscriptionRequestDto` | `Promise<void>` |
| `getByToken` | método public | 87–90 | `token: string` | `Promise<SubscriptionResponseDto>` |
| `updatePreferences` | método public | 92–98 | `token: string`, `dto: UpdateSubscriptionPreferencesRequestDto` | `Promise<SubscriptionResponseDto>` |
| `unsubscribe` | método public | 100–104 | `token: string` | `Promise<void>` |

##### `PublicNewsSubscriptionController.listTypes`

- **Firma:** `listTypes(): Promise<PublicNewsTypeResponseDto[]>` — [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L44) (L44–47)
- **Decoradores:** `@Get('types')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Dependencias (llamadas en su cuerpo):** `this.listActiveNewsTypesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsSubscriptionController.subscribe`

- **Firma:** `subscribe(dto: SubscribeToNewsRequestDto): Promise<SubscriptionResponseDto>` — [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L49) (L49–55)
- **Decoradores:** `@Post('subscribe')` `@HttpCode(HttpStatus.CREATED)` `@UseGuards(ThrottlerGuard)` `@Throttle({ default: { limit: 10, ttl: 60_000 } })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.subscribeToNewsUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsSubscriptionController.getVapidPublicKey`

- **Firma:** `getVapidPublicKey(): { publicKey: string \| null }` — [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L58) (L58–61)
- **Decoradores:** `@Get('push/vapid-public-key')`
- **Propósito / descripción:** Clave pública VAPID — no es secreta, el frontend la necesita para `SwPush.requestSubscription`.
- **Dependencias (llamadas en su cuerpo):** `this.configService.get`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsSubscriptionController.registerPush`

- **Firma:** `registerPush(dto: RegisterPushSubscriptionRequestDto, userAgent: string \| undefined): Promise<SubscriptionResponseDto>` — [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L63) (L63–79)
- **Decoradores:** `@Post('push/subscribe')` `@HttpCode(HttpStatus.CREATED)` `@UseGuards(ThrottlerGuard)` `@Throttle({ default: { limit: 20, ttl: 60_000 } })`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`, `@Headers('user-agent') userAgent`
- **Dependencias (llamadas en su cuerpo):** `this.registerPushSubscriptionUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsSubscriptionController.unregisterPush`

- **Firma:** `unregisterPush(dto: UnregisterPushSubscriptionRequestDto): Promise<void>` — [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L81) (L81–85)
- **Decoradores:** `@Post('push/unsubscribe')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.unregisterPushSubscriptionUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsSubscriptionController.getByToken`

- **Firma:** `getByToken(token: string): Promise<SubscriptionResponseDto>` — [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L87) (L87–90)
- **Decoradores:** `@Get(':token')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('token') token`
- **Dependencias (llamadas en su cuerpo):** `this.getSubscriptionByTokenUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsSubscriptionController.updatePreferences`

- **Firma:** `updatePreferences(token: string, dto: UpdateSubscriptionPreferencesRequestDto): Promise<SubscriptionResponseDto>` — [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L92) (L92–98)
- **Decoradores:** `@Patch(':token')`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('token') token`, `@Body() dto`
- **Dependencias (llamadas en su cuerpo):** `this.updateSubscriptionPreferencesUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

##### `PublicNewsSubscriptionController.unsubscribe`

- **Firma:** `unsubscribe(token: string): Promise<void>` — [public-news-subscription.controller.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/controllers/public-news-subscription.controller.ts#L100) (L100–104)
- **Decoradores:** `@Post(':token/unsubscribe')` `@HttpCode(HttpStatus.OK)`
- **Propósito / descripción:** Sin JSDoc en el código; su comportamiento se deduce de las llamadas listadas.
- **Origen de parámetros:** `@Param('token') token`
- **Dependencias (llamadas en su cuerpo):** `this.unsubscribeUseCase.execute`
- **Efectos secundarios:** Sin efectos externos detectados (lógica en memoria o delega).
- **Consumidores:** no se detectaron llamadas directas (puede invocarse por Nest/Angular: rutas, ciclo de vida, plantilla o inyección).

<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-news-subscriber-response-dto-ts"></a>

### news-subscriber.response.dto.ts

- **Ruta:** [news-subscriber.response.dto.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/dtos/news-subscriber.response.dto.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/presentation/dtos/news-subscriber.response.dto.ts`, 51 líneas)
- **Tipo:** DTO de respuesta · **Capa:** Presentación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** DTO de respuesta: declara `NewsSubscriberTypeSummaryDto`, `NewsSubscriberResponseDto`, `NewsSubscriberAuditEntryResponseDto`, `PushSubscriptionSummaryResponseDto`, `NewsSubscriberDetailResponseDto` (sin comentario de documentación en el código).
- **Consumidores:** [news-subscribers.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-news-subscribers-controller-ts), [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

#### Clase `NewsSubscriberTypeSummaryDto` (L1–6)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `NewsSubscriberResponseDto` (L9–19)

- **Propósito:** Shape admin — número siempre enmascarado (punto 30 del pedido). `null` = suscriptor solo-push, sin WhatsApp.

#### Clase `NewsSubscriberAuditEntryResponseDto` (L21–29)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `PushSubscriptionSummaryResponseDto` (L31–37)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `NewsSubscriberDetailResponseDto` (L39–42)

- **Herencia / contratos:** extends NewsSubscriberResponseDto
- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `SubscriptionResponseDto` (L45–50)

- **Propósito:** Shape público — solo para quien ya posee el `manageToken` secreto. `whatsappNumber: null` si nunca proporcionó WhatsApp (suscriptor solo-push).
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-register-push-subscription-request-dto-ts"></a>

### register-push-subscription.request.dto.ts

- **Ruta:** [register-push-subscription.request.dto.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/dtos/register-push-subscription.request.dto.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/presentation/dtos/register-push-subscription.request.dto.ts`, 36 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** DTO de entrada: declara `PushSubscriptionKeysDto`, `RegisterPushSubscriptionRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`, `class-transformer`
- **Consumidores:** [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

#### Clase `PushSubscriptionKeysDto` (L4–14)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.

#### Clase `RegisterPushSubscriptionRequestDto` (L16–35)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-subscribe-to-news-request-dto-ts"></a>

### subscribe-to-news.request.dto.ts

- **Ruta:** [subscribe-to-news.request.dto.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/dtos/subscribe-to-news.request.dto.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/presentation/dtos/subscribe-to-news.request.dto.ts`, 21 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** DTO de entrada: declara `SubscribeToNewsRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

#### Clase `SubscribeToNewsRequestDto` (L3–20)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-unregister-push-subscription-request-dto-ts"></a>

### unregister-push-subscription.request.dto.ts

- **Ruta:** [unregister-push-subscription.request.dto.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/dtos/unregister-push-subscription.request.dto.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/presentation/dtos/unregister-push-subscription.request.dto.ts`, 9 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** DTO de entrada: declara `UnregisterPushSubscriptionRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

#### Clase `UnregisterPushSubscriptionRequestDto` (L3–8)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
<a id="f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-dtos-update-subscription-preferences-request-dto-ts"></a>

### update-subscription-preferences.request.dto.ts

- **Ruta:** [update-subscription-preferences.request.dto.ts](../../../../comercial-jhoel-api/src/modules/news-subscriptions/presentation/dtos/update-subscription-preferences.request.dto.ts) (`comercial-jhoel-api/src/modules/news-subscriptions/presentation/dtos/update-subscription-preferences.request.dto.ts`, 9 líneas)
- **Tipo:** DTO de entrada · **Capa:** Presentación · **Módulo:** Módulo backend `news-subscriptions`
- **Responsabilidad:** DTO de entrada: declara `UpdateSubscriptionPreferencesRequestDto` (sin comentario de documentación en el código).
- **Paquetes externos:** `class-validator`
- **Consumidores:** [public-news-subscription.controller.ts](news-subscriptions.md#f-comercial-jhoel-api-src-modules-news-subscriptions-presentation-controllers-public-news-subscription-controller-ts)

#### Clase `UpdateSubscriptionPreferencesRequestDto` (L3–8)

- **Propósito:** Sin comentario de documentación; ver los métodos abajo.
