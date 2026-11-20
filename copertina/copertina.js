/* ViralGrow.io - copertina del video Vimeo in cima alla home (20 nov 2026).
   Si aggancia a .vg-hero-video .banner-video (dove restyle-2026.js ha spostato il video).
   Al tocco la copertina sparisce e il video parte con l'audio. Se qualcosa manca, non fa nulla. */
(function () {
    // Dove sta la foto: accanto a questo file. Se il codice finisce dentro js/restyle-2026.js,
    // mettere qui l'indirizzo pieno: .../viralgrow-assets@vX.Y/copertina/copertina-video.webp
    var script = document.currentScript;
    var IMMAGINE = script && script.src ? new URL('copertina-video.webp', script.src).href : 'copertina-video.webp';

    var NOTIFICHE = ['@urban.nomad liked your post', '@daily.bites started following you'];
    var fermo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function el(tag, className, text) {
        var e = document.createElement(tag);
        if (className) e.className = className;
        if (text) e.textContent = text;
        return e;
    }

    function formato(n) {
        return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : String(n);
    }

    // Il numero sale di 0.1K (100) ogni "ogni" giri da 650 ms: 120K, 120.1K, 120.2K...
    function contatore(etichetta, partenza, ogni) {
        var riga = el('div', 'vg-cover-stat');
        var numero = el('b', '', formato(partenza));
        riga.appendChild(document.createTextNode(etichetta + ' '));
        riga.appendChild(numero);
        return { riga: riga, valore: partenza, numero: numero, ogni: ogni };
    }

    function copertinaVideo() {
        var box = document.querySelector('.vg-hero-video .banner-video');
        var iframe = box && box.querySelector('iframe');
        if (!iframe || box.querySelector('.vg-cover')) return;

        var cover = el('div', 'vg-cover');
        cover.setAttribute('role', 'button');
        cover.setAttribute('tabindex', '0');
        cover.setAttribute('aria-label', 'Play video');

        var img = el('img', 'vg-cover-img');
        img.src = IMMAGINE;
        img.alt = '';
        img.decoding = 'async';
        cover.appendChild(img);

        var stats = el('div', 'vg-cover-stats');
        var like = contatore('♥ Likes', 1500, 1);
        var fan = contatore('Followers', 120000, 2);
        stats.appendChild(like.riga);
        stats.appendChild(fan.riga);
        cover.appendChild(stats);

        var note = el('div', 'vg-cover-notes');
        NOTIFICHE.forEach(function (t) {
            var n = el('div', 'vg-cover-note');
            var parti = t.split(' ');
            n.appendChild(el('i'));
            n.appendChild(document.createTextNode(parti.shift() + ' '));
            n.appendChild(el('span', '', '♥'));
            n.appendChild(document.createTextNode(' ' + parti.join(' ')));
            note.appendChild(n);
        });
        cover.appendChild(note);

        var cuori = el('div', 'vg-cover-hearts');
        cover.appendChild(cuori);

        var play = el('span', 'vg-cover-play');
        play.setAttribute('aria-hidden', 'true');
        cover.appendChild(play);

        box.appendChild(cover);

        var timer = null;
        if (!fermo) {
            var giro = 0;
            timer = setInterval(function () {
                giro++;
                [like, fan].forEach(function (c) {
                    if (giro % c.ogni) return;
                    c.valore += 100;
                    c.numero.textContent = formato(c.valore);
                });
                var cuore = el('span', 'vg-cover-heart', '♥');
                cuore.style.left = (58 + Math.random() * 18) + '%';
                cuore.style.setProperty('--dx', Math.round(Math.random() * 40 - 20) + 'px');
                cuore.addEventListener('animationend', function () { cuore.remove(); });
                cuori.appendChild(cuore);
            }, 650);
        }

        function avvia() {
            if (timer) clearInterval(timer);
            cover.remove();
            var allow = iframe.getAttribute('allow') || '';
            if (!/autoplay/.test(allow)) iframe.setAttribute('allow', (allow ? allow + '; ' : '') + 'autoplay; fullscreen');
            iframe.src = iframe.src + (iframe.src.indexOf('?') < 0 ? '?' : '&') + 'autoplay=1';
        }
        cover.addEventListener('click', avvia);
        cover.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); avvia(); }
        });
    }

    function pronto(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }
    // restyle-2026.js carica questo file solo quando il video e' gia' in cima: basta un tentativo
    // (un secondo tentativo a pagina caricata rimetteva la copertina sopra il video gia' partito)
    pronto(function () {
        try { copertinaVideo(); } catch (e) { /* senza copertina il video resta com'era */ }
    });
})();
