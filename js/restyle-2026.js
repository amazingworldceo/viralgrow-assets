/* ViralGrow.io - ritocchi del 20 nov 2026: home (Sign in, FAQ) e parte interna (ordini a schede,
   istruzioni fuori dal catalogo, oggetti rapidi dei ticket, pulsante Copia). Ogni pezzo agisce solo
   se trova la sua pagina; se qualcosa non torna, lascia la pagina com'era. */
(function () {
    // Cartella del tag da cui arriva questo file (es. .../viralgrow-assets@v1.25/): serve a caricare la copertina del video
    var me = document.currentScript;
    var BASE = me && me.src ? me.src.replace(/js\/restyle-2026\.js.*$/, '') : '';

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
        var scatola = login && login.closest('.banner-img');
        if (scatola) scatola.classList.add('vg-login-box');
        var hero = document.querySelector('.main-banner-section .started-btn');
        if (!hero || hero.querySelector('.vg-signin-btn')) return;
        var registrati = hero.querySelector('a[href="/signup"]');
        if (registrati) registrati.textContent = 'Create new account';
        var a = el('a', 'btn btn-primary vg-signin-btn', 'Sign in');
        a.href = login ? '#vg-login' : '/';
        // Il modulo di accesso arriva al centro dello schermo, non attaccato in alto
        if (login) a.addEventListener('click', function (e) {
            e.preventDefault();
            login.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        hero.appendChild(a);
    }

    // Parte interna: in cima a ogni pagina il suo nome, preso dalla voce attiva del menu
    function titoloPagina() {
        var voce = document.querySelector('#sidenav-main .nav-item.active .nav-link-text');
        var pagina = document.querySelector('.innerMainPage .container');
        if (!voce || !pagina || pagina.querySelector('.vg-page-title')) return;
        pagina.insertBefore(el('h1', 'vg-page-title', voce.textContent.trim()), pagina.firstChild);
    }

    // Home: il video Vimeo sale in cima al posto dell'animazione; la sua sezione piu' in basso sparisce
    function videoInCima() {
        var posto = document.querySelector('.main-banner-section .banner-img');
        var sezione = document.querySelector('.banner-video-section');
        var video = sezione && sezione.querySelector('.banner-video');
        if (!posto || !video) return;
        posto.textContent = '';
        posto.classList.add('vg-hero-video');
        posto.appendChild(video);
        sezione.style.display = 'none';
    }

    // Home: copertina animata sopra il video (copertina/copertina.css e .js, stesso tag di questo file)
    function caricaCopertina() {
        if (!BASE || !document.querySelector('.vg-hero-video .banner-video')) return;
        var css = el('link');
        css.rel = 'stylesheet';
        css.href = BASE + 'copertina/copertina.css';
        document.head.appendChild(css);
        var js = el('script');
        js.src = BASE + 'copertina/copertina.js';
        document.body.appendChild(js);
    }

    function dal2020() {
        var titolo = document.querySelector('.main-banner-section .banner-txt h1');
        if (titolo && !titolo.querySelector('.vg-since')) titolo.appendChild(el('span', 'vg-since', 'Since 2020'));
    }

    // Home: il secondo titolo ripeteva quello in cima; ora ne dice un'altra
    function secondoTitolo() {
        var titoli = document.querySelectorAll('.banner-txt h1');
        if (titoli.length < 2 || !/social media tool/i.test(titoli[1].textContent)) return;
        titoli[1].textContent = '';
        titoli[1].appendChild(el('span', '', 'Grow faster.'));
        titoli[1].appendChild(document.createTextNode(' Pay less.'));
    }

    // Home da laptop: le animazioni partono appena la sezione entra nello schermo e durano 0,6 s
    function animazioniPrima() {
        if (window.innerWidth < 768) return;
        document.querySelectorAll('[data-aos]').forEach(function (e) {
            e.setAttribute('data-aos-offset', '0');
            e.setAttribute('data-aos-duration', '600');
        });
        window.addEventListener('load', function () { if (window.AOS) window.AOS.refreshHard(); });
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
        var colonnaStato = nomi.findIndex(function (n) { return /^status$/i.test(n); });
        tabella.querySelectorAll('tbody tr').forEach(function (riga) {
            Array.prototype.forEach.call(riga.children, function (cella, i) {
                if (nomi[i]) cella.setAttribute('data-label', nomi[i]);
                if (i === colonnaStato) statoColorato(cella);
            });
        });
        tabella.classList.add('vg-cards');
    }

    // Ordini: lo stato diventa una pillola colorata (verde Completed, rosso Canceled...)
    var STATI = { 'completed': 'ok', 'in progress': 'run', 'processing': 'proc', 'pending': 'wait',
                  'partial': 'part', 'canceled': 'stop', 'cancelled': 'stop' };
    function statoColorato(cella) {
        var testo = cella.textContent.trim();
        var tipo = STATI[testo.toLowerCase()];
        if (!tipo || cella.querySelector('.vg-status')) return;
        cella.textContent = '';
        cella.appendChild(el('span', 'vg-status vg-status-' + tipo, testo));
    }

    // Ricordo dell'avviso: si azzera su ogni pagina da non loggato (login, home), cosi' torna al login dopo
    function avvisoGiaVisto(azione) {
        try {
            if (azione === 'leggi') return localStorage.getItem('vg-avviso-visto') === '1';
            if (azione === 'segna') localStorage.setItem('vg-avviso-visto', '1');
            else localStorage.removeItem('vg-avviso-visto');
        } catch (e) { /* senza memoria del browser l'avviso si vede come prima */ }
        return false;
    }

    // Nuovo ordine: avviso "Good to know" sopra il modulo, con testo fisso: resta anche se Mirko spegne
    // la categoria "General Instructions" nel pannello. Si vede solo al primo "New order" dopo il login.
    var CONSIGLI = [
        '⭐ We add new services all the time. In each category, order the one with the highest ID: it\'s the newest and the most stable. The date next to the category name shows the last update.',
        '⏱️ No delivery time shown? It\'s a new service, so the first orders may take a bit longer.',
        '🔎 Find a service fast: go to https://viralgrow.io/services, type its name in the search bar and order from there.',
        '❓ Can\'t find what you need? Open a ticket and we\'ll set up a custom service for you.',
        '💳 Want to pay by credit card? Open a ticket and we\'ll review your request.'
    ];
    function avvisoNuovoOrdine() {
        var modulo = document.getElementById('order-form');
        if (!modulo || document.querySelector('.vg-notice') || avvisoGiaVisto('leggi')) return;
        avvisoGiaVisto('segna');
        var avviso = el('div', 'vg-notice');
        avviso.appendChild(el('p', 'vg-notice-title', 'Good to know'));
        var lista = el('ul');
        CONSIGLI.forEach(function (t) { lista.appendChild(el('li', '', t)); });
        avviso.appendChild(lista);
        modulo.parentNode.insertBefore(avviso, modulo);
    }

    // Se la categoria "General Instructions" c'e' ancora esce dalla tendina; se era quella scelta si passa alla prossima.
    // Il pannello riempie le tendine dopo il caricamento: si riprova finche' le categorie ci sono (max ~4 s).
    function togliCategoriaIstruzioni(tentativo) {
        var categoria = document.getElementById('orderform-category');
        if (!categoria) return;
        tentativo = tentativo || 0;
        if (categoria.options.length < 2) {
            if (tentativo < 20) setTimeout(function () { togliCategoriaIstruzioni(tentativo + 1); }, 200);
            return;
        }
        var opzione = Array.prototype.find.call(categoria.options, function (o) {
            return /general instructions/i.test(o.textContent);
        });
        if (!opzione) return;
        var eraScelta = categoria.value === opzione.value;
        opzione.remove();
        var prossima = Array.prototype.find.call(categoria.options, function (o) { return o.value; });
        if (!eraScelta || !prossima) return;
        categoria.value = prossima.value;
        categoria.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Nuovo ordine: il numero del servizio in un riquadrino prima del nome (sul servizio scelto e nella lista),
    // cosi' il cliente lo ritrova nella pagina Services. Select2 ridisegna la tendina: si rimette a ogni cambio.
    function numeroServizio() {
        var servizio = document.getElementById('orderform-service');
        if (!servizio) return;
        var inCoda = false;
        // nella lista il testo sta in un blocco interno: il riquadro va li' dentro, sulla stessa riga del nome
        function metti(nodo, id, dentro) {
            if (!/^\d+$/.test(id || '')) return;
            var b = nodo.querySelector('.vg-sid');
            if (b && b.textContent === '#' + id) return;
            if (b) b.remove();
            var dove = (dentro && nodo.firstElementChild) || nodo;
            // molti nomi iniziano gia' con "11899 - ": col riquadro il numero non si ripete
            var testo = document.createTreeWalker(dove, NodeFilter.SHOW_TEXT).nextNode();
            var inizio = new RegExp('^\\s*' + id + '\\s*-\\s*');
            if (testo && inizio.test(testo.nodeValue)) testo.nodeValue = testo.nodeValue.replace(inizio, '');
            dove.insertBefore(el('span', 'vg-sid', '#' + id), dove.firstChild);
        }
        function aggiorna() {
            inCoda = false;
            var scelto = document.getElementById('select2-orderform-service-container');
            if (scelto) metti(scelto, servizio.value);
            document.querySelectorAll('[id^="select2-orderform-service-result-"]').forEach(function (li) {
                var m = li.id.match(/-(\d+)$/);
                if (m) metti(li, m[1], true);
            });
        }
        new MutationObserver(function () {
            if (!inCoda) { inCoda = true; requestAnimationFrame(aggiorna); }
        }).observe(document.body, { childList: true, subtree: true });
        aggiorna();
    }

    // Quadratini con il logo della piattaforma sulla riga del titolo (New order e Services): uno tocca Instagram e
    // restano solo le categorie Instagram. La piattaforma si legge dal nome della categoria; "All" sta in fondo.
    var PIATTAFORME = [
        { nome: 'Instagram', icona: 'fab fa-instagram', re: /insta|most ordered/i },  // "Most ordered" sono tutti Instagram (Mirko)
        { nome: 'TikTok', icona: 'fab fa-tiktok', re: /tik\s?tok/i },
        { nome: 'YouTube', icona: 'fab fa-youtube', re: /you\s?tube/i },
        { nome: 'Facebook', icona: 'fab fa-facebook', re: /facebook/i }
    ];
    var ALTRE = { nome: 'Other', icona: 'fas fa-ellipsis-h' }, TUTTE = { nome: 'All', icona: 'fas fa-th-large' };
    function piattaformaDi(nomeCategoria) {
        return (PIATTAFORME.find(function (p) { return p.re.test(nomeCategoria); }) || ALTRE).nome;
    }

    // nomi = nomi delle categorie della pagina; scegli(nome) filtra la pagina ("All" = tutto);
    // sotto = quadratini su una riga loro sotto il titolo (Services), se no accanto al titolo (New order);
    // iniziale = piattaforma scelta all'apertura (Mirko: Instagram)
    function barraPiattaforme(nomi, scegli, sotto, iniziale) {
        if (document.querySelector('.vg-plat')) return;
        var presenti = {};
        nomi.forEach(function (n) { presenti[piattaformaDi(n)] = true; });
        var voci = PIATTAFORME.concat([ALTRE]).filter(function (p) { return presenti[p.nome]; }).concat([TUTTE]);
        if (voci.length < 3) return;  // una piattaforma sola: i quadratini non servono
        var riga = el('div', 'vg-plat');
        voci.forEach(function (p) {
            var b = el('button', 'vg-plat-btn' + (p === TUTTE ? ' active' : ''));
            b.type = 'button';
            b.appendChild(el('i', p.icona));
            b.appendChild(el('span', '', p.nome));
            b.addEventListener('click', function () {
                riga.querySelectorAll('.vg-plat-btn').forEach(function (x) { x.classList.toggle('active', x === b); });
                scegli(p.nome);
            });
            riga.appendChild(b);
        });
        var prima = voci.map(function (p) { return p.nome; }).indexOf(iniziale);
        if (prima >= 0) riga.children[prima].click();
        var titolo = document.querySelector('.innerMainPage .vg-page-title');
        var pagina = document.querySelector('.innerMainPage .container');
        if (sotto) {
            riga.classList.add('vg-plat-grid');
            if (titolo) titolo.parentNode.insertBefore(riga, titolo.nextSibling);
            else if (pagina) pagina.insertBefore(riga, pagina.firstChild);
            return;
        }
        var testa = el('div', 'vg-title-row');
        if (titolo) { titolo.parentNode.insertBefore(testa, titolo); testa.appendChild(titolo); }
        else if (pagina) pagina.insertBefore(testa, pagina.firstChild);
        else return;
        testa.appendChild(riga);
    }

    // New order: nella tendina Category restano solo le categorie della piattaforma scelta
    function piattaformeNuovoOrdine(tentativo) {
        var categoria = document.getElementById('orderform-category');
        if (!categoria) return;
        tentativo = tentativo || 0;
        if (categoria.options.length < 2) {
            if (tentativo < 20) setTimeout(function () { piattaformeNuovoOrdine(tentativo + 1); }, 200);
            return;
        }
        var tutte = Array.prototype.filter.call(categoria.options, function (o) {
            return o.value && !/general instructions/i.test(o.textContent);
        });
        // si apre su Instagram, salvo una categoria gia' scelta di un'altra piattaforma (es. da "Order now")
        var attuale = categoria.options[categoria.selectedIndex];
        var iniziale = attuale && attuale.value ? piattaformaDi(attuale.textContent) : 'Instagram';
        barraPiattaforme(tutte.map(function (o) { return o.textContent; }), function (nome) {
            var scelta = nome === TUTTE.nome ? tutte : tutte.filter(function (o) { return piattaformaDi(o.textContent) === nome; });
            var prima = categoria.value;
            categoria.textContent = '';
            scelta.forEach(function (o) { categoria.appendChild(o); });
            categoria.value = scelta.some(function (o) { return o.value === prima; }) ? prima : scelta[0].value;
            if (categoria.value !== prima) categoria.dispatchEvent(new Event('change', { bubbles: true }));
        }, false, iniziale);
    }

    // Services: le righe (titolo della categoria e servizi) delle altre piattaforme si nascondono e nella tendina
    // "All Categories" restano solo le categorie della piattaforma scelta; la ricerca del tema resta com'e'
    function piattaformeServizi() {
        var righe = document.querySelectorAll('.services-page tr[data-index]');
        if (!righe.length) return;
        var nomi = [];
        righe.forEach(function (r) { var n = r.getAttribute('data-index'); if (nomi.indexOf(n) < 0) nomi.push(n); });
        var voci = document.querySelectorAll('#dropdown-selector .dropdown-item');
        var tutteLeCategorie = voci[0], tendina = document.getElementById('dropdown-categories');
        barraPiattaforme(nomi, function (nome) {
            var fuori = function (categoria) { return nome !== TUTTE.nome && piattaformaDi(categoria) !== nome; };
            righe.forEach(function (r) { r.classList.toggle('vg-plat-off', fuori(r.getAttribute('data-index'))); });
            voci.forEach(function (a, i) { if (i) a.classList.toggle('vg-plat-off', fuori(a.getAttribute('data-target'))); });
            // categoria scelta di un'altra piattaforma: si torna a "All Categories"
            if (tendina && tutteLeCategorie && tendina.value !== tutteLeCategorie.getAttribute('data-target') &&
                fuori(tendina.value) && typeof window.dropdownChange === 'function') window.dropdownChange(tutteLeCategorie);
        }, true, 'Instagram');
    }

    // Services: "View" apre una finestra con la descrizione e Order now, staccata dalla barra in alto, con la X sempre
    // visibile; si chiude con la X, toccando fuori o con Esc. Sostituisce la finestra del tema, che sul telefono finiva
    // sotto la barra e senza X raggiungibile.
    function finestraDescrizione() {
        if (!document.querySelector('.services-page td.service-description')) return;
        var velo = el('div', 'vg-pop'), scatola = el('div', 'vg-pop-box'), chiudi = el('button', 'vg-pop-x', '×');
        var testo = el('div', 'vg-pop-body');
        chiudi.type = 'button';
        chiudi.setAttribute('aria-label', 'Close');
        scatola.appendChild(chiudi);
        scatola.appendChild(testo);
        velo.appendChild(scatola);
        document.body.appendChild(velo);
        function chiudiFinestra() { velo.classList.remove('open'); document.body.classList.remove('vg-pop-open'); }
        chiudi.addEventListener('click', chiudiFinestra);
        velo.addEventListener('click', function (e) { if (e.target === velo) chiudiFinestra(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') chiudiFinestra(); });
        // in cattura: il clic non arriva al tema (modalShow) ne' a Bootstrap
        window.addEventListener('click', function (e) {
            var pulsante = e.target.closest && e.target.closest('.services-page td.service-description .btn');
            if (!pulsante || pulsante.closest('.vg-pop')) return;
            e.preventDefault();
            e.stopPropagation();
            var nascosto = pulsante.querySelector('.hidden');
            testo.innerHTML = nascosto ? nascosto.innerHTML : '';
            var ordina = testo.querySelector('.order-btn');
            if (ordina) ordina.remove();
            if (!testo.textContent.trim()) testo.textContent = 'At the moment details for this service is not available.';
            if (ordina) testo.appendChild(ordina);
            testo.scrollTop = 0;
            velo.classList.add('open');
            document.body.classList.add('vg-pop-open');
        }, true);
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
        if (!document.getElementById('sidenav-main')) avvisoGiaVisto('azzera');  // il menu c'e' solo da loggati
        // New order compatto (il CSS stringe gli spazi solo su questa pagina)
        if (document.getElementById('order-form')) document.body.classList.add('vg-neworder');
        [titoloPagina, videoInCima, caricaCopertina, dal2020, secondoTitolo, pulsanteSignIn, animazioniPrima, faqCompatte, ordiniASchede, oggettiTicket, pulsantiCopia].forEach(function (f) {
            try { f(); } catch (e) { /* un ritocco che non riesce non deve fermare gli altri */ }
        });
        // Dopo gli script del pannello, che girano dopo questo file
        window.addEventListener('load', function () {
            setTimeout(function () {
                [avvisoNuovoOrdine, togliCategoriaIstruzioni, piattaformeNuovoOrdine, piattaformeServizi, finestraDescrizione, numeroServizio, pulsantiCopia].forEach(function (f) {
                    try { f(0); } catch (e) { /* pagina lasciata com'era */ }
                });
            }, 300);
        });
        // Le istruzioni dei metodi di pagamento cambiano quando si sceglie un metodo diverso
        var metodo = document.getElementById('method');
        if (metodo) metodo.addEventListener('change', function () { setTimeout(pulsantiCopia, 300); });
    });
})();
