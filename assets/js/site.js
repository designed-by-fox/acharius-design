/* Acharius Fox portfolio: small, dependency-free behaviors.
   Modes (theme, text size, motion) are stored per browser and applied to <html>.
   The inline script in each page's <head> applies them before first paint. */
(function () {
  "use strict";

  var root = document.documentElement;
  var KEYS = { theme: "fox-theme", text: "fox-text", motion: "fox-motion" };

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage can be unavailable */ }
  }

  /* ---------- Modes ---------- */
  function setMode(name, value, persist) {
    root.setAttribute("data-" + name, value);
    if (persist !== false) store(KEYS[name], value);
    syncControls();
    scheduleReadout();
    broadcast();
  }

  function syncControls() {
    ["theme", "text", "motion"].forEach(function (name) {
      var value = root.getAttribute("data-" + name);
      document.querySelectorAll('input[name="mode-' + name + '"]').forEach(function (input) {
        input.checked = input.value === value;
      });
    });
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      toggle.setAttribute("aria-label", "Switch to " + next + " theme");
    }
  }

  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t && t.name && t.name.indexOf("mode-") === 0) setMode(t.name.slice(5), t.value);
  });

  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      setMode("theme", root.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  }

  /* Live contrast readout in the hero, computed from the real rendered colors */
  function parseRGB(str) {
    var m = str.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var parts = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
    return parts.slice(0, 3);
  }
  function luminance(rgb) {
    var c = rgb.map(function (v) {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function ratio(a, b) {
    var la = luminance(a), lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }
  function grade(r, large) {
    if (r >= 7) return "AAA";
    if (r >= 4.5) return "AA";
    if (large && r >= 3) return "AA large";
    return "fails";
  }
  function updateReadout() {
    var out = document.querySelector("[data-readout]");
    if (!out) return;
    var bg = parseRGB(getComputedStyle(document.body).backgroundColor);
    var title = document.querySelector(".hero-title");
    var body = document.querySelector(".hero-body");
    var accent = document.querySelector(".status-dot");
    if (!bg || !title || !body) return;
    var rTitle = ratio(parseRGB(getComputedStyle(title).color), bg);
    var rBody = ratio(parseRGB(getComputedStyle(body).color), bg);
    var rAccent = accent ? ratio(parseRGB(getComputedStyle(accent).backgroundColor), bg) : null;
    var size = parseFloat(getComputedStyle(body).fontSize);
    var set = function (key, text) {
      var el = out.querySelector('[data-r="' + key + '"]');
      if (el) el.textContent = text;
    };
    set("title", rTitle.toFixed(1) + ":1 " + grade(rTitle, true));
    set("body", rBody.toFixed(1) + ":1 " + grade(rBody, false));
    if (rAccent) set("accent", rAccent.toFixed(1) + ":1 " + grade(rAccent, true));
    set("size", Math.round(size) + "px");
  }

  /* Colors animate between themes, so a ratio read mid-transition is wrong
     (it can briefly read as a fail). Show a checking state and measure once
     the last change has settled. */
  var readoutTimer;
  function scheduleReadout() {
    var out = document.querySelector("[data-readout]");
    if (!out) return;
    out.classList.add("is-checking");
    out.setAttribute("aria-busy", "true");
    clearTimeout(readoutTimer);
    readoutTimer = setTimeout(function () {
      updateReadout();
      out.classList.remove("is-checking");
      out.setAttribute("aria-busy", "false");
    }, 450);
  }

  /* Let embedded demos follow the site's modes */
  function broadcast() {
    document.querySelectorAll("iframe[data-follow-modes]").forEach(function (f) {
      try {
        f.contentWindow.postMessage({ type: "fox-modes", theme: root.getAttribute("data-theme"), text: root.getAttribute("data-text"), motion: root.getAttribute("data-motion") }, "*");
      } catch (e) {}
    });
  }
  window.addEventListener("message", function (e) {
    var d = e.data || {};
    if (d.type === "fox-demo-height") {
      document.querySelectorAll("iframe[data-follow-modes]").forEach(function (f) {
        if (f.contentWindow === e.source) f.style.height = Math.ceil(d.height) + "px";
      });
    }
    if (d.type === "fox-demo-ready") broadcast();
  });

  /* ---------- Header ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var menuBtn = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    var closeMenu = function (focusBtn) {
      nav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open menu");
      if (focusBtn) menuBtn.focus();
    };
    menuBtn.addEventListener("click", function () {
      var open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) { var first = nav.querySelector("a"); if (first) first.focus(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) closeMenu(true);
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 760) closeMenu(false); });
  }

  /* ---------- Copy email ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      var status = document.getElementById(btn.getAttribute("aria-describedby") || "");
      var done = function (msg) { if (status) status.textContent = msg; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function () { done("Copied " + value + " to your clipboard."); }, function () { done("Couldn't copy. The address is " + value + "."); });
      } else {
        done("Couldn't copy. The address is " + value + ".");
      }
    });
  });

  /* ---------- Table of contents: mark the section in view ---------- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var current = null;
      tocLinks.forEach(function (a) { var id = a.getAttribute("href").slice(1); if (!current && visible[id]) current = id; });
      if (current) tocLinks.forEach(function (a) {
        if (a.getAttribute("href").slice(1) === current) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-20% 0px -60% 0px" });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Animated GIFs: pausable (WCAG 2.2.2) ---------- */
  var ICON_PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  var ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';
  document.querySelectorAll(".gif").forEach(function (wrap) {
    var img = wrap.querySelector("img");
    var btn = wrap.querySelector(".gif-toggle");
    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    wrap.insertBefore(canvas, img);
    var label = wrap.getAttribute("data-label") || "animation";
    function snapshot() {
      try {
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0);
      } catch (e) {}
    }
    function setPaused(p) {
      if (p && img.complete && img.naturalWidth) snapshot();
      wrap.classList.toggle("is-paused", p);
      btn.innerHTML = (p ? ICON_PLAY : ICON_PAUSE) + "<span>" + (p ? "Play" : "Pause") + '<span class="visually-hidden"> ' + label + "</span></span>";
      btn.setAttribute("aria-pressed", String(!p));
    }
    btn.addEventListener("click", function () { setPaused(!wrap.classList.contains("is-paused")); });
    /* Once the image arrives, capture a still frame if the visitor (or reduced motion) has it paused */
    img.addEventListener("load", function () { if (wrap.classList.contains("is-paused")) snapshot(); });
    setPaused(root.getAttribute("data-motion") === "reduced");
  });

  /* ---------- Lightbox (native <dialog>) ---------- */
  var dialog = document.getElementById("lightbox");
  if (dialog && typeof dialog.showModal === "function") {
    var dImg = dialog.querySelector("img");
    var dCap = dialog.querySelector("[data-lightbox-caption]");
    var lastTrigger = null;
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-lightbox]");
      if (!trigger) return;
      var src = trigger.getAttribute("data-lightbox");
      var source = trigger.querySelector("img") || document.getElementById(trigger.getAttribute("data-img"));
      lastTrigger = trigger;
      dImg.src = src;
      var full = dialog.querySelector("[data-lightbox-full]");
      if (full) full.href = src;
      dImg.alt = source ? source.alt : "";
      dCap.textContent = trigger.getAttribute("data-caption") || (source ? source.alt : "");
      dialog.showModal();
    });
    dialog.querySelector("[data-close]").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", function () { dImg.removeAttribute("src"); if (lastTrigger) lastTrigger.focus(); });
  } else if (dialog) {
    /* No <dialog> support: fall back to opening the image directly */
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-lightbox]");
      if (trigger) window.open(trigger.getAttribute("data-lightbox"), "_blank", "noopener");
    });
  }

  /* ---------- Modes panel starts collapsed on small screens so the work stays in view ---------- */
  var modesPanel = document.querySelector("[data-modes]");
  if (modesPanel && window.matchMedia("(max-width: 760px)").matches) modesPanel.removeAttribute("open");

  /* ---------- Review mode for drafted copy ---------- */
  if (/[?&]review\b/.test(location.search)) root.classList.add("review");

  syncControls();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateReadout); else updateReadout();
  window.addEventListener("resize", updateReadout);
})();
