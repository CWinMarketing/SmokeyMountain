document.addEventListener('DOMContentLoaded', function () {
  var hamburger = document.getElementById('hamburger');
  var navPill = document.getElementById('navPill');
  if (!hamburger || !navPill) return;

  hamburger.addEventListener('click', function () {
    var open = navPill.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});
