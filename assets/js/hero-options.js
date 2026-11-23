/* Hero options (preview only): reel pause control and the kinetic headline. */
(function () {
  "use strict";
  var root = document.documentElement;
  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  function reduced() { return root.getAttribute("data-motion") === "reduced" || mq.matches; }

  /* ---------- B. Work reel: a visible pause button (WCAG 2.2.2) ---------- */
  var reel = document.querySelector("[data-reel]");
  var toggle = document.querySelector("[data-reel-toggle]");
  if (reel && toggle) {
    toggle.addEventListener("click", function () {
      var paused = reel.classList.toggle("is-paused");
      toggle.setAttribute("aria-pressed", paused ? "true" : "false");
      toggle.querySelector("[data-reel-label]").textContent = paused ? "Play screens" : "Pause screens";
      toggle.querySelector("use").setAttribute("href", paused ? "#i-play" : "#i-pause");
    });
  }

  /* ---------- C. Kinetic type: letters near the pointer get wider, heavier, and warmer ---------- */
  var hero = document.querySelector("[data-kinetic]");
  if (!hero) return;
  var title = hero.querySelector(".kt");
  var chars = Array.prototype.slice.call(hero.querySelectorAll(".kt-ch"));
  var centers = [];
  var frame = 0, px = 0, py = 0, active = false;

  function measure() {
    var t = title.getBoundingClientRect();
    centers = chars.map(function (c) {
      var r = c.getBoundingClientRect();
      return [r.left - t.left + r.width / 2, r.top - t.top + r.height / 2];
    });
  }
  function clear() {
    chars.forEach(function (c) { c.style.setProperty("--p", 0); });
  }
  function paint() {
    frame = 0;
    var t = title.getBoundingClientRect();
    var x = px - t.left, y = py - t.top;
    var radius = parseFloat(getComputedStyle(title).fontSize) * 1.7;
    for (var i = 0; i < chars.length; i++) {
      var dx = centers[i][0] - x, dy = (centers[i][1] - y) * 1.4;
      var d = Math.sqrt(dx * dx + dy * dy);
      var p = Math.max(0, 1 - d / radius);
      chars[i].style.setProperty("--p", (p * p).toFixed(3));
    }
    var h = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", ((px - h.left) / h.width * 100).toFixed(1) + "%");
    hero.style.setProperty("--my", ((py - h.top) / h.height * 100).toFixed(1) + "%");
  }
  function onMove(e) {
    if (!active || e.pointerType === "touch") return;
    px = e.clientX; py = e.clientY;
    if (!frame) frame = requestAnimationFrame(paint);
  }
  function setActive() {
    active = !reduced() && window.matchMedia("(hover: hover)").matches;
    if (!active) clear();
  }

  setActive();
  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  /* The load animation changes letter widths, so measure again once it settles */
  setTimeout(measure, 2400);
  window.addEventListener("resize", measure);
  hero.addEventListener("pointermove", onMove);
  hero.addEventListener("pointerleave", clear);
  new MutationObserver(function () { setActive(); measure(); }).observe(root, { attributes: true, attributeFilter: ["data-motion", "data-text"] });
  if (mq.addEventListener) mq.addEventListener("change", setActive);
})();

/* ---------- F. Split-flap headline: flips through three words once, in under five seconds ---------- */
(function () {
  "use strict";
  var flap = document.querySelector("[data-flap]");
  if (!flap) return;
  var root = document.documentElement;
  if (root.getAttribute("data-motion") === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var cells = Array.prototype.slice.call(flap.querySelectorAll(".flap-cell"));
  var words = flap.getAttribute("data-flap").split("|");
  var pool = "abcdefghijklmnopqrstuvwxyzAEIOU";
  function pad(w) { while (w.length < cells.length) w += " "; return w.slice(0, cells.length); }
  function setChar(cell, ch) {
    var span = cell.firstElementChild;
    span.textContent = ch === " " ? "" : ch;
    cell.classList.remove("is-flipping");
    void cell.offsetWidth;
    cell.classList.add("is-flipping");
  }
  function flipTo(word) {
    var target = pad(word);
    cells.forEach(function (cell, i) {
      var current = cell.firstElementChild.textContent || " ";
      if (current === target[i]) return;
      var steps = 2 + (i % 3);
      for (var s = 0; s <= steps; s++) {
        (function (s) {
          setTimeout(function () {
            setChar(cell, s === steps ? target[i] : pool[Math.floor(Math.random() * pool.length)]);
          }, i * 32 + s * 55);
        })(s);
      }
    });
  }
  var t = 600;
  words.forEach(function (w) {
    setTimeout(function () { flipTo(w); }, t);
    t += 1450;
  });
})();
