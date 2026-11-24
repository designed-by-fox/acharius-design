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

/* ---------- Fox options (J to M) ---------- */
(function () {
  "use strict";
  var root = document.documentElement;
  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  function calm() { return root.getAttribute("data-motion") === "reduced" || mq.matches; }
  function say(el, text, ms) {
    if (!el) return;
    el.textContent = text;
    el.classList.add("is-on");
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove("is-on"); }, ms || 2600);
  }

  /* Eyes follow the pointer (decorative, off when motion is reduced) */
  var lookers = Array.prototype.slice.call(document.querySelectorAll(".fox-follow"));
  var frame = 0, px = 0, py = 0;
  function look() {
    frame = 0;
    lookers.forEach(function (svg) {
      var r = svg.getBoundingClientRect();
      if (!r.width) return;
      var ex = r.left + r.width * 0.5, ey = r.top + r.width * 0.53;
      var dx = px - ex, dy = py - ey, d = Math.sqrt(dx * dx + dy * dy) || 1;
      var m = Math.min(1, d / 260) * 4.5;
      svg.style.setProperty("--ex", (dx / d * m).toFixed(2) + "px");
      svg.style.setProperty("--ey", (dy / d * m * 0.8).toFixed(2) + "px");
    });
  }
  if (lookers.length) {
    window.addEventListener("pointermove", function (e) {
      if (calm() || e.pointerType === "touch") return;
      px = e.clientX; py = e.clientY;
      if (!frame) frame = requestAnimationFrame(look);
    }, { passive: true });
  }

  /* J. Peekaboo */
  var spot = document.querySelector(".peek-spot");
  if (spot) {
    var btn = spot.querySelector("[data-peek]");
    var bubble = spot.querySelector("[data-peek-says]");
    var lines = ["Oh, hi!", "The case studies are just below.", "I'm the fox in Acharius Fox.", "Thanks for stopping by."];
    var n = 0, upTimer;
    setTimeout(function () { spot.classList.add("is-peeking"); }, calm() ? 0 : 900);
    btn.addEventListener("click", function () {
      spot.classList.add("is-up");
      say(bubble, lines[n++ % lines.length], 2800);
      clearTimeout(upTimer);
      upTimer = setTimeout(function () { spot.classList.remove("is-up"); }, 2800);
    });
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var r = btn.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      spot.classList.toggle("is-curious", Math.sqrt(dx * dx + dy * dy) < 240);
    }, { passive: true });
  }

  /* K. Nap: wakes on hover or tap, dozes off again after you leave */
  var nap = document.querySelector("[data-nap]");
  if (nap) {
    var sleepTimer;
    function wake() { clearTimeout(sleepTimer); nap.classList.add("is-awake"); }
    function doze(ms) { clearTimeout(sleepTimer); sleepTimer = setTimeout(function () { nap.classList.remove("is-awake"); }, ms); }
    nap.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") wake(); });
    nap.addEventListener("pointerleave", function (e) { if (e.pointerType !== "touch") doze(1400); });
    nap.addEventListener("click", function () { wake(); doze(3000); });
  }

  /* L. Mode buddy: says something when a mode changes */
  var buddy = document.querySelector("[data-fox-says]");
  if (buddy) {
    var last = {
      theme: root.getAttribute("data-theme"),
      text: root.getAttribute("data-text"),
      motion: root.getAttribute("data-motion")
    };
    var quips = {
      theme: { light: "Sunglasses on.", dark: "Ahh, back to the dark." },
      text: { large: "Ooh, easier to read.", "default": "Back to regular size." },
      motion: { reduced: "Taking it slow.", on: "Wide awake again." }
    };
    new MutationObserver(function () {
      ["theme", "text", "motion"].forEach(function (k) {
        var v = root.getAttribute("data-" + k);
        if (v !== last[k]) { last[k] = v; if (quips[k][v]) say(buddy, quips[k][v], 2400); }
      });
    }).observe(root, { attributes: true, attributeFilter: ["data-theme", "data-text", "data-motion"] });
  }
})();
