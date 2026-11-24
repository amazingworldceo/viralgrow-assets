/* Stato dei servizi sul sito (ADM-33, Mirko 20 nov 2026): il colore del riquadro #ID, lo stato del servizio scelto sotto
   Order now in New order, i 4 riquadri con i numeri e il "Live status" in Services. I colori li pubblica ogni mattina il
   job ViralGrow Admin (modulo stato_servizi) nel ramo `stato` del repo: {aggiornato, colori {id: 'y'|'r'}, nuovi [id]}.
   Un servizio che non e' nel file e' verde. Senza file (rete) la pagina resta com'era. File separato da restyle-2026.js:
   lo carica layout.twig, e con lo stesso tag carica stato-servizi.css. */
(function () {
    'use strict';
    var DATI = 'https://raw.githubusercontent.com/amazingworldceo/viralgrow-assets/stato/colori.json';
    var STATI = { g: 'Working well', y: 'Minor instability', r: 'Having issues now' };
    var MESI = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var dati = null;

    function el(tag, cls, testo) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (testo != null) e.textContent = testo;
        return e;
    }
    function stato(id) { return (dati.colori && dati.colori[id]) || 'g'; }
    function nuovo(id) { return (dati.nuovi || []).indexOf(String(id)) >= 0; }
    function classi(id) { return 'vg-st-' + stato(id) + (nuovo(id) ? ' vg-st-new' : ''); }
    // il riquadro in cui conta un servizio: un nuovo arancione o rosso conta nel suo colore
    function riquadro(id) { return nuovo(id) && stato(id) === 'g' ? 'new' : stato(id); }
    // la data di oggi nel fuso di chi guarda: cambia alla sua mezzanotte, non quando gira il job (Mirko, 21 nov 2026)
    function data() {
        var d = new Date();
        return d.getDate() + ' ' + MESI[d.getMonth()] + ' ' + d.getFullYear();
    }
    function live() {
        var l = el('span', 'vg-live');
        l.appendChild(el('i', 'vg-dot'));
        l.appendChild(document.createTextNode('Live status · updated ' + data()));
        return l;
    }

    // il riquadro #ID colorato, ovunque ci sia (New order: lo mette restyle-2026.js; Services: lo mettiamo noi)
    function coloraRiquadri() {
        document.querySelectorAll('.vg-sid').forEach(function (b) {
            var id = b.textContent.replace(/\D/g, '');
            var voluto = 'vg-sid ' + classi(id);
            if (id && b.className !== voluto) b.className = voluto;
        });
    }

    // Services: ID della tabella nel riquadro, 4 riquadri coi numeri della piattaforma scelta, Live status
    function righeServizi() {
        return Array.prototype.filter.call(document.querySelectorAll('.services-page tr[data-index]'), function (r) {
            var c = r.firstElementChild;
            return c && !c.classList.contains('service-title') && /^\s*\d+\s*$/.test(c.textContent);
        });
    }
    // i 4 riquadri coi numeri e il Live status; conta(ids) li riempie
    function quadro() {
        var blocco = el('div', 'vg-status-page'), griglia = el('div', 'vg-st-boxes'), caselle = {};
        [['new', 'New services'], ['g', STATI.g], ['y', STATI.y], ['r', STATI.r]].forEach(function (v) {
            var b = el('div', 'vg-st-box vg-st-' + (v[0] === 'new' ? 'g vg-st-new' : v[0]));
            b.setAttribute('data-k', v[0]);
            caselle[v[0]] = el('b', '', '0');
            b.appendChild(caselle[v[0]]);
            b.appendChild(el('span', '', v[1]));
            griglia.appendChild(b);
        });
        blocco.appendChild(griglia);
        blocco.appendChild(live());
        blocco.conta = function (ids) {
            var n = { new: 0, g: 0, y: 0, r: 0 };
            ids.forEach(function (id) { n[riquadro(id)]++; });
            Object.keys(n).forEach(function (k) { caselle[k].textContent = n[k]; });
        };
        return blocco;
    }
    function idDi(righe) { return righe.map(function (r) { return r.firstElementChild.textContent.trim(); }); }

    function servizi() {
        var righe = righeServizi();
        if (!righe.length) return;
        righe.forEach(function (r) {
            var c = r.firstElementChild, id = c.textContent.trim();
            c.textContent = '';
            c.appendChild(el('span', 'vg-sid', id));
        });
        var blocco = quadro();
        var barra = document.querySelector('.vg-plat'), ricerca = document.querySelector('.services-page .search-section');
        if (barra) barra.parentNode.insertBefore(blocco, barra.nextSibling);
        else if (ricerca) ricerca.parentNode.insertBefore(blocco, ricerca);
        else return;
        function conta() {   // solo la piattaforma scelta (le altre hanno vg-plat-off; fuori da My favorites: vg-fav-off)
            blocco.conta(idDi(righe.filter(function (r) { return !r.classList.contains('vg-plat-off') && !r.classList.contains('vg-fav-off'); })));
        }
        conta();
        new MutationObserver(conta).observe(righe[0].parentNode, { attributes: true, subtree: true, attributeFilter: ['class'] });

        // clic su un riquadro = sotto restano solo quei servizi; secondo clic = tutti (Mirko, 20 nov 2026 21:02).
        // Si somma al filtro della piattaforma; i titoli delle categorie rimaste vuote si nascondono.
        var titoli = Array.prototype.filter.call(document.querySelectorAll('.services-page tr[data-index]'), function (r) {
            return r.firstElementChild && r.firstElementChild.classList.contains('service-title');
        });
        var scelto = null;
        function filtra() {
            righe.forEach(function (r) { r.classList.toggle('vg-st-off', !!scelto && riquadro(idDi([r])[0]) !== scelto); });
            var piene = {};
            righe.forEach(function (r) { if (!r.classList.contains('vg-st-off')) piene[r.getAttribute('data-index')] = true; });
            titoli.forEach(function (t) { t.classList.toggle('vg-st-off', !piene[t.getAttribute('data-index')]); });
            blocco.classList.toggle('vg-st-filtro', !!scelto);
            blocco.querySelectorAll('.vg-st-box').forEach(function (b) { b.classList.toggle('vg-st-on', b.getAttribute('data-k') === scelto); });
        }
        blocco.classList.add('vg-st-clic');
        blocco.querySelectorAll('.vg-st-box').forEach(function (b) {
            b.setAttribute('role', 'button');
            b.tabIndex = 0;
            function scegli() { scelto = scelto === b.getAttribute('data-k') ? null : b.getAttribute('data-k'); filtra(); }
            b.addEventListener('click', scegli);
            b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scegli(); } });
        });
    }

    // New order: il quadro di TUTTI i servizi sopra il modulo, al primo New order dopo il login (Mirko, 20 nov 2026 20:48).
    // vg-avviso-visto lo azzera restyle-2026.js sulle pagine da non loggati. I servizi si contano dalla pagina Services.
    function quadroNuovoOrdine() {
        var modulo = document.getElementById('order-form');
        try {
            if (!modulo || localStorage.getItem('vg-avviso-visto') === '1') return;
            localStorage.setItem('vg-avviso-visto', '1');
        } catch (e) { return; }
        fetch('/services', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (html) {
            var pagina = new DOMParser().parseFromString(html, 'text/html');
            var ids = Array.prototype.map.call(pagina.querySelectorAll('.services-page tr[data-index] > td:first-child'),
                function (c) { return c.textContent.trim(); }).filter(function (t) { return /^\d+$/.test(t); });
            if (!ids.length) return;
            var blocco = quadro();
            blocco.classList.add('vg-status-welcome');
            blocco.insertBefore(el('p', 'vg-status-title', 'Service status'), blocco.firstChild);
            blocco.conta(ids);
            modulo.parentNode.insertBefore(blocco, modulo);
        }).catch(function () {});
    }

    // New order: una riga "● Live status · <data>: Working well" sotto Order now, prima delle avvertenze; senza #ID
    // (c'e' gia' sopra), senza legenda (Mirko, 23 nov 2026, 02:46; testo del 24 nov 2026). Si aspetta che restyle-2026.js abbia messo le
    // avvertenze (.vg-order-notes, max ~5 s): le mette subito dopo il tasto, e la riga deve stare tra le due
    function nuovoOrdine(giri) {
        var servizio = document.getElementById('orderform-service');
        var tasto = document.querySelector('#order-form button[type="submit"]');
        if (!servizio || !tasto) return;
        giri = giri || 0;
        if (!document.querySelector('.vg-order-notes') && giri < 25) return setTimeout(function () { nuovoOrdine(giri + 1); }, 200);
        var box = el('div', 'vg-status-line');
        tasto.parentNode.insertBefore(box, tasto.nextSibling);
        function aggiorna() {
            var id = servizio.value;
            box.textContent = '';
            if (!/^\d+$/.test(id || '')) { box.style.display = 'none'; return; }
            box.style.display = '';
            // una riga: pallino · "Live status · 24 Nov 2026:" · stato (Mirko, 24 nov 2026, 18:22)
            box.appendChild(el('i', 'vg-dot'));
            var t = el('span', '', 'Live status · ' + data() + ':');
            t.appendChild(el('b', 'vg-st-txt-' + stato(id), STATI[stato(id)]));
            box.appendChild(t);
        }
        aggiorna();
        servizio.addEventListener('change', aggiorna);
        if (window.jQuery) window.jQuery(servizio).on('change', aggiorna);   // select2 avvisa solo via jQuery
        setTimeout(aggiorna, 800);   // per un servizio che il pannello sceglie senza avvisare
    }

    function parti() {
        var mio = document.querySelector('script[src*="stato-servizi.js"]');
        if (mio) {
            var l = document.createElement('link');
            l.rel = 'stylesheet';
            l.href = mio.src.replace('/js/stato-servizi.js', '/css/stato-servizi.css');
            document.head.appendChild(l);
        }
        // ?v=ora: il browser lo tiene in cache per l'ora, cosi' ogni cambio di pagina non lo riscarica
        fetch(DATI + '?v=' + new Date().toISOString().slice(0, 13)).then(function (r) {
            return r.ok ? r.json() : null;
        }).then(function (d) {
            if (!d || !d.aggiornato) return;
            dati = d;
            // i quadratini e i riquadri #ID li costruisce restyle-2026.js: si aspetta che ci siano (max ~4 s)
            var giri = 0;
            (function prova() {
                var pronto = !document.querySelector('.services-page') || document.querySelector('.vg-plat') || giri > 20;
                if (!pronto) { giri++; return setTimeout(prova, 200); }
                servizi();
                nuovoOrdine();
                quadroNuovoOrdine();
                coloraRiquadri();
                var inCoda = false;
                new MutationObserver(function () {
                    if (!inCoda) { inCoda = true; requestAnimationFrame(function () { inCoda = false; coloraRiquadri(); }); }
                }).observe(document.body, { childList: true, subtree: true });
            })();
        }).catch(function () {});
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', parti);
    else parti();
})();
