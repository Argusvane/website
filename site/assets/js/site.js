// Argusvane site: the footer year, the phone menu and the "Copy address" button.
// No dependencies.
(function () {
  'use strict';

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Menu button (phones and tablets): opens and closes the header links.
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Close' : 'Menu';
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  var button = document.getElementById('copy');
  var address = document.getElementById('address');
  var status = document.getElementById('status');
  if (!button || !address || !status) return;

  // Fallback when the browser refuses clipboard access: select the address so
  // the visitor can copy it by hand.
  function selectAddress() {
    var range = document.createRange();
    range.selectNodeContents(address);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Address selected. Copy it with your keyboard.';
  }

  button.addEventListener('click', function () {
    var text = address.textContent.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        status.textContent = 'Copied.';
      }).catch(selectAddress);
    } else {
      selectAddress();
    }
  });
})();
