# POST /api/users/register

Módulo: **Usuarios (users)** · Fuente editable: [`post-users-register.mmd`](post-users-register.mmd) · [Índice de diagramas](../../README.md)

```mermaid
flowchart TD
  n1(["Inicio: el usuario ejecuta POST /api/users/register"])
  n2["GlobalExceptionFilter<br/>{ success: false, statusCode, message }"]
  n3(["Fin con error: la pantalla muestra el mensaje<br/>(extractErrorMessage / notificación)"])
  subgraph s4["Frontend (Angular)"]
  n5["HTTP POST /api/users/register<br/>authInterceptor agrega Authorization: Bearer"]
  end
  n6["Respuesta 201/200: { success: true, data }<br/>(ResponseInterceptor)"]
  subgraph s7["API NestJS — presentación"]
  n8{"¿RegisterUserRequestDto válido?<br/>(ValidationPipe: whitelist + forbidNonWhitelisted)"}
  n9(["400 Datos inválidos"])
  n10["UsersController.register<br/><small>api/users/presentation/controllers/users.controller.ts</small>"]
  end
  subgraph s11["Aplicación — caso de uso"]
  n12["RegisterUserUseCase.execute<br/><small>api/users/application/use-cases/register-user.use-case.ts</small>"]
  n13{"¿existingByUsername?<br/><small>L52</small>"}
  n14(["UsernameAlreadyExistsError(username)"])
  n15{"¿existingByPhone?<br/><small>L57</small>"}
  n16(["PhoneAlreadyExistsError(phone)"])
  n17{"¿!role?<br/><small>L62</small>"}
  n18(["InternalServerErrorException( 'El rol por defecto no está configurado.', )"])
  end
  n19["Puerto PasswordHasher<br/><small>hash</small>"]
  n20["Puerto RoleRepository<br/><small>findByName</small>"]
  subgraph s21["Dominio → Infraestructura"]
  n22["Puerto UserRepository.findByUsername / findByPhone / create<br/>@Inject(USER_REPOSITORY)"]
  n23["TypeOrmUserRepository<br/><small>api/users/infrastructure/persistence/typeorm-user.repository.ts</small>"]
  n24[("findByUsername: TypeORM Repository")]
  n25[("findByPhone: TypeORM Repository")]
  n26[("create: TypeORM Repository")]
  end
  n27(["Fin: la interfaz se actualiza"])
  n2 --> n3
  n1 --> n5
  n5 -->|sí| n8
  n8 -->|no| n9
  n9 --> n2
  n8 -->|sí| n10
  n10 --> n12
  n12 --> n13
  n13 -->|sí| n14
  n14 --> n2
  n13 -->|no| n15
  n15 -->|sí| n16
  n16 --> n2
  n15 -->|no| n17
  n17 -->|sí| n18
  n18 --> n2
  n12 -.->|consulta| n19
  n12 -.->|consulta| n20
  n17 -->|no| n22
  n22 -->|implementa| n23
  n23 --> n24
  n24 --> n6
  n23 --> n25
  n25 --> n6
  n23 --> n26
  n26 --> n6
  n6 --> n27
  classDef start fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20
  classDef fe fill:#e3f2fd,stroke:#1565c0,color:#0d47a1
  classDef api fill:#ede7f6,stroke:#4527a0,color:#311b92
  classDef app fill:#e0f2f1,stroke:#00695c,color:#004d40
  classDef dom fill:#fff8e1,stroke:#f9a825,color:#5d4037
  classDef infra fill:#f3e5f5,stroke:#6a1b9a,color:#4a148c
  classDef db fill:#eceff1,stroke:#455a64,color:#263238
  classDef dec fill:#fffde7,stroke:#f57f17,color:#3e2723
  classDef err fill:#ffebee,stroke:#c62828,color:#b71c1c
  classDef ok fill:#e8f5e9,stroke:#1b5e20,color:#1b5e20
  class n1 start
  class n2,n3,n9,n14,n16,n18 err
  class n5 fe
  class n6,n27 ok
  class n8,n13,n15,n17 dec
  class n10 api
  class n12 app
  class n19,n20,n22 dom
  class n23 infra
  class n24,n25,n26 db
```

## Explicación

1. **¿Qué proceso representa?** Flujo de decisiones real de POST /api/users/register: guards, DTO, validaciones del caso de uso (if … throw) y reglas de las funciones PL/pgSQL (IF … RAISE).
2. **¿Dónde comienza?** cliente HTTP → POST /api/users/register
3. **¿Qué archivos intervienen?** [`comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts`](../../../../comercial-jhoel-api/src/modules/users/presentation/controllers/users.controller.ts), [`comercial-jhoel-api/src/modules/users/application/use-cases/register-user.use-case.ts`](../../../../comercial-jhoel-api/src/modules/users/application/use-cases/register-user.use-case.ts), [`comercial-jhoel-api/src/shared/application/ports/password-hasher.port.ts`](../../../../comercial-jhoel-api/src/shared/application/ports/password-hasher.port.ts), [`comercial-jhoel-api/src/modules/roles/domain/repositories/role.repository.ts`](../../../../comercial-jhoel-api/src/modules/roles/domain/repositories/role.repository.ts), [`comercial-jhoel-api/src/modules/users/domain/repositories/user.repository.ts`](../../../../comercial-jhoel-api/src/modules/users/domain/repositories/user.repository.ts), [`comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts`](../../../../comercial-jhoel-api/src/modules/users/infrastructure/persistence/typeorm-user.repository.ts)
4. **¿Qué función ejecuta cada archivo?** Cada nodo muestra la clase y el método (`Clase.metodo`) y, debajo, la ruta del archivo. El color indica la capa: azul = frontend, morado = controlador, verde azulado = caso de uso, amarillo = dominio/puerto, lila = infraestructura, gris = PostgreSQL, amarillo claro = decisión, rojo = error.
5. **¿Qué decisiones toma el sistema?** DTO RegisterUserRequestDto | existingByUsername | existingByPhone | !role
6. **¿Dónde se almacenan los datos?** ver repositorio
7. **¿Cómo termina el proceso?** Respuesta { success: true, data } y actualización de la pantalla
8. **¿Qué sucede cuando ocurre un error?** Cada rama roja termina en GlobalExceptionFilter → { success: false, message } y la pantalla muestra el mensaje; un RAISE en SQL revierte toda la transacción

> Generado desde el código. Las condiciones de los rombos son el texto literal de los `if … throw` (TypeScript) y de los `IF … RAISE EXCEPTION` (PL/pgSQL).
