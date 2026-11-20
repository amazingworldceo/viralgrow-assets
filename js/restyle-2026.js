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
    // (Account non e' nel menu: il nome viene dall'indirizzo)
    function titoloPagina() {
        var voce = document.querySelector('#sidenav-main .nav-item.active .nav-link-text');
        var nome = voce ? voce.textContent.trim() : (/^\/account/.test(location.pathname) ? 'Account' : '');
        var pagina = document.querySelector('.innerMainPage .container');
        if (!nome || !pagina || pagina.querySelector('.vg-page-title')) return;
        pagina.insertBefore(el('h1', 'vg-page-title', nome), pagina.firstChild);
    }

    // Pagine minori (Mirko, 20 nov 2026 22:02): Mass order con l'esempio vero; Account con un solo pulsante grande
    // (Change password), gli altri piccoli; API senza il secondo titolo e con l'esempio allineato a sinistra;
    // nei passi di pagamento "Open a ticket" diventa un pulsante
    function pagineMinori() {
        var massa = document.querySelector('.massorder-page textarea');
        if (massa) massa.placeholder = 'One order per line: service ID | link | quantity\n' +
            'Example: 12338 | https://www.instagram.com/p/... | 1000';
        if (/^\/account/.test(location.pathname)) {
            document.querySelectorAll('.innerMainPage form').forEach(function (f) {
                var tasto = f.querySelector('button[type="submit"]');
                if (tasto && !f.querySelector('input[type="password"]')) tasto.classList.add('vg-btn-small');
            });
        }
        document.querySelectorAll('.api-page pre').forEach(function (p) { p.textContent = p.textContent.replace(/^\s+/, ''); });
        bottoneTicket();
    }
    function bottoneTicket() {
        document.querySelectorAll('.vg-pay-steps li').forEach(function (passo) {
            // il metodo carta coi link ha gia' il suo pulsante sotto gli importi
            if (passo.closest('.vg-pay').querySelector('.vg-ticket-btn') || !/open a ticket/i.test(passo.textContent)) return;
            var a = el('a', 'vg-ticket-btn', 'Open a ticket');
            a.href = '/tickets';
            passo.appendChild(a);
        });
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
        if (tabella && tabella.querySelector('th.orderLinkTh')) aSchede(tabella);
    }

    // Affiliates: sul telefono le tabelle a schede (la colonna dei guadagni non resta fuori) e Copy sul link referral
    function affiliatiASchede() {
        if (!document.querySelector('.affiliates_visits_table')) return;
        document.querySelectorAll('.innerMainPage table').forEach(aSchede);
        var link = document.querySelector('.innerMainPage table tbody td');
        if (link && /\/ref\//.test(link.textContent) && !link.querySelector('.vg-copy')) {
            var campo = el('span', 'vg-copy', link.textContent.trim());
            link.textContent = '';
            link.appendChild(campo);
        }
    }

    function aSchede(tabella) {
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

    // I consigli di "Good to know", con testo fisso: restano anche se Mirko spegne la categoria "General Instructions"
    var CONSIGLI = [
        '⭐ We add new services all the time. In each category, order the one with the highest ID: it\'s the newest and the most stable. The date next to the category name shows the last update.',
        '⏱️ No delivery time shown? It\'s a new service, so the first orders may take a bit longer.',
        '🔎 Find a service fast: go to https://viralgrow.io/services, type its name in the search bar and order from there.',
        '❓ Can\'t find what you need? Open a ticket and we\'ll set up a custom service for you.',
        '💳 Want to pay by credit card? Open a ticket and we\'ll review your request.'
    ];
    // "Good to know" sta nel menu della campanella in alto (Mirko, 20 nov 2026, 20:48: prima stava sopra New order).
    // Pallino rosso "1" a ogni login finche' la persona non ha aperto la campanella in VOLTE_CAMPANELLA login diversi.
    // Il conto e' del browser (vg-bell-visti); vg-bell-sess si azzera da non loggati come vg-avviso-visto.
    var VOLTE_CAMPANELLA = 3;
    function memoria(chiave, valore) {
        try {
            if (valore === undefined) return localStorage.getItem(chiave);
            if (valore === null) localStorage.removeItem(chiave); else localStorage.setItem(chiave, valore);
        } catch (e) { /* senza memoria del browser il pallino si vede a ogni pagina */ }
        return null;
    }
    function campanella() {
        var bottone = document.getElementById('notification-button'), lista = document.getElementById('spam_messages');
        if (!bottone || !lista || document.querySelector('.vg-bell-tips')) return;
        var voce = el('div', 'list-group-item vg-bell-tips');
        voce.appendChild(el('p', 'vg-notice-title', 'Good to know'));
        var elenco = el('ul');
        CONSIGLI.forEach(function (t) { elenco.appendChild(el('li', '', t)); });
        voce.appendChild(elenco);
        lista.insertBefore(voce, lista.firstChild);
        var visti = parseInt(memoria('vg-bell-visti') || '0', 10) || 0;
        if (visti >= VOLTE_CAMPANELLA || memoria('vg-bell-sess') === 'visto') return;
        var pallino = el('span', 'vg-bell-dot', '1');
        var link = bottone.querySelector('a') || bottone;
        link.appendChild(pallino);
        bottone.addEventListener('click', function () {
            if (!pallino.parentNode) return;
            pallino.remove();
            memoria('vg-bell-sess', 'visto');
            memoria('vg-bell-visti', String(visti + 1));
        });
    }

    // New order: la descrizione del servizio sotto il tasto (Mirko: il modulo resta corto, chi vuole i dettagli scorre).
    // Si sposta il blocco intero: il tema continua a riempirlo e a mostrarlo/nasconderlo per id.
    // Sotto il tasto, prima della descrizione: le due avvertenze che valgono per tutti i servizi (Mirko, 20 nov 2026)
    var AVVERTENZE = ['🔓 Keep your account and link public until the order is done.',
        '⏳ One order per link at a time. Wait for it to finish before ordering again.'];
    function descrizioneSottoIlTasto() {
        var tasto = document.querySelector('#order-form button[type="submit"]');
        if (!tasto || document.querySelector('.vg-order-notes')) return;
        var note = el('div', 'vg-order-notes');
        AVVERTENZE.forEach(function (t) { note.appendChild(el('p', '', t)); });
        tasto.parentNode.insertBefore(note, tasto.nextSibling);
        var blocco = document.getElementById('service_description');
        if (blocco) note.parentNode.insertBefore(blocco, note.nextSibling);
    }

    // New order: il titolo del campo Link dice quale link incollare per il servizio scelto (stesse regole delle
    // descrizioni dei servizi), con un esempio nel campo vuoto
    function linkGiusto(n) {
        n = n.toLowerCase();
        if (/spotify/.test(n)) return /listener/.test(n) ? ['Spotify ARTIST, track, album or playlist link', 'https://open.spotify.com/artist/...']
            : ['Spotify TRACK link', 'https://open.spotify.com/track/...'];
        if (/telegram/.test(n) && !/instagram/.test(n)) return /member|automatic/.test(n) ? ['Telegram CHANNEL link', 'https://t.me/yourchannel']
            : ['Telegram POST link', 'https://t.me/yourchannel/123'];
        if (/youtube/.test(n)) {
            if (/subscriber/.test(n)) return ['YouTube CHANNEL link', 'https://www.youtube.com/@yourchannel'];
            return [/live/.test(n) ? 'YouTube LIVE STREAM link' : 'YouTube VIDEO link', 'https://www.youtube.com/watch?v=...'];
        }
        if (/tik\s?tok/.test(n)) return /follower/.test(n) ? ['TikTok PROFILE link', 'https://www.tiktok.com/@username']
            : ['TikTok VIDEO link', 'https://www.tiktok.com/@username/video/...'];
        if (/facebook/.test(n)) return [/video/.test(n) ? 'Facebook VIDEO link' : 'Facebook POST link', 'https://www.facebook.com/...'];
        if (/insta|most ordered/.test(n)) {
            if (/follower|auto|last 5 posts|story/.test(n)) return ['Instagram PROFILE link (or @username)', 'https://www.instagram.com/username'];
            if (/view/.test(n)) return ['Instagram REEL or VIDEO link', 'https://www.instagram.com/reel/...'];
            return ['Instagram POST or REEL link', 'https://www.instagram.com/p/...'];
        }
        return null;
    }
    function campoLink() {
        var servizio = document.getElementById('orderform-service');
        var categoria = document.getElementById('orderform-category');
        var campo = document.querySelector('#order-form input[name$="[link]"]');
        var gruppo = campo && campo.closest('.form-group');
        var etichetta = gruppo && gruppo.querySelector('label');
        if (!servizio || !etichetta) return;
        var originale = etichetta.textContent;
        function aggiorna() {
            var s = servizio.options[servizio.selectedIndex], c = categoria && categoria.options[categoria.selectedIndex];
            var giusto = linkGiusto((s ? s.textContent : '') + ' ' + (c ? c.textContent : ''));
            etichetta.textContent = giusto ? giusto[0] : originale;
            campo.placeholder = giusto ? giusto[1] : '';
        }
        aggiorna();
        servizio.addEventListener('change', aggiorna);
        if (window.jQuery) window.jQuery(servizio).on('change', aggiorna);  // select2 avvisa solo via jQuery
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
        // il prezzo in fondo al nome (" - $4.455 per 1000") va su una riga sua, violetto, con 2 decimali (Mirko, 20 nov 2026 21:17)
        var PREZZO = /\s*-\s*([^\d\s]{0,4})\s?([\d.,]+)\s*(per\s+1000)\s*$/i;
        function prezzo(nodo) {
            if (!nodo || nodo.querySelector('.vg-price')) return;
            var giro = document.createTreeWalker(nodo, NodeFilter.SHOW_TEXT), t, ultimo = null;
            while ((t = giro.nextNode())) if (t.nodeValue.trim()) ultimo = t;
            var m = ultimo && ultimo.nodeValue.match(PREZZO);
            var cifra = m && parseFloat(m[2].replace(/,/g, ''));
            if (!m || isNaN(cifra)) return;
            ultimo.nodeValue = ultimo.nodeValue.replace(PREZZO, '');
            var due = cifra.toFixed(2);   // sotto il centesimo non si scrive $0.00
            nodo.appendChild(el('span', 'vg-price', m[1] + (+due || !cifra ? due : String(+cifra.toPrecision(1))) + ' ' + m[3]));
        }
        function aggiorna() {
            inCoda = false;
            var scelto = document.getElementById('select2-orderform-service-container');
            if (scelto) { metti(scelto, servizio.value); prezzo(scelto); }
            document.querySelectorAll('[id^="select2-orderform-service-result-"]').forEach(function (li) {
                var m = li.id.match(/-(\d+)$/);
                if (m) { metti(li, m[1], true); prezzo(li.firstElementChild || li); }
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
    // iniziale = piattaforma scelta all'apertura
    function barraPiattaforme(nomi, scegli, sotto, iniziale) {
        if (document.querySelector('.vg-plat')) return;
        var presenti = {};
        nomi.forEach(function (n) { presenti[piattaformaDi(n)] = true; });
        var voci = PIATTAFORME.concat([ALTRE]).filter(function (p) { return presenti[p.nome]; });
        // "All" in testa, poi Instagram, TikTok, YouTube, Facebook, Other (Mirko, 20 nov 2026)
        voci = [TUTTE].concat(voci);
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
        // si apre su All, come Services (Mirko, 20 nov 2026 21:30): una categoria gia' scelta resta scelta
        barraPiattaforme(tutte.map(function (o) { return o.textContent; }), function (nome) {
            var scelta = nome === TUTTE.nome ? tutte : tutte.filter(function (o) { return piattaformaDi(o.textContent) === nome; });
            var prima = categoria.value;
            categoria.textContent = '';
            scelta.forEach(function (o) { categoria.appendChild(o); });
            categoria.value = scelta.some(function (o) { return o.value === prima; }) ? prima : scelta[0].value;
            if (categoria.value !== prima) categoria.dispatchEvent(new Event('change', { bubbles: true }));
        }, false, TUTTE.nome);
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
        }, true, TUTTE.nome);
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
        if (!document.getElementById('sidenav-main')) {   // il menu c'e' solo da loggati: qui si e' usciti
            memoria('vg-avviso-visto', null);   // quadro dei servizi in New order (stato-servizi.js): di nuovo al login
            memoria('vg-bell-sess', null);
        }
        // New order compatto (il CSS stringe gli spazi solo su questa pagina)
        if (document.getElementById('order-form')) document.body.classList.add('vg-neworder');
        [titoloPagina, videoInCima, caricaCopertina, dal2020, secondoTitolo, pulsanteSignIn, animazioniPrima, faqCompatte, ordiniASchede, affiliatiASchede, oggettiTicket, pagineMinori, pulsantiCopia].forEach(function (f) {
            try { f(); } catch (e) { /* un ritocco che non riesce non deve fermare gli altri */ }
        });
        // Dopo gli script del pannello (i loro "ready" di jQuery, registrati prima di questo): New order e Services si
        // sistemano appena la pagina c'e', senza aspettare immagini e iframe (Mirko, 20 nov 2026 21:09: «lento a
        // caricare»). La campanella resta dopo il load: il tema riempie la sua lista dopo.
        function dopoIlPannello(fn) { if (window.jQuery) window.jQuery(function () { setTimeout(fn, 0); }); else setTimeout(fn, 0); }
        function lancia(lista) {
            lista.forEach(function (f) {
                try { f(0); } catch (e) { /* pagina lasciata com'era */ }
            });
        }
        dopoIlPannello(function () {
            lancia([descrizioneSottoIlTasto, campoLink, togliCategoriaIstruzioni, piattaformeNuovoOrdine, piattaformeServizi, finestraDescrizione, numeroServizio, pulsantiCopia, bottoneTicket]);
        });
        // le istruzioni di Add funds le scrive il tema dopo: Copy e "Open a ticket" si riprovano al load
        window.addEventListener('load', function () { setTimeout(function () { lancia([campanella, pulsantiCopia, bottoneTicket]); }, 300); });
        // Le istruzioni dei metodi di pagamento cambiano quando si sceglie un metodo diverso
        var metodo = document.getElementById('method');
        if (metodo) metodo.addEventListener('change', function () { setTimeout(function () { pulsantiCopia(); bottoneTicket(); }, 300); });
    });
})();
