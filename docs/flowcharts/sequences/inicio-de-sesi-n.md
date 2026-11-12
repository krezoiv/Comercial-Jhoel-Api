# Secuencia — Inicio de sesión

Módulo: **Autenticación (auth)** · Fuente editable: [`inicio-de-sesi-n.mmd`](inicio-de-sesi-n.mmd) · [Índice de diagramas](../README.md)

```mermaid
sequenceDiagram
  autonumber
  actor U as Usuario
  participant C as LoginPageComponent
  participant S as AuthService
  participant G as API (guards y ValidationPipe)
  participant CT as AuthController
  participant UC0 as LoginUseCase
  participant R0 as TypeOrmUserRepository
  participant R1 as BcryptPasswordHasher
  participant R2 as NestJwtTokenService
  participant DB as PostgreSQL
  U->>C: submit()
  C->>S: login(…)
  S->>G: POST /api/auth/login + Bearer JWT
  alt falla límite de intentos / DTO LoginRequestDto
    G-->>C: 400 / 401 / 403 / 429 con success false
  else permitido
  G->>CT: login(dto, usuario del JWT)
  CT->>UC0: execute(input)
  opt !user
    UC0-->>G: InvalidCredentialsError()
  end
  opt !isPasswordValid
    UC0-->>G: InvalidCredentialsError()
  end
  opt !user.isActive
    UC0-->>G: InvalidCredentialsError()
  end
  UC0->>R0: findByUsernameOrPhone()
  R0-->>UC0: datos
  UC0->>R1: compare()
  R1-->>UC0: datos
  UC0->>R2: sign()
  R2-->>UC0: datos
  UC0-->>CT: salida
  CT-->>G: objeto
  G-->>C: success true con data
  end
  C-->>U: actualiza la interfaz (this.errorMessage.set, this.isSubmitting.set, this.router.navigateByUrl)
```

## Explicación

1. **¿Qué proceso representa?** Interacción Usuario → Angular → API → caso de uso → repositorio → PostgreSQL para POST /api/auth/login, con las validaciones y la transacción
2. **¿Dónde comienza?** AuthService.login
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/auth/presentation/controllers/auth.controller.ts`](../../../comercial-jhoel-api/src/modules/auth/presentation/controllers/auth.controller.ts), [`comercial-jhoel-app/src/app/features/auth/login/login-page.component.ts`](../../../comercial-jhoel-app/src/app/features/auth/login/login-page.component.ts), [`comercial-jhoel-app/src/app/core/services/auth.service.ts`](../../../comercial-jhoel-app/src/app/core/services/auth.service.ts), [`comercial-jhoel-api/src/modules/auth/application/use-cases/login.use-case.ts`](../../../comercial-jhoel-api/src/modules/auth/application/use-cases/login.use-case.ts), [`comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts`](../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts), [`comercial-jhoel-api/src/shared/infrastructure/services/bcrypt-password-hasher.service.ts`](../../../comercial-jhoel-api/src/shared/infrastructure/services/bcrypt-password-hasher.service.ts), [`comercial-jhoel-api/src/modules/auth/infrastructure/services/jwt-token.service.ts`](../../../comercial-jhoel-api/src/modules/auth/infrastructure/services/jwt-token.service.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** Bloques alt/opt = validaciones reales; flujo completo en business-processes/auth/post-auth-login.mmd
6. **¿Dónde se almacenan los datos?** PostgreSQL (ver notas "escribe")
7. **¿Cómo termina el proceso?** success true con data y actualización de la interfaz
8. **¿Qué sucede cuando ocurre un error?** Ramas alt/opt: el error vuelve a la pantalla como { success: false, message }

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
