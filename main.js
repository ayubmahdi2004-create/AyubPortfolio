document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Resume PDF modal ---------- */
  var openers = document.querySelectorAll('[data-open-resume]');
  var overlay = document.querySelector('.modal-overlay');
  if (overlay) {
    var iframe = overlay.querySelector('iframe');
    var closeBtn = overlay.querySelector('.modal-close');
    var pdfSrc = overlay.getAttribute('data-pdf-src') || 'RESUME.pdf';

    function openModal(e) {
      if (e) e.preventDefault();
      iframe.src = pdfSrc;
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(function () { iframe.src = ''; }, 300);
    }
    openers.forEach(function (btn) { btn.addEventListener('click', openModal); });
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  }

  /* ---------- Project card hover -> swap image for looping video ---------- */
  document.querySelectorAll('.project-card').forEach(function (card) {
    var vid = card.querySelector('video.is-hover');
    if (!vid) return;
    var alwaysOn = vid.hasAttribute('data-always-loop');
    if (alwaysOn) {
      vid.play().catch(function () {});
      return;
    }
    card.addEventListener('mouseenter', function () {
      vid.currentTime = 0;
      vid.play().catch(function () {});
    });
    card.addEventListener('mouseleave', function () {
      vid.pause();
    });
  });

  /* Videos marked to always autoplay/loop regardless of hover (e.g. G1, case-study inline videos) */
  document.querySelectorAll('video[autoplay][loop]').forEach(function (v) {
    v.play().catch(function () {});
  });

  /* ---------- Sticky sidebar ScrollSpy ---------- */
  var sidebarLinks = document.querySelectorAll('.cs-sidebar a[href^="#"]');
  if (sidebarLinks.length) {
    var sections = [];
    sidebarLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if (sec) sections.push({ link: link, sec: sec });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var match = sections.find(function (s) { return s.sec === entry.target; });
        if (!match) return;
        if (entry.isIntersecting) {
          sidebarLinks.forEach(function (l) { l.classList.remove('active'); });
          match.link.classList.add('active');
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s.sec); });
    if (sections.length) sections[0].link.classList.add('active');
  }

});
