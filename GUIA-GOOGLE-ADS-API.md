# Guía: credenciales de la API de Google Ads (para `purchase` desde el servidor)

Esta guía te lleva paso a paso para obtener las credenciales que necesita el
Apps Script (`apps-script-epayco.gs`) para subir las conversiones de **compra**
a Google Ads con Enhanced Conversions.

Al final tendrás estos 6 valores para `guardarSecretos()`:

| Valor | De dónde sale |
|---|---|
| `ADS_CUSTOMER_ID` | ID de tu cuenta de Google Ads (sin guiones) |
| `ADS_CONVERSION_ACTION_ID` | ID de tu acción de conversión "Compra" |
| `ADS_DEVELOPER_TOKEN` | API Center de Google Ads |
| `ADS_CLIENT_ID` | OAuth (Google Cloud Console) |
| `ADS_CLIENT_SECRET` | OAuth (Google Cloud Console) |
| `ADS_REFRESH_TOKEN` | OAuth Playground (el paso más largo) |

> ⏱️ Tiempo estimado: 30–45 min. Hazlo con la cuenta de Google que administra
> tu cuenta de Google Ads.

---

## Parte 1 — `ADS_CUSTOMER_ID` (ID de la cuenta)

1. Entra a [Google Ads](https://ads.google.com).
2. Arriba a la derecha verás tu **ID de cliente**, con formato `123-456-7890`.
3. Anótalo **sin guiones**: `1234567890`.

> Si usas una **cuenta administradora (MCC)**, anota también el ID del MCC: lo
> necesitarás como "login customer id" más adelante (ver Parte 6, nota).

---

## Parte 2 — `ADS_CONVERSION_ACTION_ID` (la conversión "Compra")

1. En Google Ads: **Objetivos → Conversiones → Acciones de conversión**.
2. Abre (o crea) la conversión de **Compra** de tu sitio web.
   - Si la creas: tipo **Sitio web**, categoría **Compra**, con **valor** y
     usando **COP** como moneda.
   - **Activa "Conversiones mejoradas"** (Enhanced Conversions) → método
     **API (Google Ads API)**.
3. El **ID numérico** de la acción aparece en la URL al abrir la conversión:
   `.../conversionId/**987654321**/...` → ese número es `ADS_CONVERSION_ACTION_ID`.
   (También puedes verlo exportando la columna o con la API; lo importante es el
   número largo.)

---

## Parte 3 — `ADS_DEVELOPER_TOKEN` (token de desarrollador)

1. En Google Ads (idealmente desde la **cuenta administradora / MCC**):
   **Herramientas → Configuración → API Center**
   (o busca "API Center" en el buscador de Google Ads).
2. Verás tu **developer token**. Cópialo.
3. **Nivel de acceso:**
   - Un token nuevo suele quedar en **Test/Básico**. Para subir conversiones a
     cuentas reales necesitas **acceso Básico aprobado** (se solicita en el
     mismo API Center; Google lo revisa).
   - Mientras está en prueba, puedes validar la conexión con
     `probarTokenGoogle()`, pero las conversiones reales requieren el token
     aprobado.

---

## Parte 4 — Proyecto en Google Cloud + OAuth (`CLIENT_ID` y `CLIENT_SECRET`)

1. Entra a [Google Cloud Console](https://console.cloud.google.com).
2. Crea un proyecto (o usa uno existente), p. ej. "SerCafe Ads".
3. **Habilita la API de Google Ads:**
   - Menú → **APIs y servicios → Biblioteca**.
   - Busca **Google Ads API** → **Habilitar**.
4. **Configura la pantalla de consentimiento OAuth:**
   - **APIs y servicios → Pantalla de consentimiento de OAuth**.
   - Tipo de usuario: **Externo** → Crear.
   - Completa nombre de la app, correo de soporte y correo del desarrollador.
   - En **Usuarios de prueba**, agrega **tu propio correo** (el que administra
     Google Ads). Esto es importante para el paso del refresh token.
   - Guarda. (No necesitas publicar la app para uso propio.)
5. **Crea las credenciales OAuth:**
   - **APIs y servicios → Credenciales → Crear credenciales → ID de cliente de OAuth**.
   - Tipo de aplicación: **Aplicación web**.
   - En **URIs de redireccionamiento autorizados** agrega exactamente:
     `https://developers.google.com/oauthplayground`
   - Crear.
6. Copia el **ID de cliente** (`ADS_CLIENT_ID`) y el **Secreto de cliente**
   (`ADS_CLIENT_SECRET`).

---

## Parte 5 — `ADS_REFRESH_TOKEN` (con OAuth Playground) ⭐ el paso clave

1. Abre [OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
2. Arriba a la derecha, haz clic en el ⚙️ (**OAuth 2.0 configuration**) y marca:
   - ✅ **Use your own OAuth credentials**.
   - Pega tu **`ADS_CLIENT_ID`** y **`ADS_CLIENT_SECRET`**.
3. En el panel izquierdo (**Step 1 – Select & authorize APIs**), en el campo de
   "Input your own scopes" escribe exactamente:
   ```
   https://www.googleapis.com/auth/adwords
   ```
   y haz clic en **Authorize APIs**.
4. Inicia sesión con **la cuenta de Google que administra tu Google Ads** (la que
   agregaste como usuario de prueba). Acepta los permisos.
   - Si ves un aviso de "app no verificada", entra en **Avanzado → Ir a (tu app)**;
     es normal para una app de uso propio en modo prueba.
5. Vuelves al Playground en **Step 2**. Haz clic en **Exchange authorization code
   for tokens**.
6. Aparecerá el **Refresh token** (empieza con `1//...`). **Cópialo** → ese es
   `ADS_REFRESH_TOKEN`.

> El refresh token es de **larga duración**. Guárdalo bien. Si la app OAuth está
> en modo "prueba", el token puede expirar a los ~7 días; para que sea permanente,
> en la pantalla de consentimiento pon la app en **"En producción"** (Publish).

---

## Parte 6 — Guardar los secretos en Apps Script

1. Abre tu proyecto de **Apps Script** (el de la confirmación de ePayco).
2. Edita la función `guardarSecretos()` con tus 6 valores:
   ```js
   function guardarSecretos() {
     PropertiesService.getScriptProperties().setProperties({
       EPAYCO_CUST_ID: "1583501",
       EPAYCO_P_KEY: "TU_NUEVA_P_KEY",   // rótala en ePayco

       ADS_ACTIVO: "true",
       ADS_CUSTOMER_ID: "1234567890",
       ADS_CONVERSION_ACTION_ID: "987654321",
       ADS_DEVELOPER_TOKEN: "xxxxxxxxxxxxxxxxxxxxxx",
       ADS_CLIENT_ID: "xxxxx.apps.googleusercontent.com",
       ADS_CLIENT_SECRET: "xxxxxxxxxxxxxxxx",
       ADS_REFRESH_TOKEN: "1//xxxxxxxxxxxxxxxxxxxxxxxx"
     });
   }
   ```
3. **Ejecuta `guardarSecretos()` una vez** (botón ▶ en el editor). Autoriza
   permisos si lo pide.
4. **Borra los valores** del código (ya quedaron guardados en PropertiesService)
   y vuelve a guardar el archivo, para no dejar credenciales a la vista.

> Nota MCC: si tu conversión vive bajo una cuenta administradora, puede que
> necesites enviar también el encabezado `login-customer-id` con el ID del MCC
> (sin guiones) en la llamada a la API. Si `probarConversionGoogleAds()` falla
> con un error de autorización de cliente, avísame y te agrego ese encabezado.

---

## Parte 7 — Probar

Desde el editor de Apps Script, ejecuta **en este orden** y revisa
**Ver → Registros / Ejecuciones**:

1. **`probarTokenGoogle()`**
   → debe loguear `Access token OK...`. Si falla: revisa CLIENT_ID/SECRET y
   el refresh token.
2. **`probarConversionGoogleAds()`**
   → debe devolver **`HTTP 200`**. Si da `HTTP 401/403`: developer token o
   permisos. Si da `HTTP 400`: revisa `customer_id` / `conversion_action_id`.
3. **`probarConfirmacionEpaycoAprobada()`**
   → simula una compra aprobada completa (guarda en "Pedidos", manda correos y
   sube la conversión) **sin tocar ePayco**.
4. En **Google Ads → Objetivos → Conversiones**, la conversión de prueba aparece
   en unas horas (no es instantáneo).

---

## Checklist final

- [ ] API de Google Ads habilitada en Google Cloud
- [ ] Pantalla de consentimiento OAuth configurada (+ tu correo como usuario de prueba)
- [ ] Credenciales OAuth creadas con redirect del Playground
- [ ] Refresh token obtenido en OAuth Playground
- [ ] Conversión "Compra" con Enhanced Conversions → método API
- [ ] Developer token con acceso **Básico aprobado**
- [ ] `guardarSecretos()` ejecutado y `ADS_ACTIVO = "true"`
- [ ] `probarTokenGoogle()` → token OK
- [ ] `probarConversionGoogleAds()` → HTTP 200
- [ ] Credenciales borradas del código fuente

---

### Errores comunes

| Síntoma | Causa probable | Solución |
|---|---|---|
| `invalid_grant` al pedir token | refresh token expirado o app en modo prueba | publica la app OAuth o genera el token de nuevo |
| `HTTP 401 UNAUTHENTICATED` | access token malo | revisa CLIENT_ID/SECRET/refresh |
| `HTTP 403 DEVELOPER_TOKEN_NOT_APPROVED` | token en modo test | solicita acceso Básico en API Center |
| `HTTP 400 ... customer` | customer_id con guiones o incorrecto | usa solo dígitos; verifica el ID |
| `USER_PERMISSION_DENIED` | la cuenta OAuth no administra ese Ads, o falta `login-customer-id` (MCC) | usa la cuenta correcta; avísame para el header MCC |
