// =========================================================
// i18n - Ser Café (Español / Inglés)
// ---------------------------------------------------------
// Traduce la interfaz según el idioma elegido. El idioma se
// guarda en localStorage ("sercafe_idioma") y se aplica a
// cualquier elemento con atributo data-i18n (texto) o
// data-i18n-attr (atributos como placeholder/alt/title).
//
// Uso en HTML:
//   <h1 data-i18n="hero_titulo">El alma de Nariño...</h1>
//   <input data-i18n-attr="placeholder:form_nombre_ph">
//
// El botón de idioma se inyecta automáticamente en el header.
// =========================================================

(function () {

    const DICC = {
        es: {
            // --- Navegación / header (común a todas las páginas) ---
            nav_nosotros: "Nosotros",
            nav_perfil: "Perfil",
            nav_contacto: "Contáctanos",
            btn_comprar: "🛒 Comprar Café",
            btn_tienda_cafe: "🛒 Tienda Café",

            // --- Index ---
            idx_kicker: "Café de especialidad · Nariño",
            idx_h1: "El alma de Nariño en cada taza",
            idx_p: "Un café de origen único cultivado a 1.978 msnm en La Florida, Nariño. Notas de chocolate, caramelo y una acidez cítrica brillante.",
            idx_origen_eyebrow: "Nuestro origen",
            idx_origen_h2: "Desde la Finca Lucitania",
            idx_origen_h3: "Café variedad Castillo Sur",
            idx_origen_p1: "En el corazón de Nariño, en la Finca Lucitania, cultivamos con pasión nuestro café. El proceso de lavado y el secado al sol preservan la pureza de cada grano.",
            idx_origen_p2: "Un café con carácter, trazable desde la montaña hasta tu taza.",
            idx_stat1: "msnm de cultivo en altura",
            idx_stat2: "Variedades de especialidad",
            idx_stat3: "Café de origen, Colombia",
            idx_exp_eyebrow: "La experiencia",
            idx_exp_h2: "Una taza con personalidad",
            idx_exp_h3: "Perfil de sabor",
            idx_exp_p: "Cada detalle cuenta para ofrecerte una taza perfecta: notas de naranja y frutos negros, aromas a chocolate y caramelo, y una acidez cítrica que ilumina el paladar.",
            idx_exp_cta: "Ver perfil completo",
            idx_cta_h2: "Lleva Ser Café a tu taza",
            idx_cta_btn: "🛒 Comprar café",

            // --- Tienda ---
            tienda_kicker: "Tienda · Finca Lucitania",
            tienda_h1: "Café de especialidad colombiano",
            tienda_p: "Castillo Sur, Chiroso y Catimor, seleccionados directamente de origen desde Nariño. Elige tu variedad, molienda y presentación.",
            tienda_eyebrow: "Nuestro catálogo",
            tienda_h2: "Nuestros Cafés",
            prod_molienda: "Tipo de molienda",
            prod_agregar: "Agregar al carrito",
            molienda_grano: "Grano",
            molienda_media: "Media",
            molienda_fina: "Fina",
            molienda_gruesa: "Gruesa",

            // --- Carrito ---
            carrito_titulo: "Mi Carrito",
            carrito_vacio: "Tu carrito está vacío",
            carrito_ubicacion: "Ubicación de entrega",
            carrito_sel_depto: "Seleccione departamento",
            carrito_sel_muni: "Seleccione municipio",
            carrito_muni_escribir: "Escribe tu ciudad / municipio",
            carrito_resumen: "Resumen",
            carrito_subtotal: "Subtotal:",
            carrito_envio: "Envío:",
            carrito_total: "Total:",
            carrito_consent: "Aceptar",
            carrito_consent_link: "política de privacidad",
            carrito_consent_fin: " de Ser Café",
            carrito_generar: "Generar Pago",
            carrito_pagar: "Pagar",

            // --- Perfil ---
            perfil_kicker: "Perfil sensorial",
            perfil_h1: "Nuestras variedades",
            perfil_p: "Cada taza cuenta una historia. Conoce el origen y el carácter de los cafés que cultivamos.",
            perfil_altura: "Altura",
            perfil_proceso: "Proceso",
            perfil_variedad: "Variedad",
            perfil_tostion: "Nivel de tostión",
            perfil_acidez: "Acidez",
            perfil_complejidad: "Complejidad",
            perfil_comprar: "🛒 Comprar",

            // --- Contacto ---
            cont_kicker: "Hablemos de café",
            cont_h1: "Contáctanos",
            cont_p: "¿Tienes dudas o quieres hacer un pedido especial? Escríbenos y te responderemos lo antes posible.",
            cont_info_h2: "Estamos en Nariño",
            cont_info_p: "La Florida, Nariño — Colombia. Café de especialidad desde la Finca Lucitania.",
            cont_form_h3: "Envíanos un mensaje",
            cont_nombre: "Nombre",
            cont_nombre_ph: "Tu nombre",
            cont_correo: "Correo electrónico",
            cont_correo_ph: "tucorreo@ejemplo.com",
            cont_tel: "Teléfono (opcional)",
            cont_tel_ph: "+57 312...",
            cont_mensaje: "Mensaje",
            cont_mensaje_ph: "Cuéntanos en qué te podemos ayudar...",
            cont_enviar: "Enviar mensaje",

            // --- Gracias ---
            gr_kicker: "Pedido recibido",
            gr_h1: "¡Gracias por tu compra!",
            gr_p: "Tu pedido de café de especialidad ya está en camino de ser preparado con todo el cariño desde la finca.",
            gr_conf: "Confirmación",
            gr_titulo: "¡Tu pedido fue registrado!",
            gr_mensaje: "Hemos recibido tu pedido. En breve recibirás la confirmación de pago y los detalles del envío. ¡Gracias por elegir Ser Café! ☕",
            gr_ref: "Referencia:",
            gr_estado: "Estado:",
            gr_resumen: "Resumen de tu pedido",
            gr_seguir: "Seguir comprando",
            gr_inicio: "Volver al inicio",
            gr_contacto: "¿Tienes dudas sobre tu pedido?",
            gr_contacto_link: "Contáctanos",
            gr_contacto_fin: "o escríbenos por WhatsApp.",
            gr_subtotal: "Subtotal",
            gr_envio: "Envío",
            gr_total: "Total",
            gr_envio_a: "Envío a:",
            gr_aprobado: "¡Tu pago fue aprobado!",
            gr_aprobado_msg: "Recibimos tu pago correctamente. Estamos preparando tu café y pronto te contactaremos con los datos del envío. ¡Gracias por elegir Ser Café! ☕",
            gr_estado_aprobado: "Aprobado ✓",
            gr_rechazado: "Tu pago no pudo completarse",
            gr_rechazado_msg: "No logramos confirmar tu pago. Puedes intentarlo de nuevo desde la tienda o escribirnos por WhatsApp y te ayudamos a finalizar tu compra.",
            gr_verificacion: "En verificación",

            // --- Footer ---
            footer_desc: "Café de especialidad colombiano, desde la Finca Lucitania en Nariño.",
            footer_copy: "Todos los derechos reservados."
        },

        en: {
            nav_nosotros: "About us",
            nav_perfil: "Profile",
            nav_contacto: "Contact",
            btn_comprar: "🛒 Buy Coffee",
            btn_tienda_cafe: "🛒 Coffee Shop",

            idx_kicker: "Specialty coffee · Nariño",
            idx_h1: "The soul of Nariño in every cup",
            idx_p: "A single-origin coffee grown at 1,978 masl in La Florida, Nariño. Notes of chocolate, caramel and a bright citric acidity.",
            idx_origen_eyebrow: "Our origin",
            idx_origen_h2: "From Finca Lucitania",
            idx_origen_h3: "Castillo Sur variety coffee",
            idx_origen_p1: "In the heart of Nariño, at Finca Lucitania, we grow our coffee with passion. The washed process and sun drying preserve the purity of every bean.",
            idx_origen_p2: "A coffee with character, traceable from the mountain to your cup.",
            idx_stat1: "masl of high-altitude growing",
            idx_stat2: "Specialty varieties",
            idx_stat3: "Single-origin coffee, Colombia",
            idx_exp_eyebrow: "The experience",
            idx_exp_h2: "A cup with personality",
            idx_exp_h3: "Flavor profile",
            idx_exp_p: "Every detail matters to give you the perfect cup: notes of orange and dark fruits, chocolate and caramel aromas, and a citric acidity that lights up the palate.",
            idx_exp_cta: "See full profile",
            idx_cta_h2: "Bring Ser Café to your cup",
            idx_cta_btn: "🛒 Buy coffee",

            tienda_kicker: "Shop · Finca Lucitania",
            tienda_h1: "Colombian specialty coffee",
            tienda_p: "Castillo Sur, Chiroso and Catimor, sourced directly from origin in Nariño. Choose your variety, grind and size.",
            tienda_eyebrow: "Our catalog",
            tienda_h2: "Our Coffees",
            prod_molienda: "Grind type",
            prod_agregar: "Add to cart",
            molienda_grano: "Whole bean",
            molienda_media: "Medium",
            molienda_fina: "Fine",
            molienda_gruesa: "Coarse",

            carrito_titulo: "My Cart",
            carrito_vacio: "Your cart is empty",
            carrito_ubicacion: "Delivery location",
            carrito_sel_depto: "Select department",
            carrito_sel_muni: "Select city",
            carrito_muni_escribir: "Type your city / town",
            carrito_resumen: "Summary",
            carrito_subtotal: "Subtotal:",
            carrito_envio: "Shipping:",
            carrito_total: "Total:",
            carrito_consent: "I acept",
            carrito_consent_link: "privacy policy",
            carrito_consent_fin: " of Ser Café",
            carrito_generar: "Generate Payment",
            carrito_pagar: "Pay",

            perfil_kicker: "Sensory profile",
            perfil_h1: "Our varieties",
            perfil_p: "Every cup tells a story. Discover the origin and character of the coffees we grow.",
            perfil_altura: "Altitude",
            perfil_proceso: "Process",
            perfil_variedad: "Variety",
            perfil_tostion: "Roast level",
            perfil_acidez: "Acidity",
            perfil_complejidad: "Complexity",
            perfil_comprar: "🛒 Buy",

            cont_kicker: "Let's talk coffee",
            cont_h1: "Contact us",
            cont_p: "Have questions or want a special order? Write to us and we'll reply as soon as possible.",
            cont_info_h2: "We're in Nariño",
            cont_info_p: "La Florida, Nariño — Colombia. Specialty coffee from Finca Lucitania.",
            cont_form_h3: "Send us a message",
            cont_nombre: "Name",
            cont_nombre_ph: "Your name",
            cont_correo: "Email",
            cont_correo_ph: "youremail@example.com",
            cont_tel: "Phone (optional)",
            cont_tel_ph: "+57 312...",
            cont_mensaje: "Message",
            cont_mensaje_ph: "Tell us how we can help...",
            cont_enviar: "Send message",

            gr_kicker: "Order received",
            gr_h1: "Thank you for your purchase!",
            gr_p: "Your specialty coffee order is on its way to being prepared with all the care from the farm.",
            gr_conf: "Confirmation",
            gr_titulo: "Your order was registered!",
            gr_mensaje: "We received your order. You'll soon get the payment confirmation and shipping details. Thank you for choosing Ser Café! ☕",
            gr_ref: "Reference:",
            gr_estado: "Status:",
            gr_resumen: "Your order summary",
            gr_seguir: "Keep shopping",
            gr_inicio: "Back to home",
            gr_contacto: "Questions about your order?",
            gr_contacto_link: "Contact us",
            gr_contacto_fin: "or write to us on WhatsApp.",
            gr_subtotal: "Subtotal",
            gr_envio: "Shipping",
            gr_total: "Total",
            gr_envio_a: "Shipping to:",
            gr_aprobado: "Your payment was approved!",
            gr_aprobado_msg: "We received your payment correctly. We're preparing your coffee and will contact you soon with shipping details. Thank you for choosing Ser Café! ☕",
            gr_estado_aprobado: "Approved ✓",
            gr_rechazado: "Your payment could not be completed",
            gr_rechazado_msg: "We couldn't confirm your payment. You can try again from the shop or write to us on WhatsApp and we'll help you finish your purchase.",
            gr_verificacion: "Under verification",

            footer_desc: "Colombian specialty coffee, from Finca Lucitania in Nariño.",
            footer_copy: "All rights reserved."
        }
    };

    // Idioma actual
    function idiomaActual() {
        try {
            return localStorage.getItem("sercafe_idioma") || "es";
        } catch (e) {
            return "es";
        }
    }

    // Traduce una clave
    window.t = function (clave) {
        const idioma = idiomaActual();
        return (DICC[idioma] && DICC[idioma][clave]) || (DICC.es[clave]) || clave;
    };

    // Aplica traducciones a todo el documento
    window.aplicarIdioma = function () {
        const idioma = idiomaActual();
        document.documentElement.lang = idioma;

        // Texto de elementos con data-i18n
        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            const clave = el.getAttribute("data-i18n");
            const valor = window.t(clave);
            if (valor) el.textContent = valor;
        });

        // Atributos (placeholder, alt, title...) con data-i18n-attr="attr:clave;attr2:clave2"
        document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
            el.getAttribute("data-i18n-attr").split(";").forEach(function (par) {
                const partes = par.split(":");
                if (partes.length === 2) {
                    el.setAttribute(partes[0].trim(), window.t(partes[1].trim()));
                }
            });
        });

        // Actualiza el botón de idioma
        const btn = document.getElementById("btnIdioma");
        if (btn) btn.textContent = idioma === "es" ? "EN" : "ES";

        // Avisar a otros scripts (p. ej. el carrito re-renderiza)
        document.dispatchEvent(new CustomEvent("idiomaCambiado", { detail: { idioma: idioma } }));
    };

    // Cambia el idioma
    window.cambiarIdioma = function () {
        const nuevo = idiomaActual() === "es" ? "en" : "es";
        try { localStorage.setItem("sercafe_idioma", nuevo); } catch (e) { /* no-op */ }
        window.aplicarIdioma();
    };

    // Inyecta el botón de idioma JUNTO al logo (dentro del "encuadre" de la
    // marca) para no alterar los espaciados del header, y el botón hamburguesa
    // para el menú móvil.
    function inyectarControlesHeader() {
        const header = document.querySelector("header");
        if (!header) return;

        // --- Agrupar logo + botón de idioma en un contenedor .marca ---
        const logoLink = header.querySelector("a");
        if (logoLink && !header.querySelector(".marca")) {
            const marca = document.createElement("div");
            marca.className = "marca";
            // Insertar el contenedor donde estaba el logo y mover el logo dentro
            logoLink.parentNode.insertBefore(marca, logoLink);
            marca.appendChild(logoLink);

            if (!document.getElementById("btnIdioma")) {
                const btn = document.createElement("button");
                btn.id = "btnIdioma";
                btn.className = "btn-idioma";
                btn.type = "button";
                btn.setAttribute("aria-label", "Cambiar idioma / Change language");
                btn.textContent = idiomaActual() === "es" ? "EN" : "ES";
                btn.addEventListener("click", window.cambiarIdioma);
                marca.appendChild(btn);
            }
        }

        // --- Botón hamburguesa (solo visible en móvil vía CSS) ---
        const nav = header.querySelector("nav");
        if (nav && !document.getElementById("btnMenu")) {
            const hamb = document.createElement("button");
            hamb.id = "btnMenu";
            hamb.className = "btn-menu";
            hamb.type = "button";
            hamb.setAttribute("aria-label", "Abrir menú / Open menu");
            hamb.setAttribute("aria-expanded", "false");
            hamb.innerHTML = "<span></span><span></span><span></span>";
            hamb.addEventListener("click", function () {
                const abierto = nav.classList.toggle("abierto");
                hamb.classList.toggle("activo", abierto);
                hamb.setAttribute("aria-expanded", abierto ? "true" : "false");
            });
            // Insertar la hamburguesa justo antes del nav
            nav.parentNode.insertBefore(hamb, nav);

            // Cerrar el menú al tocar un enlace
            nav.querySelectorAll("a").forEach(function (a) {
                a.addEventListener("click", function () {
                    nav.classList.remove("abierto");
                    hamb.classList.remove("activo");
                    hamb.setAttribute("aria-expanded", "false");
                });
            });
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        inyectarControlesHeader();
        window.aplicarIdioma();
    });

})();
