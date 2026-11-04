// =========================================================
// PÁGINA DE GRACIAS - Ser Café
// Muestra la confirmación del pedido tras la compra.
// Lee la respuesta de ePayco (parámetros en la URL) y el
// último pedido guardado en localStorage por la tienda.
// =========================================================

(function () {

    // --- Utilidad: formato de pesos colombianos ---
    function pesos(valor) {
        const n = Number(valor) || 0;
        return "$" + n.toLocaleString("es-CO");
    }

    // --- 1. Leer parámetros de la respuesta de ePayco ---
    // ePayco redirige con datos como ref_payco / x_ref_payco,
    // x_cod_response (1 = aceptada) y x_response (texto).
    const params = new URLSearchParams(window.location.search);

    const refPayco =
        params.get("ref_payco") ||
        params.get("x_ref_payco") ||
        params.get("refPayco") ||
        "";

    const codResponse =
        params.get("x_cod_response") ||
        params.get("x_cod_transaction_state") ||
        "";

    const textoResponse =
        params.get("x_response") ||
        params.get("x_transaction_state") ||
        "";

    // --- 2. Recuperar el último pedido guardado ---
    let pedido = null;
    try {
        pedido = JSON.parse(localStorage.getItem("ultimoPedido"));
    } catch (e) {
        pedido = null;
    }

    // =========================================================
    // ESTADO DEL PAGO
    // =========================================================
    const estadoAceptado =
        codResponse === "1" ||
        /aceptad|aprobad|exitos|success/i.test(textoResponse);

    const estadoRechazado =
        codResponse === "2" || codResponse === "3" || codResponse === "4" ||
        /rechazad|fallid|fail|declin/i.test(textoResponse);

    const titulo = document.getElementById("graciasTitulo");
    const mensaje = document.getElementById("graciasMensaje");
    const bloqueRef = document.getElementById("graciasRef");
    const refPedido = document.getElementById("refPedido");
    const estadoPago = document.getElementById("estadoPago");

    // Referencia a mostrar: priorizamos NUESTRA referencia legible
    // (SERCAFE-...) guardada en el pedido, no el ref_payco hexadecimal
    // interno de ePayco (ej. "c00c1e675184d1421ddaee42").
    const referenciaPropia = (pedido && pedido.referencia) || "";
    const referenciaFinal = referenciaPropia || refPayco || "";

    if (referenciaFinal) {
        bloqueRef.style.display = "";
        refPedido.innerText = referenciaFinal;
    }

    // Helper de traducción (si i18n.js está cargado)
    const tr = (typeof window.t === "function") ? window.t : function (k) { return k; };

    // Estos textos los controla este script dinámicamente; quitamos
    // data-i18n para que aplicarIdioma() no los sobreescriba.
    if (titulo) titulo.removeAttribute("data-i18n");
    if (mensaje) mensaje.removeAttribute("data-i18n");

    if (estadoAceptado) {
        titulo.innerText = tr("gr_aprobado");
        mensaje.innerText = tr("gr_aprobado_msg");
        estadoPago.innerText = tr("gr_estado_aprobado");
        estadoPago.classList.add("estado-ok");
    } else if (estadoRechazado) {
        titulo.innerText = tr("gr_rechazado");
        mensaje.innerText = tr("gr_rechazado_msg");
        estadoPago.innerText = textoResponse || tr("gr_rechazado");
        estadoPago.classList.add("estado-error");
    } else {
        // Sin datos de ePayco (acceso directo) o pago pendiente
        if (textoResponse) {
            estadoPago.innerText = textoResponse;
        } else if (referenciaFinal) {
            estadoPago.innerText = tr("gr_verificacion");
        }
    }

    // =========================================================
    // RESUMEN DEL PEDIDO
    // =========================================================
    if (pedido && pedido.detalle) {

        const d = pedido.detalle;
        const resumen = document.getElementById("graciasResumen");
        const items = document.getElementById("graciasItems");
        const totales = document.getElementById("graciasTotales");

        const productos = Array.isArray(d.productos) ? d.productos : [];

        if (productos.length > 0) {
            resumen.style.display = "";

            items.innerHTML = productos.map(function (p) {
                return `
                    <div class="gracias-item">
                        <img src="${p.imagen}" alt="${p.nombre}"
                             onerror="this.onerror=null;this.src='Img/logoSC-10.png';">
                        <div class="gracias-item-info">
                            <strong>${p.nombre}</strong>
                            <span>${p.presentacion} g · ${p.molienda}</span>
                        </div>
                        <div class="gracias-item-cant">x${p.cantidad}</div>
                        <div class="gracias-item-precio">
                            ${pesos(p.precio * p.cantidad)}
                        </div>
                    </div>
                `;
            }).join("");

            let filas = "";
            filas += `
                <div class="gracias-fila">
                    <span>${tr("gr_subtotal")}</span><span>${pesos(d.subtotal)}</span>
                </div>`;
            filas += `
                <div class="gracias-fila">
                    <span>${tr("gr_envio")}</span><span>${pesos(d.envio)}</span>
                </div>`;
            filas += `
                <div class="gracias-fila gracias-fila-total">
                    <span>${tr("gr_total")}</span><span>${pesos(d.total)}</span>
                </div>`;

            if (d.departamento || d.municipio) {
                filas += `
                    <div class="gracias-envio-a">
                        📍 ${tr("gr_envio_a")} ${[d.municipio, d.departamento].filter(Boolean).join(", ")}
                    </div>`;
            }

            totales.innerHTML = filas;
        }
    }

    // =========================================================
    // CONVERSIÓN DE COMPRA (Google Ads / GA4)
    // Solo se dispara una vez por transacción y si el pago fue aceptado.
    // =========================================================
    if (estadoAceptado && pedido && pedido.detalle) {

        var transId = referenciaFinal || pedido.referencia || "";
        var yaEnviado = false;
        try {
            yaEnviado = localStorage.getItem("purchase_enviado_" + transId) === "1";
        } catch (e) { yaEnviado = false; }

        if (!yaEnviado && typeof window.trackPurchase === "function") {

            var d = pedido.detalle;
            var items = (d.productos || []).map(function (p) {
                return {
                    item_id: String(p.id),
                    item_name: p.nombre + " " + p.presentacion + "g",
                    item_variant: p.molienda,
                    price: p.precio,
                    quantity: p.cantidad
                };
            });

            window.trackPurchase(
                {
                    transaction_id: transId,
                    value: d.total,
                    shipping: d.envio,
                    currency: "COP",
                    items: items
                },
                pedido.cliente || null
            );

            try {
                localStorage.setItem("purchase_enviado_" + transId, "1");
            } catch (e) { /* no-op */ }
        }
    }

    // =========================================================
    // LIMPIAR EL CARRITO TRAS UNA COMPRA ACEPTADA
    // =========================================================
    if (estadoAceptado) {
        try {
            localStorage.removeItem("carrito");
        } catch (e) { /* no-op */ }
    }

})();
