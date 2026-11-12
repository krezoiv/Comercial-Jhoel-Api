# 02 · Arquitectura del frontend (Angular 19)

Módulo: **Frontend** · Fuente editable: [`02-frontend-architecture.mmd`](02-frontend-architecture.mmd) · [Índice de diagramas](README.md)

```mermaid
flowchart TD
  M(["main.ts<br/>bootstrapApplication(AppComponent, appConfig)"])
  subgraph CFG["app.config.ts"]
    P1["provideRouter(routes)"]
    P2["provideHttpClient(withInterceptors([authInterceptor, cashMutationInterceptor]))"]
    P3["provideServiceWorker('ngsw-worker.js') solo en producción"]
    P4["LOCALE_ID = 'es'"]
  end
  subgraph RT["app.routes.ts — carga diferida (loadComponent)"]
    PUB["Rutas con guestGuard<br/>'' (landing) · login"]
    OPEN["Rutas públicas sin guard<br/>catalogo · noticias/:slug · noticias/preferencias/:token"]
    GG{"guestGuard<br/>¿sin sesión?"}
    DASH["/dashboard → DashboardLayoutComponent<br/>+ 75 entradas de ruta hijas"]
    AG{"authGuard<br/>¿AuthService.isAuthenticated()?"}
    AD{"adminGuard<br/>¿AuthService.isAdmin()?"}
  end
  subgraph UI["Capa de presentación"]
    F["features/**<br/>páginas y modales de cada pantalla"]
    SH["shared/ui · shared/directives · shared/pipes<br/>componentes reutilizables (CardComponent, ButtonComponent, ConfirmDialogComponent…)"]
    LY["layout/** y DashboardLayoutComponent<br/>navbar, sidebar, topbar"]
  end
  subgraph CORE["core/"]
    ST["Stores y estado (signals, providedIn root)<br/>SalesDraftStore · BankDepositDraftStore · CuadreAgentesStateService · DayStatusService"]
    SV["Servicios HTTP por recurso<br/>core/services/*.service.ts"]
    MO["Modelos y cálculos puros<br/>core/models/*.model.ts"]
    IN["Interceptores<br/>authInterceptor · cashMutationInterceptor"]
    UT["Utilidades<br/>extractErrorMessage …"]
  end
  API[("API NestJS<br/>environment.apiUrl")]
  M --> CFG
  P1 --> RT
  PUB --> GG
  GG -->|"sí"| F
  GG -->|"no: ya hay sesión → /dashboard"| DASH
  OPEN --> F
  DASH --> AG
  AG -->|"no → /login"| PUB
  AG -->|"sí"| LY
  LY --> AD
  AD -->|"sí o ruta sin adminGuard"| F
  AD -->|"no → /dashboard"| LY
  F -->|"usa"| SH
  F -->|"inject()"| ST
  F -->|"inject()"| SV
  ST -->|"llama"| SV
  F --> MO
  SV --> IN
  P2 --> IN
  IN -->|"HTTP + Bearer"| API
  API -->|"{ success, data }"| SV
  SV -->|"map(r => r.data)"| F
  F --> UT
  classDef fe fill:#e3f2fd,stroke:#1565c0,color:#0d47a1
  classDef dec fill:#fffde7,stroke:#f57f17,color:#3e2723
  classDef db fill:#eceff1,stroke:#455a64,color:#263238
  classDef start fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20
  class M start
  class P1,P2,P3,P4,PUB,OPEN,DASH,F,SH,LY,ST,SV,MO,IN,UT fe
  class GG,AG,AD dec
  class API db
```

## Explicación

1. **¿Qué proceso representa?** Cómo arranca la aplicación Angular, cómo se resuelven las rutas (con carga diferida y guards), qué capas tiene (features, shared/ui, core) y cómo fluye el estado (signals, stores singleton) hacia las llamadas HTTP.
2. **¿Dónde comienza?** comercial-jhoel-app/src/main.ts (bootstrapApplication(AppComponent, appConfig))
3. **¿Qué archivos intervienen?** [`comercial-jhoel-app/src/main.ts`](../../comercial-jhoel-app/src/main.ts), [`comercial-jhoel-app/src/app/app.config.ts`](../../comercial-jhoel-app/src/app/app.config.ts), [`comercial-jhoel-app/src/app/app.routes.ts`](../../comercial-jhoel-app/src/app/app.routes.ts), [`comercial-jhoel-app/src/app/core/guards/auth.guard.ts`](../../comercial-jhoel-app/src/app/core/guards/auth.guard.ts), [`comercial-jhoel-app/src/app/core/guards/admin.guard.ts`](../../comercial-jhoel-app/src/app/core/guards/admin.guard.ts), [`comercial-jhoel-app/src/app/core/guards/guest.guard.ts`](../../comercial-jhoel-app/src/app/core/guards/guest.guard.ts), [`comercial-jhoel-app/src/app/features/dashboard/dashboard-layout.component.ts`](../../comercial-jhoel-app/src/app/features/dashboard/dashboard-layout.component.ts), [`comercial-jhoel-app/src/app/core/services/auth.service.ts`](../../comercial-jhoel-app/src/app/core/services/auth.service.ts), [`comercial-jhoel-app/src/app/core/services/sales-draft.store.ts`](../../comercial-jhoel-app/src/app/core/services/sales-draft.store.ts), [`comercial-jhoel-app/src/app/core/services/cuadre-agentes-state.service.ts`](../../comercial-jhoel-app/src/app/core/services/cuadre-agentes-state.service.ts), [`comercial-jhoel-app/src/app/core/models/index.ts`](../../comercial-jhoel-app/src/app/core/models/index.ts), [`comercial-jhoel-app/src/app/shared/ui/index.ts`](../../comercial-jhoel-app/src/app/shared/ui/index.ts), [`comercial-jhoel-app/src/environments/environment.ts`](../../comercial-jhoel-app/src/environments/environment.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** guestGuard en '' y login (¿sin sesión? → muestra la página; con sesión → /dashboard), authGuard (¿sesión? → /dashboard, si no /login), adminGuard (¿isAdmin()? → si no /dashboard)
6. **¿Dónde se almacenan los datos?** En el navegador: localStorage (token cj_auth_token y sesión), sessionStorage en algunos borradores, signals en stores providedIn root; los datos reales viven en el backend
7. **¿Cómo termina el proceso?** El componente pinta la plantilla con sus signals; un cambio de signal redibuja (OnPush)
8. **¿Qué sucede cuando ocurre un error?** Los guards redirigen (no lanzan); los errores HTTP llegan a cada componente, que usa extractErrorMessage y NotificationService

> Diagrama escrito a mano a partir del código; ver la sección de archivos.
