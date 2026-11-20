/* ViralGrow.io - ritocchi del 20 nov 2026: home (Sign in, FAQ) e parte interna (ordini a schede,
   istruzioni fuori dal catalogo, oggetti rapidi dei ticket, pulsante Copia). Ogni pezzo agisce solo
   se trova la sua pagina; se qualcosa non torna, lascia la pagina com'era. */
(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    function el(tag, className, text) {
        var e = document.createElement(tag);
        if (className) e.className = className;
        if (text) e.textContent = text;
        return e;
    }

    // Home: "Sign in" accanto a "Get Started Now!"
    function pulsanteSignIn() {
        var login = document.querySelector('.main-landing-section form');
        if (login && !login.id) login.id = 'vg-login';
        var hero = document.querySelector('.main-banner-section .started-btn');
        if (!hero || hero.querySelector('.vg-signin-btn')) return;
        var a = el('a', 'btn btn-primary vg-signin-btn', 'Sign in');
        a.href = login ? '#vg-login' : '/';
        hero.appendChild(a);
    }

    // Home: 5 domande per gruppo, le altre con "Show all questions"
    function faqCompatte() {
        document.querySelectorAll('.faq-section .accordion').forEach(function (gruppo) {
            var carte = gruppo.querySelectorAll(':scope > .card');
            if (carte.length <= 5) return;
            for (var j = 5; j < carte.length; j++) carte[j].classList.add('vg-faq-hidden');
            var b = el('button', 'vg-faq-more', 'Show all questions (' + carte.length + ')');
            b.type = 'button';
            b.addEventListener('click', function () {
                gruppo.querySelectorAll('.vg-faq-hidden').forEach(function (c) { c.classList.remove('vg-faq-hidden'); });
                b.remove();
            });
            gruppo.appendChild(b);
        });
    }

    // Ordini: ogni cella prende il nome della sua colonna, il CSS su telefono ne fa una scheda
    function ordiniASchede() {
        var tabella = document.querySelector('table.table-manager');
        if (!tabella || !tabella.querySelector('th.orderLinkTh')) return;
        var nomi = Array.prototype.map.call(tabella.querySelectorAll('thead th'), function (th) {
            return th.textContent.trim();
        });
        tabella.querySelectorAll('tbody tr').forEach(function (riga) {
            Array.prototype.forEach.call(riga.children, function (cella, i) {
                if (nomi[i]) cella.setAttribute('data-label', nomi[i]);
            });
        });
        tabella.classList.add('vg-cards');
    }

    // Nuovo ordine: la categoria "General Instructions" diventa un avviso sopra il modulo
    function istruzioniComeAvviso() {
        var categoria = document.getElementById('orderform-category');
        var servizio = document.getElementById('orderform-service');
        var modulo = document.getElementById('order-form');
        if (!categoria || !servizio || !modulo) return;
        var opzione = Array.prototype.find.call(categoria.options, function (o) {
            return /general instructions/i.test(o.textContent);
        });
        if (!opzione) return;
        // Se il cliente arriva gia' su un'altra categoria, si toglie solo la voce delle istruzioni
        if (categoria.value !== opzione.value) { opzione.remove(); return; }
        // Le istruzioni sono i "servizi" gia' caricati nella tendina: diventano le righe dell'avviso
        var righe = Array.prototype.map.call(servizio.options, function (o) {
            return o.textContent.replace(/\s+-\s+\$?[\d.,]+\s*\$?(\s*per\s*\d+)?\s*$/i, '').trim();
        }).filter(Boolean);
        var prossima = Array.prototype.find.call(categoria.options, function (o) { return o !== opzione && o.value; });
        if (!prossima || !righe.length) return;
        opzione.remove();
        categoria.value = prossima.value;
        categoria.dispatchEvent(new Event('change', { bubbles: true }));
        var avviso = el('div', 'vg-notice');
        avviso.appendChild(el('p', 'vg-notice-title', 'Good to know'));
        var lista = el('ul');
        righe.forEach(function (t) { lista.appendChild(el('li', '', t)); });
        avviso.appendChild(lista);
        modulo.parentNode.insertBefore(avviso, modulo);
    }

    // Ticket: oggetti rapidi sopra il campo Subject
    function oggettiTicket() {
        var oggetto = document.getElementById('subject');
        if (!oggetto || !document.getElementById('ticketsend')) return;
        var scelte = ['Order', 'Payment', 'Refill', 'Other'];
        var riga = el('div', 'vg-chips');
        scelte.forEach(function (s) {
            var b = el('button', 'vg-chip', s);
            b.type = 'button';
            b.addEventListener('click', function () {
                oggetto.value = s;
                riga.querySelectorAll('.vg-chip').forEach(function (c) { c.classList.toggle('active', c === b); });
                var messaggio = document.getElementById('message');
                if (messaggio) messaggio.focus();
            });
            riga.appendChild(b);
        });
        oggetto.parentNode.insertBefore(riga, oggetto);
    }

    // Aggiungi fondi: pulsante "Copy" accanto all'email di pagamento
    function pulsantiCopia() {
        document.querySelectorAll('.vg-copy').forEach(function (campo) {
            if (campo.querySelector('.vg-copy-btn')) return;
            var testo = campo.textContent.trim();
            var b = el('button', 'vg-copy-btn', 'Copy');
            b.type = 'button';
            b.addEventListener('click', function () {
                var fatto = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1500); };
                if (navigator.clipboard) navigator.clipboard.writeText(testo).then(fatto);
                else {
                    var r = document.createRange(); r.selectNodeContents(campo.firstChild);
                    var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
                    document.execCommand('copy'); fatto();
                }
            });
            campo.appendChild(b);
        });
    }

    ready(function () {
        [pulsanteSignIn, faqCompatte, ordiniASchede, istruzioniComeAvviso, oggettiTicket, pulsantiCopia].forEach(function (f) {
            try { f(); } catch (e) { /* un ritocco che non riesce non deve fermare gli altri */ }
        });
        // Le istruzioni dei metodi di pagamento cambiano quando si sceglie un metodo diverso
        var metodo = document.getElementById('method');
        if (metodo) metodo.addEventListener('change', function () { setTimeout(pulsantiCopia, 300); });
    });
})();
