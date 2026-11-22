/* Таксимания — демо-макет. Все формы локальные: данные никуда не отправляются. */
(() => {
  "use strict";
  window.__taxiReady = true;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CARS = window.TAXI_CARS || [];
  const CLASSES = window.TAXI_CLASSES || {};
  const byId = id => CARS.find(c => c.id === id);
  const money = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const plural = (n, f) => f[(n % 10 === 1 && n % 100 !== 11) ? 0 : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 1 : 2];

  /* ---------- Scroll-driven bits (single rAF loop) ---------- */
  const scrollHandlers = [];
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; scrollHandlers.forEach(fn => fn()); });
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);

  const plansFor = window.TAXI_PLANS;

  function bestOffer(tariff, format) {
    let best = null;
    for (const car of CARS.filter(item => item.cls === tariff)) {
      for (const plan of plansFor(car)) {
        if (plan.format === format && (!best || plan.daily < best.plan.daily)) best = { car, plan };
      }
    }
    return best;
  }

  function earnings(tariff, plan, days, hours) {
    const gross = CLASSES[tariff].hour * hours * days;
    const weekly = plan.daily * 7;
    const nextWeek = (plan.laterDaily || plan.daily) * 7;
    return { gross, weekly, net: gross - weekly, month: gross * 4.3 - weekly - nextWeek * 3.3 };
  }

  function setRangeFill(range) {
    range.style.setProperty("--p", `${(range.value - range.min) / (range.max - range.min) * 100}%`);
  }

  function fillModels(select, candidates, selected = "", fixed = false) {
    select.replaceChildren();
    if (!fixed) select.add(new Option("Пока не выбрал — нужна консультация", ""));
    for (const [key, tariff] of Object.entries(CLASSES)) {
      const group = document.createElement("optgroup");
      group.label = tariff.name;
      candidates.filter(car => car.cls === key).forEach(car => group.append(new Option(car.name, car.id)));
      if (group.children.length) select.append(group);
    }
    if (candidates.some(car => car.id === selected)) select.value = selected;
  }


  /* ---------- Mega menu ---------- */
  $$("[data-mega]").forEach(item => {
    const trigger = $("[data-mega-trigger]", item);
    let timer;
    const set = v => { item.classList.toggle("is-open", v); trigger && trigger.setAttribute("aria-expanded", String(v)); };
    const canHover = () => matchMedia("(hover: hover)").matches;
    item.addEventListener("mouseenter", () => { if (!canHover()) return; clearTimeout(timer); set(true); });
    item.addEventListener("mouseleave", () => { timer = setTimeout(() => set(false), 180); });
    item.addEventListener("focusin", () => set(true));
    item.addEventListener("focusout", e => { if (!item.contains(e.relatedTarget)) set(false); });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && item.classList.contains("is-open")) { set(false); trigger && trigger.focus(); }
    });
  });

  /* ---------- Mobile menu ---------- */
  const burger = $(".burger");
  const mobile = $("#mobile-menu");
  const setMenu = (open, returnFocus = true) => {
    if (!mobile) return;
    mobile.classList.toggle("is-open", open);
    mobile.setAttribute("aria-hidden", String(!open));
    burger && burger.setAttribute("aria-expanded", String(open));
    root.classList.toggle("lock", open);
    if (open) setTimeout(() => { const f = $("[data-menu-close]", mobile); f && f.focus(); }, 60);
    else if (returnFocus && burger) burger.focus();
  };
  burger && burger.addEventListener("click", () => setMenu(true));
  if (mobile) {
    mobile.addEventListener("click", e => {
      if (e.target.closest("[data-menu-close]")) setMenu(false);
      else if (e.target.closest("a[href]")) setMenu(false, false);
    });
    mobile.addEventListener("keydown", e => {
      if (e.key === "Escape") setMenu(false);
      if (e.key !== "Tab") return;
      const f = $$("a[href], button:not([disabled])", mobile);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    matchMedia("(min-width: 1141px)").addEventListener("change", e => { if (e.matches && mobile.classList.contains("is-open")) setMenu(false, false); });
  }

  /* ---------- Inline films ---------- */
  function setupLoop(video) {
    const canAnimate = matchMedia("(prefers-reduced-motion: no-preference)");
    const mobileFilm = matchMedia("(max-width: 760px)");
    const portraitFilm = video.dataset.portraitSrc && matchMedia("(max-aspect-ratio: 3/4)");
    let inView = !("IntersectionObserver" in window);

    function syncLoop() {
      const autoplay = canAnimate.matches && !navigator.connection?.saveData;
      if (!autoplay) video.classList.remove("is-ready");
      if (document.hidden || !inView || !autoplay) {
        video.pause();
        return;
      }
      let source = video.dataset.src;
      if (mobileFilm.matches && video.dataset.mobileSrc) source = video.dataset.mobileSrc;
      if (portraitFilm?.matches) source = video.dataset.portraitSrc;
      if (video.getAttribute("src") !== source) {
        video.classList.remove("is-ready");
        video.src = source;
      }
      video.play().catch(() => { /* The cover stays visible if autoplay is unavailable. */ });
    }

    video.addEventListener("playing", () => video.classList.add("is-ready"));
    video.addEventListener("error", () => video.classList.remove("is-ready"));
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncLoop();
      }).observe(video.parentElement);
    }
    canAnimate.addEventListener("change", syncLoop);
    mobileFilm.addEventListener("change", syncLoop);
    portraitFilm?.addEventListener("change", syncLoop);
    navigator.connection?.addEventListener("change", syncLoop);
    document.addEventListener("visibilitychange", syncLoop);
    syncLoop();
  }
  const heroLoop = $("[data-hero-loop]");
  if (heroLoop) setupLoop(heroLoop);

  /* ---------- Dialog: sections and enquiries ---------- */
  const dlg = $("#dlg");
  let opener = null;

  function showPanel(name) {
    $$("[data-panel]", dlg).forEach(p => { p.hidden = p.dataset.panel !== name; });
    const title = $(`[data-panel="${name}"] [data-title]`, dlg);
    dlg.scrollTop = 0;
    if (title) { dlg.setAttribute("aria-label", title.textContent); title.focus({ preventScroll: true }); }
  }

  function openDialog(trigger, panel) {
    if (!dlg) return;
    if (!dlg.open) {
      opener = trigger;
      dlg.showModal();
      root.classList.add("lock");
    }
    showPanel(panel);
  }

  function resetForms(scope) {
    $$("form[data-demo-form]", scope).forEach(f => {
      f.reset(); f.hidden = false;
      $$("[aria-invalid]", f).forEach(el => el.removeAttribute("aria-invalid"));
      const box = f.closest("[data-form-box]");
      const ok = box && $("[data-success]", box);
      if (ok) ok.hidden = true;
    });
  }

  function setupSection(trigger) {
    const name = (trigger.dataset.section || trigger.textContent).trim();
    $("[data-section-title]", dlg).textContent = name;
    $("[data-section-text]", dlg).textContent =
      `Раздел «${name}» не входит в демо-макет. Он будет разработан на следующем этапе проекта вместе с остальными страницами сайта.`;
  }

  let enquiryTrigger;
  function syncEnquiry() {
    const panel = $('[data-panel="enquiry"]', dlg);
    const form = $("form", panel);
    const select = form.elements.model;
    const fixedCar = byId(enquiryTrigger.dataset.car);
    const tariff = enquiryTrigger.dataset.tariff || fixedCar?.cls || "";
    const pool = fixedCar ? [fixedCar] : CARS.filter(car => !tariff || car.cls === tariff);
    const radios = $$("input[name=format]", form);
    radios.forEach(r => { r.disabled = !pool.some(car => plansFor(car).some(plan => plan.format === r.value)); });
    if (!radios.some(r => r.checked && !r.disabled)) radios.find(r => !r.disabled).checked = true;
    const format = form.elements.format.value;
    const allowed = pool.filter(car => plansFor(car).some(plan => plan.format === format));
    fillModels(select, allowed, fixedCar?.id || select.value, Boolean(fixedCar));
    const car = byId(select.value);
    const plans = car ? plansFor(car).filter(p => p.format === format) : [];
    const plan = plans.find(p => p.key === enquiryTrigger.dataset.plan) || plans[0];
    form.elements.tariff.value = tariff || car?.cls || "";
    form.elements.schedule.value = enquiryTrigger.dataset.schedule || "";
    form.elements.plan.value = plan?.key || "";
    const cls = CLASSES[form.elements.tariff.value];
    const heading = $("[data-title]", panel);
    if (car) heading.textContent = format === "rent" ? "Заявка на аренду" : "Заявка на выкуп";
    else if (cls) heading.textContent = `Заявка на тариф «${cls.name}»`;
    else heading.textContent = enquiryTrigger.dataset.heading || "Оставить заявку";
    dlg.setAttribute("aria-label", heading.textContent);

    const context = $("[data-context]", panel);
    context.replaceChildren();
    context.hidden = !cls && !car && !form.elements.schedule.value;
    if (context.hidden) return;
    if (car) {
      const photo = new Image();
      photo.src = car.img[0]; photo.alt = "";
      context.append(photo);
    }
    const box = document.createElement("div");
    const name = document.createElement("b");
    name.textContent = car ? car.name : `Тариф «${cls.name}»`;
    const details = document.createElement("span");
    details.textContent = [car && cls?.name, plan && `${plan.label} · ${money(plan.daily)} ₽/сутки`, form.elements.schedule.value].filter(Boolean).join(" · ");
    box.append(name, details);
    context.append(box);
  }

  function setupEnquiry(trigger) {
    const panel = $('[data-panel="enquiry"]', dlg);
    resetForms(panel);
    enquiryTrigger = trigger;
    const car = byId(trigger.dataset.car);
    const format = trigger.dataset.format || (car && !car.rent ? "buyout" : "rent");
    $("select[name=model]", panel).value = "";
    $(`input[name=format][value="${format}"]`, panel).checked = true;
    syncEnquiry();
  }

  const gallery = $("[data-model-gallery]");
  if (gallery) {
    const car = byId(gallery.dataset.modelGallery);
    const thumbs = $$("[data-thumb]", gallery);
    const photo = $("[data-gallery-photo]", gallery);
    let index = 0;
    const show = next => {
      index = (next + thumbs.length) % thumbs.length;
      photo.src = car.img[index];
      photo.alt = `${car.name} — фото ${index + 1} из ${car.img.length}`;
      thumbs.forEach((thumb, i) => thumb.setAttribute("aria-current", String(i === index)));
    };
    gallery.addEventListener("click", e => {
      const thumb = e.target.closest("[data-thumb]");
      const nav = e.target.closest("[data-gal]");
      if (thumb) show(thumbs.indexOf(thumb));
      else if (nav) show(index + (nav.dataset.gal === "next" ? 1 : -1));
    });
    gallery.addEventListener("keydown", e => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault();
      show(index + (e.key === "ArrowRight" ? 1 : -1));
      thumbs[index].focus();
    });
  }


  if (dlg) {
    document.addEventListener("click", e => {
      const sec = e.target.closest("[data-section]");
      if (sec) {
        e.preventDefault();
        if (mobile && mobile.classList.contains("is-open")) setMenu(false, false);
        setupSection(sec); openDialog(sec, "section"); return;
      }
      const enq = e.target.closest("[data-enquiry]");
      if (enq) {
        e.preventDefault();
        const inMenu = mobile?.classList.contains("is-open");
        if (inMenu) setMenu(false, false);
        setupEnquiry(enq);
        openDialog(inMenu ? burger : enq, "enquiry");
      }
    });
    dlg.addEventListener("click", e => {
      if (e.target === dlg || e.target.closest("[data-close]")) dlg.close();
    });
    dlg.addEventListener("change", e => {
      if (e.target.matches('input[name="format"], select[name="model"]')) syncEnquiry();
    });
    dlg.addEventListener("close", () => {
      root.classList.remove("lock");
      resetForms(dlg);
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      opener = null;
    });
    dlg.addEventListener("keydown", e => {
      if (e.key !== "Tab") return;
      const fields = $$('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea, [tabindex]:not([tabindex="-1"])', dlg)
        .filter(el => el.getClientRects().length && !el.closest("[hidden]"));
      if (!fields.length) return;
      const first = fields[0], last = fields[fields.length - 1];
      if (e.shiftKey && (document.activeElement === first || !dlg.contains(document.activeElement) || document.activeElement.matches("[data-title]"))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- Forms (local only) ---------- */
  function maskPhone(v) {
    let d = v.replace(/\D/g, "");
    if (!d) return "";
    if (d[0] === "8") d = "7" + d.slice(1);
    if (d[0] !== "7") d = "7" + d;
    d = d.slice(0, 11);
    let r = "+7";
    if (d.length > 1) r += " (" + d.slice(1, 4);
    if (d.length >= 4) r += ")";
    if (d.length > 4) r += " " + d.slice(4, 7);
    if (d.length > 7) r += "-" + d.slice(7, 9);
    if (d.length > 9) r += "-" + d.slice(9, 11);
    return r;
  }
  document.addEventListener("input", e => {
    const el = e.target;
    if (el.matches("input[type=tel]") && !(e.inputType || "").startsWith("delete")) el.value = maskPhone(el.value);
    if (el.hasAttribute("aria-invalid")) el.removeAttribute("aria-invalid");
  });
  document.addEventListener("change", e => { if (e.target.hasAttribute("aria-invalid")) e.target.removeAttribute("aria-invalid"); });

  function validate(form) {
    let firstBad = null;
    $$("[required]", form).forEach(el => {
      let ok = true;
      if (el.type === "checkbox") ok = el.checked;
      else if (el.type === "tel") ok = el.value.replace(/\D/g, "").length === 11;
      else ok = el.value.trim().length >= 2;
      if (ok) el.removeAttribute("aria-invalid");
      else { el.setAttribute("aria-invalid", "true"); firstBad = firstBad || el; }
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }
  document.addEventListener("submit", e => {
    const form = e.target.closest("form[data-demo-form]");
    if (!form) return;
    e.preventDefault();
    if (!validate(form)) return;
    const box = form.closest("[data-form-box]");
    const ok = box && $("[data-success]", box);
    form.reset();
    if (ok) {
      form.hidden = true; ok.hidden = false;
      const t = $("[data-success-title]", ok); t && t.focus({ preventScroll: true });
    }
  });
  document.addEventListener("click", e => {
    const again = e.target.closest("[data-form-again]");
    if (!again) return;
    const box = again.closest("[data-form-box]");
    $("[data-success]", box).hidden = true;
    const f = $("form", box); f.hidden = false; $("input", f).focus();
  });
  $$("form[data-demo-form]").filter(form => !dlg?.contains(form)).forEach(form => {
    const select = form.elements.model;
    const refresh = () => fillModels(select, CARS.filter(car =>
      plansFor(car).some(plan => plan.format === form.elements.format.value)), select.value);
    form.addEventListener("change", e => { if (e.target.name === "format") refresh(); });
    form.addEventListener("reset", () => queueMicrotask(refresh));
    refresh();
  });

  /* ---------- Split headings into words ---------- */
  function splitWords(el) {
    let wi = 0;
    const walk = node => {
      Array.from(node.childNodes).forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(" "); return; }
            const w = document.createElement("span"); w.className = "w";
            const s = document.createElement("span"); s.textContent = part; s.style.setProperty("--wi", wi++);
            w.append(s); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
  }
  if (!reduce) $$("[data-split]").forEach(splitWords);

  /* ---------- Stagger groups ---------- */
  $$("[data-stagger]").forEach(g => {
    const step = +(g.dataset.step || 90);
    Array.from(g.children).forEach((c, i) => {
      if (!c.hasAttribute("data-reveal")) c.setAttribute("data-reveal", g.dataset.stagger || "");
      c.style.setProperty("--d", i * step);
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$("[data-reveal], [data-split]");
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
    revealEls.forEach(el => { if (el.hasAttribute("data-split-now")) setTimeout(() => el.classList.add("is-in"), 250); else io.observe(el); });
  } else revealEls.forEach(el => el.classList.add("is-in"));

  /* ---------- Count-up numbers ---------- */
  const counters = $$("[data-count]");
  if (!reduce && "IntersectionObserver" in window) {
    const fmtNum = (v, dec) => dec ? v.toFixed(dec).replace(".", ",") : money(v);
    const cio = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        const el = en.target, end = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0);
        const t0 = performance.now(), dur = 1600;
        const tick = now => {
          const p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(2, -10 * p);
          el.textContent = fmtNum(p === 1 ? end : end * e, dec);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: .4 });
    counters.forEach(el => { el.textContent = "0"; cio.observe(el); });
  }

  /* ---------- Parallax ---------- */
  const pEls = reduce ? [] : $$("[data-parallax]");
  if (pEls.length) scrollHandlers.push(() => {
    const vh = innerHeight;
    pEls.forEach(el => {
      const host = el.parentElement.getBoundingClientRect();
      if (host.bottom < -200 || host.top > vh + 200) return;
      const speed = parseFloat(el.dataset.parallax) || .15;
      const offset = (host.top + host.height / 2 - vh / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(${el.dataset.scale || 1.15})`;
    });
  });

  /* ---------- Sliders ---------- */
  $$("[data-slider]").forEach(sl => {
    const track = $(".slider__track", sl);
    const prev = $("[data-prev]", sl), next = $("[data-next]", sl), bar = $(".slider__progress i", sl);
    if (!track) return;
    const step = () => { const it = track.children[0]; return it ? it.getBoundingClientRect().width + 16 : 320; };
    prev && prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: reduce ? "auto" : "smooth" }));
    next && next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: reduce ? "auto" : "smooth" }));
    const upd = () => {
      const max = track.scrollWidth - track.clientWidth;
      const vis = track.clientWidth / track.scrollWidth;
      const p = max > 0 ? track.scrollLeft / max : 0;
      if (bar) { bar.style.width = `${vis * 100}%`; bar.style.transform = `translateX(${p * (1 / vis - 1) * 100}%)`; }
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
    };
    track.addEventListener("scroll", upd, { passive: true });
    addEventListener("resize", upd); upd();
    // drag to scroll with mouse
    let down = false, sx = 0, sl0 = 0, moved = false;
    track.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl0 = track.scrollLeft; });
    addEventListener("pointermove", e => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 5) { moved = true; track.style.scrollSnapType = "none"; track.scrollLeft = sl0 - dx; }
    });
    addEventListener("pointerup", () => { if (!down) return; down = false; track.style.scrollSnapType = ""; });
    track.addEventListener("click", e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    track.addEventListener("dragstart", e => e.preventDefault());
  });

  /* ---------- Card hover galleries ---------- */
  function bindCardGallery(card) {
    const media = $(".car-card__media", card);
    const imgs = media ? $$("img", media) : [];
    const dots = media ? $$(".car-card__dots i", media) : [];
    if (imgs.length < 2) return;
    let cur = 0;
    const set = i => {
      if (i === cur) return;
      imgs[cur].classList.remove("is-active"); dots[cur] && dots[cur].classList.remove("is-active");
      cur = i;
      if (imgs[cur].loading === "lazy") imgs[cur].loading = "eager";
      imgs[cur].classList.add("is-active"); dots[cur] && dots[cur].classList.add("is-active");
    };
    card.addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      const r = media.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      set(clamp(Math.floor((e.clientX - r.left) / r.width * imgs.length), 0, imgs.length - 1));
    });
    card.addEventListener("pointerleave", () => set(0));
  }
  $$(".car-card").forEach(bindCardGallery);

  /* ---------- FAQ smooth accordion ---------- */
  $$(".faq details").forEach(d => {
    const s = $("summary", d), body = $(".faq__body", d);
    if (!s || !body || reduce || !body.animate) return;
    let anim = null;
    s.addEventListener("click", e => {
      e.preventDefault();
      if (anim) anim.cancel();
      if (d.open) {
        anim = body.animate({ height: [`${body.offsetHeight}px`, "0px"], opacity: [1, 0] }, { duration: 380, easing: "cubic-bezier(.22,.8,.2,1)" });
        anim.onfinish = () => { d.open = false; anim = null; };
      } else {
        d.open = true;
        anim = body.animate({ height: ["0px", `${body.offsetHeight}px`], opacity: [0, 1] }, { duration: 480, easing: "cubic-bezier(.16,1,.3,1)" });
        anim.onfinish = () => { anim = null; };
      }
    });
  });

  /* ---------- SEO text expand ---------- */
  $$("[data-seo-toggle]").forEach(btn => {
    const clip = document.getElementById(btn.getAttribute("aria-controls"));
    if (!clip) return;
    btn.addEventListener("click", () => {
      const open = !clip.classList.contains("is-open");
      clip.classList.toggle("is-open", open);
      clip.style.maxHeight = open ? `${clip.scrollHeight + 40}px` : "";
      btn.setAttribute("aria-expanded", String(open));
      $("[data-label]", btn).textContent = open ? "Свернуть" : "Читать полностью";
    });
  });

  /* ---------- Калькулятор дохода ---------- */
  const calc = $("[data-calc]");
  if (calc) {
    const car = byId(calc.dataset.model);
    const choice = $("[data-calc-plan]", calc);
    const buttons = $$(".seg [data-tariff]", calc);
    const days = $("[name=days]", calc), hours = $("[name=hours]", calc);
    const cta = $("[data-calc-cta]", calc);
    let tariff = car?.cls || "comfort";
    function update() {
      const plan = car ? plansFor(car).find(p => p.key === choice.value) : (bestOffer(tariff, "rent") || bestOffer(tariff, "buyout")).plan;
      const total = earnings(tariff, plan, Number(days.value), Number(hours.value));
      for (const [key, value] of Object.entries({
        days: days.value, hours: hours.value, gross: `${money(total.gross)} ₽`, rent: `− ${money(total.weekly)} ₽`,
        month: `≈ ${money(total.month)} ₽`, net: money(total.net), tariff: CLASSES[tariff].name
      })) $(`[data-out="${key}"]`, calc).textContent = value;
      buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.tariff === tariff)));
      [days, hours].forEach(setRangeFill);
      cta.dataset.tariff = tariff;
      cta.dataset.format = plan.format;
      cta.dataset.schedule = `${days.value} ${plural(+days.value, ["смена", "смены", "смен"])} в неделю по ${hours.value} ч`;
      if (car) cta.dataset.plan = plan.key;
      $("[data-calc-label]", cta).textContent = car
        ? `Заявка на ${plan.format === "rent" ? "аренду" : "выкуп"}`
        : `Оставить заявку на тариф «${CLASSES[tariff].name}»`;
    }
    buttons.forEach(button => button.addEventListener("click", () => { tariff = button.dataset.tariff; update(); }));
    [days, hours].forEach(range => range.addEventListener("input", update));
    choice?.addEventListener("change", update);
    update();
  }

  /* ---------- Подбор по формату, тарифу и графику ---------- */
  const quiz = $("[data-quiz]");
  if (quiz) {
    const form = $("[data-quiz-form]", quiz);
    const steps = $$("[data-quiz-step]", form);
    const result = $("[data-quiz-result]", quiz);
    const apply = $("[data-quiz-apply]", result);
    const days = form.elements.days;
    const tariffs = $$('input[name="tariff"]', form);
    let step = 0;
    const updateClasses = () => {
      for (const radio of tariffs) {
        radio.disabled = !bestOffer(radio.value, form.elements.format.value);
        radio.closest("label").hidden = radio.disabled;
      }
      if (!tariffs.some(radio => radio.checked && !radio.disabled)) tariffs.find(radio => !radio.disabled).checked = true;
    };
    const go = (next, focus = true) => {
      step = next;
      form.hidden = false;
      result.hidden = true;
      steps.forEach((panel, i) => { panel.hidden = i !== step; });
      $("[data-quiz-progress]", form).textContent = `Шаг ${step + 1} из 3`;
      $("progress", form).value = step + 1;
      $("[data-quiz-back]", form).hidden = step === 0;
      $("[data-quiz-next]", form).textContent = step === 2 ? "Подобрать машину" : "Далее";
      if (focus) $("legend", steps[step]).focus({ preventScroll: true });
    };
    days.addEventListener("input", () => {
      $("[data-quiz-days]", form).textContent = days.value;
      setRangeFill(days);
    });
    form.addEventListener("submit", e => {
      e.preventDefault();
      updateClasses();
      if (step < 2) { go(step + 1); return; }
      const tariff = form.elements.tariff.value, format = form.elements.format.value;
      const { car, plan } = bestOffer(tariff, format);
      const totals = earnings(tariff, plan, Number(days.value), 10);
      const schedule = `${days.value} ${plural(+days.value, ["смена", "смены", "смен"])} в неделю по 10 ч`;
      $("[data-quiz-name]", result).textContent = car.name;
      $("[data-quiz-summary]", result).textContent = `${CLASSES[tariff].name} · ${plan.label}. ${schedule}.`;
      $("[data-quiz-price]", result).textContent = `${money(plan.daily)} ₽`;
      $("[data-quiz-income]", result).textContent = `≈ ${money(totals.net)} ₽`;
      $("[data-quiz-model]", result).href = `avto-${car.id}.html`;
      Object.assign(apply.dataset, { car: car.id, tariff, format, plan: plan.key, schedule });
      form.hidden = true;
      result.hidden = false;
      $("[data-quiz-name]", result).focus({ preventScroll: true });
    });
    $("[data-quiz-back]", quiz).addEventListener("click", () => go(step - 1));
    $("[data-quiz-edit]", result).addEventListener("click", () => go(0));
    go(0, false);
  }


  /* ---------- Pinned horizontal steps ---------- */
  const steps = $(".steps");
  if (steps) {
    const pin = $(".steps__pin", steps), track = $(".steps__track", steps), big = $(".steps__big", steps);
    let dist = 0, bigDist = 0, pinned = false;
    const setup = () => {
      pinned = innerWidth > 1140 && innerHeight > 620 && !reduce;
      steps.classList.toggle("is-pinned", pinned);
      steps.style.setProperty("--track-x", "0px");
      if (!pinned) { steps.style.removeProperty("--pin-h"); return; }
      const pad = parseFloat(getComputedStyle(root).getPropertyValue("--pad")) || 40;
      const r = track.getBoundingClientRect();
      dist = Math.max(0, r.left + r.width - (innerWidth - pad));
      bigDist = Math.max(0, big.scrollWidth - innerWidth + pad * 2) + innerWidth * .1;
      steps.style.setProperty("--pin-h", `${innerHeight + dist * 1.1}px`);
      upd();
    };
    const upd = () => {
      if (!pinned) return;
      const r = pin.getBoundingClientRect();
      const total = r.height - innerHeight;
      const p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
      steps.style.setProperty("--track-x", `${-p * dist}px`);
      steps.style.setProperty("--big-x", `${-p * bigDist}px`);
      steps.style.setProperty("--p", p.toFixed(4));
    };
    scrollHandlers.push(upd);
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(setup, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setup);
    setup();
  }

  /* ---------- Floating CTA ---------- */
  const float = $(".float-cta");
  if (float) {
    const blockers = $$("[data-hide-float]");
    const visible = new Set();
    if ("IntersectionObserver" in window) {
      const bio = new IntersectionObserver(es => { es.forEach(en => en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)); onScroll(); });
      blockers.forEach(b => bio.observe(b));
    }
    scrollHandlers.push(() => {
      const show = scrollY > innerHeight * .75 && visible.size === 0;
      float.classList.toggle("is-visible", show);
      float.toggleAttribute("inert", !show);
    });
  }

  /* ---------- Фильтры и сортировка внутри выбранного тарифа ---------- */
  const grid = $("#catalog-grid");
  if (grid) {
    const cards = $$(".car-card", grid);
    const promo = $("[data-promo]", grid);
    const empty = $("#catalog-empty");
    const sort = $("#sort");
    const params = new URLSearchParams(location.search);
    const legacyModel = location.hash.startsWith("#car-") && byId(location.hash.slice(5));
    if (legacyModel) {
      location.replace(`avto-${legacyModel.id}.html`);
      return;
    }
    const legacyClass = params.get("class");
    if (!grid.dataset.class && Object.hasOwn(CLASSES, legacyClass)) {
      params.delete("class");
      const query = params.toString();
      location.replace(CLASSES[legacyClass].url + (query ? "?" + query : "") + location.hash);
      return;
    }
    const defaults = { format: "all", body: "all", fuel: "all", sort: "popular" };
    const state = { ...defaults };
    for (const key of Object.keys(defaults)) {
      if (params.get(key)) state[key] = params.get(key);
    }
    function apply(scroll = false) {
      const list = cards.filter(card =>
        (state.format === "all" || card.dataset.formats.split(" ").includes(state.format)) &&
        (state.body === "all" || state.body === card.dataset.body) &&
        (state.fuel === "all" || state.fuel === card.dataset.fuel));
      const sortPrice = card => Number(state.format === "buyout" ? card.dataset.buyoutPrice : card.dataset.price);
      if (state.sort === "cheap") list.sort((a, b) => sortPrice(a) - sortPrice(b));
      if (state.sort === "expensive") list.sort((a, b) => sortPrice(b) - sortPrice(a));
      grid.replaceChildren(...list);
      if (promo && list.length) grid.append(promo);
      empty.hidden = list.length > 0;
      $("#catalog-count").innerHTML = `В каталоге <b>${list.length} ${plural(list.length, ["модель", "модели", "моделей"])}</b>`;
      $$("[data-filter]").forEach(b => b.setAttribute("aria-pressed", String(state[b.dataset.filter] === b.dataset.value)));
      sort.value = state.sort;
      const query = new URLSearchParams();
      for (const [key, value] of Object.entries(state)) if (value !== defaults[key]) query.set(key, value);
      const suffix = query.size ? "?" + query : "";
      $$("[data-reset]").filter(button => !empty.contains(button)).forEach(button => { button.hidden = !suffix; });
      for (const link of $$(".filters a.chip")) link.href = link.getAttribute("href").split(/[?#]/)[0] + suffix + "#catalog";
      history.replaceState(null, "", location.pathname + suffix + location.hash);
      if (scroll) $("#catalog").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    }
    document.addEventListener("click", e => {
      const button = e.target.closest("[data-filter]");
      if (button) {
        const { filter, value, toggle } = button.dataset;
        state[filter] = state[filter] === value && toggle !== "false" ? "all" : value;
        apply(button.hasAttribute("data-scroll"));
      } else if (e.target.closest("[data-reset]")) { Object.assign(state, defaults); apply(true); }
    });
    sort.addEventListener("change", () => { state.sort = sort.value; apply(); });
    apply();
  }
})();

