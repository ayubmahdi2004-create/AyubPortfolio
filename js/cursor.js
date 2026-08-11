/* Custom orange circle cursor.
   - Follows the pointer with slight smoothing.
   - Shrinks while the mouse button is held down.
   - Morphs into a pill-shaped "VIEW ..." button over elements
     tagged with [data-cursor-text].
   Disabled automatically on touch / coarse-pointer devices via CSS
   (see .cursor { display:none } in the stylesheet's media query),
   so this script simply no-ops harmlessly there. */
(function () {
  var isCoarse = window.matchMedia('(hover: none), (max-width: 900px)').matches;

  var cursor = document.createElement('div');
  cursor.className = 'cursor';
  var label = document.createElement('span');
  label.className = 'cursor__label';
  cursor.appendChild(label);
  document.body.appendChild(cursor);

  var mouseX = -100, mouseY = -100, curX = -100, curY = -100;
  var hasMoved = false;

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!hasMoved) { curX = mouseX; curY = mouseY; hasMoved = true; }
  });

  function raf() {
    curX += (mouseX - curX) * 0.35;
    curY += (mouseY - curY) * 0.35;
    cursor.style.transform = 'translate3d(' + curX + 'px,' + curY + 'px,0)';
    requestAnimationFrame(raf);
  }
  if (!isCoarse) requestAnimationFrame(raf);

  window.addEventListener('mousedown', function () { cursor.classList.add('cursor--down'); });
  window.addEventListener('mouseup', function () { cursor.classList.remove('cursor--down'); });

  document.addEventListener('mouseover', function (e) {
    var target = e.target.closest('[data-cursor-text]');
    if (target) {
      label.textContent = target.getAttribute('data-cursor-text');
      cursor.classList.add('cursor--view');
    }
  });
  document.addEventListener('mouseout', function (e) {
    var target = e.target.closest('[data-cursor-text]');
    if (target) {
      cursor.classList.remove('cursor--view');
    }
  });
})();
