/**
 * ============================================================
 *  Ser Café — Backend de confirmación de pagos ePayco
 *  (Google Apps Script - Web App)
 * ============================================================
 *
 *  Esta es la URL que ya está configurada en la web como
 *  `data-epayco-confirmation` (webhook servidor-a-servidor).
 *
 *  Qué hace:
 *   1. Recibe la confirmación de ePayco cuando un pago se procesa
 *      (ePayco la envía aunque el cliente cierre el navegador).
 *   2. Guarda la compra en una hoja de Google Sheets.
 *   3. Si el pago fue APROBADO, envía la conversión a Google Ads
 *      con ENHANCED CONVERSIONS (datos del cliente hasheados en
 *      SHA-256) para mejorar el emparejamiento y los públicos
 *      similares. Así "Google busca más gente así".
 *
 *  ----------------------------------------------------------
 *  POR QUÉ DEL LADO DEL SERVIDOR:
 *  ePayco entrega aquí el email y nombre reales del comprador,
 *  cosa que NO ocurre en la URL de retorno del navegador. Y se
 *  ejecuta siempre, sin depender de que el cliente vuelva al sitio.
 *  ----------------------------------------------------------
 *
 *  PASOS PARA IMPLEMENTAR:
 *   1. Pega este código en el proyecto Apps Script cuya URL /exec
 *      ya usas en data-epayco-confirmation.
 *   2. Completa la sección CONFIG (Google Ads + llave privada ePayco).
 *   3. Implementar > Nueva versión > Ejecutar como: Yo >
 *      Acceso: Cualquier usuario.
 *   4. Autoriza permisos (Sheets + servicios externos/UrlFetch).
 *
 *  Para activar Enhanced Conversions server-side necesitas:
 *   - Una cuenta de Google Ads con la API habilitada (developer token).
 *   - Un refresh token OAuth con alcance de Google Ads.
 *   Mientras tanto, el script guarda TODO en Sheets y deja la
 *   compra lista para subirla; ver NOTA al final.
 * ============================================================
 */

// ------------------------------------------------------------
// CONFIG — completa con tus datos
// ------------------------------------------------------------
const CONFIG = {
  // Hoja donde se registran las compras (se crea sola)
  NOMBRE_HOJA_VENTAS: "Ventas",

  // Correo de aviso de venta (opcional; deja "" para no enviar)
  CORREO_AVISO: "",

  // Llave privada de ePayco (para validar la firma x_signature).
  // La encuentras en tu panel de ePayco > Integraciones.
  EPAYCO_P_KEY: "",
  EPAYCO_P_CUST_ID: "",   // p_cust_id_cliente

  // --- Google Ads (Enhanced Conversions API) ---
  // Rellena cuando tengas la API de Google Ads habilitada.
  GOOGLE_ADS: {
    activo: false,                 // ponlo en true cuando esté configurado
    customer_id: "",               // 000-000-0000 sin guiones
    conversion_action_id: "",      // ID de la acción de conversión "Compra"
    developer_token: "",
    client_id: "",                 // OAuth client id
    client_secret: "",             // OAuth client secret
    refresh_token: ""              // OAuth refresh token (scope adwords)
  }
};

// ------------------------------------------------------------
// ENTRADAS
// ------------------------------------------------------------
function doPost(e) {
  return procesarConfirmacion(e);
}

function doGet(e) {
  if (e && e.parameter && e.parameter.x_ref_payco) {
    return procesarConfirmacion(e);
  }
  return ContentService.createTextOutput(
    "Ser Café — endpoint de confirmación ePayco activo."
  );
}

// ------------------------------------------------------------
// PROCESO PRINCIPAL
// ------------------------------------------------------------
function procesarConfirmacion(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};

    // Campos típicos que envía ePayco en la confirmación
    const ref        = (p.x_ref_payco || "").toString();
    const factura    = (p.x_id_factura || p.x_id_invoice || "").toString();
    const estadoCod  = (p.x_cod_response || p.x_cod_transaction_state || "").toString();
    const estadoTxt  = (p.x_response || p.x_transaction_state || "").toString();
    const valor      = parseFloat(p.x_amount || "0") || 0;
    const moneda     = (p.x_currency_code || "COP").toString();

    const email      = (p.x_customer_email || "").toString().trim();
    const nombre     = (p.x_customer_name || "").toString().trim();
    const apellido   = (p.x_customer_lastname || "").toString().trim();
    const telefono   = (p.x_customer_movil || p.x_customer_phone || "").toString().trim();

    // extra1 lleva el JSON del pedido que arma la web (productos, envío, etc.)
    let detalle = {};
    try { detalle = JSON.parse(p.x_extra1 || "{}"); } catch (err) { detalle = {}; }
    const departamento = (p.x_extra2 || detalle.departamento || "").toString();
    const municipio    = (p.x_extra3 || detalle.municipio || "").toString();

    const aprobado =
      estadoCod === "1" || /aceptad|aprobad|exitos|success/i.test(estadoTxt);

    // 1) Validar firma de ePayco (si hay llaves configuradas)
    const firmaOk = validarFirmaEpayco(p);

    // 2) Guardar en Sheets SIEMPRE
    guardarVenta({
      ref: ref, factura: factura, estado: estadoTxt, aprobado: aprobado,
      valor: valor, moneda: moneda, email: email, nombre: nombre,
      apellido: apellido, telefono: telefono, departamento: departamento,
      municipio: municipio, firmaOk: firmaOk,
      productos: JSON.stringify(detalle.productos || [])
    });

    // 3) Si aprobado, subir Enhanced Conversion a Google Ads
    let adsResultado = "omitido";
    if (aprobado && firmaOk && CONFIG.GOOGLE_ADS.activo) {
      try {
        adsResultado = subirConversionGoogleAds({
          ref: ref, valor: valor, moneda: moneda,
          email: email, nombre: nombre, apellido: apellido, telefono: telefono
        });
      } catch (adsErr) {
        adsResultado = "error: " + adsErr.toString();
        Logger.log(adsResultado);
      }
    }

    // 4) Aviso por correo (opcional)
    if (aprobado && CONFIG.CORREO_AVISO) {
      try {
        MailApp.sendEmail({
          to: CONFIG.CORREO_AVISO,
          subject: "🛒 Nueva venta Ser Café — " + (nombre || email || ref),
          body:
            "Pago aprobado.\n\n" +
            "Ref: " + ref + "\nValor: " + valor + " " + moneda + "\n" +
            "Cliente: " + nombre + " " + apellido + "\n" +
            "Email: " + email + "\nTel: " + telefono + "\n" +
            "Envío a: " + municipio + ", " + departamento + "\n" +
            "Google Ads: " + adsResultado
        });
      } catch (mailErr) { Logger.log("Aviso correo: " + mailErr); }
    }

    return salida({ ok: true, aprobado: aprobado, firmaOk: firmaOk, ads: adsResultado });

  } catch (err) {
    Logger.log("Error confirmacion: " + err);
    return salida({ ok: false, error: err.toString() });
  }
}

// ------------------------------------------------------------
// GUARDAR EN SHEETS
// ------------------------------------------------------------
function guardarVenta(v) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(CONFIG.NOMBRE_HOJA_VENTAS);
  if (!hoja) {
    hoja = ss.insertSheet(CONFIG.NOMBRE_HOJA_VENTAS);
    hoja.appendRow([
      "Fecha", "Ref ePayco", "Factura", "Estado", "Aprobado",
      "Valor", "Moneda", "Nombre", "Apellido", "Email", "Teléfono",
      "Departamento", "Municipio", "Firma OK", "Productos"
    ]);
  }
  hoja.appendRow([
    new Date(), v.ref, v.factura, v.estado, v.aprobado,
    v.valor, v.moneda, v.nombre, v.apellido, v.email, v.telefono,
    v.departamento, v.municipio, v.firmaOk, v.productos
  ]);
}

// ------------------------------------------------------------
// VALIDAR FIRMA ePayco (x_signature)
//   SHA-256 de: p_cust_id ^ p_key ^ x_ref_payco ^ x_transaction_id
//               ^ x_amount ^ x_currency_code
// ------------------------------------------------------------
function validarFirmaEpayco(p) {
  if (!CONFIG.EPAYCO_P_KEY || !CONFIG.EPAYCO_P_CUST_ID) {
    return true; // sin llaves configuradas, no bloqueamos (ajústalo en producción)
  }
  const cadena = [
    CONFIG.EPAYCO_P_CUST_ID,
    CONFIG.EPAYCO_P_KEY,
    p.x_ref_payco,
    p.x_transaction_id,
    p.x_amount,
    p.x_currency_code
  ].join("^");

  const calc = sha256Hex(cadena);
  return (p.x_signature || "").toLowerCase() === calc;
}

// ------------------------------------------------------------
// GOOGLE ADS — Enhanced Conversion (uploadClickConversions)
// ------------------------------------------------------------
function subirConversionGoogleAds(datos) {
  const ads = CONFIG.GOOGLE_ADS;

  const accessToken = obtenerAccessTokenGoogle();

  const userIdentifiers = [];
  if (datos.email) {
    userIdentifiers.push({ hashedEmail: sha256Hex(normalizarEmail(datos.email)) });
  }
  const tel = normalizarTelefono(datos.telefono);
  if (tel) {
    userIdentifiers.push({ hashedPhoneNumber: sha256Hex(tel) });
  }
  if (datos.nombre || datos.apellido) {
    userIdentifiers.push({
      addressInfo: {
        hashedFirstName: datos.nombre ? sha256Hex(datos.nombre.trim().toLowerCase()) : undefined,
        hashedLastName:  datos.apellido ? sha256Hex(datos.apellido.trim().toLowerCase()) : undefined,
        countryCode: "CO"
      }
    });
  }

  const cuerpo = {
    conversions: [{
      conversionAction: "customers/" + ads.customer_id +
                        "/conversionActions/" + ads.conversion_action_id,
      conversionDateTime: formatoFechaAds(new Date()),
      conversionValue: datos.valor,
      currencyCode: datos.moneda || "COP",
      orderId: datos.ref,
      userIdentifiers: userIdentifiers
    }],
    partialFailure: true
  };

  const url = "https://googleads.googleapis.com/v17/customers/" +
              ads.customer_id + ":uploadClickConversions";

  const resp = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    headers: {
      "Authorization": "Bearer " + accessToken,
      "developer-token": ads.developer_token
    },
    payload: JSON.stringify(cuerpo),
    muteHttpExceptions: true
  });

  return "HTTP " + resp.getResponseCode() + " " + resp.getContentText();
}

// Intercambia el refresh_token por un access_token
function obtenerAccessTokenGoogle() {
  const ads = CONFIG.GOOGLE_ADS;
  const resp = UrlFetchApp.fetch("https://oauth2.googleapis.com/token", {
    method: "post",
    payload: {
      client_id: ads.client_id,
      client_secret: ads.client_secret,
      refresh_token: ads.refresh_token,
      grant_type: "refresh_token"
    },
    muteHttpExceptions: true
  });
  const json = JSON.parse(resp.getContentText());
  if (!json.access_token) {
    throw new Error("No se obtuvo access_token: " + resp.getContentText());
  }
  return json.access_token;
}

// ------------------------------------------------------------
// UTILIDADES
// ------------------------------------------------------------
function sha256Hex(texto) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    String(texto),
    Utilities.Charset.UTF_8
  );
  return bytes.map(function (b) {
    const v = (b < 0 ? b + 256 : b).toString(16);
    return v.length === 1 ? "0" + v : v;
  }).join("");
}

function normalizarEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizarTelefono(tel) {
  let limpio = String(tel || "").replace(/[\s()-]/g, "");
  if (limpio && limpio[0] !== "+") {
    limpio = "+57" + limpio.replace(/^0+/, "");
  }
  return limpio;
}

// Google Ads exige "yyyy-MM-dd HH:mm:ss+zz:zz"
function formatoFechaAds(fecha) {
  return Utilities.formatDate(fecha, "America/Bogota", "yyyy-MM-dd HH:mm:ss") + "-05:00";
}

function salida(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ============================================================
 * NOTA:
 *  - Mientras GOOGLE_ADS.activo = false, el script registra todo
 *    en la hoja "Ventas". Puedes subir esas conversiones a Google
 *    Ads de forma manual/programada (importación de conversiones
 *    offline con datos de cliente) desde esa misma hoja.
 *  - Al poner GOOGLE_ADS.activo = true y completar las credenciales,
 *    cada pago aprobado sube la conversión automáticamente con
 *    Enhanced Conversions en tiempo real.
 * ============================================================ */
