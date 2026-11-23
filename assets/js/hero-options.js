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
