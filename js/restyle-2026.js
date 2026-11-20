/* ViralGrow.io - ritocchi del 20 nov 2026: pulsante Sign in e FAQ compatte */
(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function () {
        // 1. Sign in accanto a "Get Started Now!" nella prima schermata
        var login = document.querySelector('.main-landing-section form');
        if (login && !login.id) login.id = 'vg-login';
        var hero = document.querySelector('.main-banner-section .started-btn');
        if (hero && !hero.querySelector('.vg-signin-btn')) {
            var a = document.createElement('a');
            a.className = 'btn btn-primary vg-signin-btn';
            a.href = login ? '#vg-login' : '/';
            a.textContent = 'Sign in';
            hero.appendChild(a);
        }

        // 2. FAQ: 5 domande per gruppo, le altre con "Show all questions"
        var gruppi = document.querySelectorAll('.faq-section .accordion');
        for (var i = 0; i < gruppi.length; i++) {
            var carte = gruppi[i].querySelectorAll(':scope > .card');
            if (carte.length <= 5) continue;
            for (var j = 5; j < carte.length; j++) carte[j].classList.add('vg-faq-hidden');
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'vg-faq-more';
            b.textContent = 'Show all questions (' + carte.length + ')';
            b.addEventListener('click', function (gruppo, bottone) {
                return function () {
                    var nascoste = gruppo.querySelectorAll('.vg-faq-hidden');
                    for (var k = 0; k < nascoste.length; k++) nascoste[k].classList.remove('vg-faq-hidden');
                    bottone.remove();
                };
            }(gruppi[i], b));
            gruppi[i].appendChild(b);
        }
    });
})();
