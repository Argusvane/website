// Argusvane name page: the hundred eyes and the weathervane.
// Both are still pictures without this script, and stay still for visitors
// who ask for reduced motion.
(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // The eyes: every eye gets its own clock, so they rest in turn and are never
  // all closed at once. The orange eye is exempt (the stylesheet stops its
  // clock while it holds the colour), and every few seconds the colour passes
  // to another eye somewhere else in the grid.
  var field = document.getElementById('eyes');
  if (field) {
    var eyes = field.querySelectorAll('i');
    for (var i = 0; i < eyes.length; i++) {
      var length = 5 + Math.random() * 7;
      eyes[i].style.setProperty('--d', length.toFixed(2) + 's');
      eyes[i].style.setProperty('--o', (-Math.random() * length).toFixed(2) + 's');
    }
    field.classList.add('live');

    // Passing the watch, without a jump: the eye on watch and the eye about
    // to take over both close to a line. While they are shut the orange
    // changes hands, then both open again, one as a plain eye and one as the
    // watching eye.
    window.setInterval(function () {
      if (document.hidden) return;
      var kept = field.querySelector('i.kept');
      var next = eyes[Math.floor(Math.random() * eyes.length)];
      if (!kept || next === kept || next.classList.contains('wake')) return;
      kept.classList.add('shut');
      next.classList.add('shut');
      window.setTimeout(function () {
        kept.classList.remove('kept', 'shut');
        kept.classList.add('wake');
        next.classList.add('kept');
        window.setTimeout(function () { next.classList.remove('shut'); }, 80);
        window.setTimeout(function () {
          // Its own clock starts again from "open", so it does not snap shut.
          kept.style.setProperty('--o', '0s');
          kept.classList.remove('wake');
        }, 560);
      }, 520);
    }, 4200);
  }

  // The vane: every few seconds the wind shifts and the arrow swings to a new
  // heading, overshooting a little before it settles.
  var arrow = document.getElementById('vane-arrow');
  var readout = document.getElementById('heading');
  if (!arrow || !readout) return;

  var POINTS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  var heading = 45;

  function turn() {
    var shift = (25 + Math.random() * 85) * (Math.random() < 0.5 ? -1 : 1);
    heading += shift;
    arrow.style.transform = 'rotate(' + heading.toFixed(1) + 'deg)';
    var shown = Math.round(((heading % 360) + 360) % 360) % 360;
    var digits = ('00' + shown).slice(-3);
    readout.textContent = digits + '° ' + POINTS[Math.round(shown / 22.5) % 16];
  }

  window.setInterval(function () {
    if (!document.hidden) turn();
  }, 3400);
})();
