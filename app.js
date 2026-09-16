(function () {
  "use strict";

  const STORAGE_KEY = "tlmAppData";
  const CHECK_SVG =
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.3l3.2 3.2L13 4.3"/></svg>';

  // ---------- Configuração das notificações push ----------
  // Preenche estas duas linhas depois de criares o projeto Supabase (ver NOTIFICACOES-SETUP.md).
  // Não são secretas: a "anon key" foi feita para ser usada no browser.
  const SUPABASE_URL = "https://hdfjazjjpjazbxowqpvg.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_q36qc87Z2yOkh1TbtXLhxA_CnU-1FJD";
  // Chave pública VAPID (também não é secreta). A chave privada correspondente
  // fica só no GitHub Actions, nunca aqui. Ver NOTIFICACOES-SETUP.md.
  const VAPID_PUBLIC_KEY =
    "BIeMFEQkCSZpiYCESxHLqPNnUselCxbs7I_GzMv2zJpJBD2g28LdeAqVS8D_HCWSjSmNo_rCCxo5XYG45KA4SME";

  // ---------- Date utils (local time, no UTC shifting) ----------
  function pad(n) { return String(n).padStart(2, "0"); }
  function toDateStr(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
  function parseDateStr(s) {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  function addDays(d, n) {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  }
  function todayStr() { return toDateStr(new Date()); }
  function mondayOf(d) {
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    return addDays(d, diff);
  }
  function weekKeyOf(dateStr) { return toDateStr(mondayOf(parseDateStr(dateStr))); }

  function vibrate(ms) {
    if (navigator.vibrate) {
      try { navigator.vibrate(ms); } catch (e) {}
    }
  }

  function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    const defaults = {
      routines: [],
      routineLog: {},
      goals: [],
      journal: [],
      journals: [],
      activeJournalId: null,
      principles: [],
      reminders: [],
      events: [],
      weightEntries: []
    };
    if (!raw) return defaults;
    try {
      const parsed = JSON.parse(raw);
      return Object.assign(defaults, parsed);
    } catch (e) {
      return defaults;
    }
  }

  let state = loadState();

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // migrates data saved by earlier versions of the app (single global
  // "done" flags) into the per-day / per-week shape used now
  function migrate() {
    if (!state.routineLog) state.routineLog = {};
    const tDs = todayStr();
    const wk = weekKeyOf(tDs);
    state.routines.forEach((r) => {
      if (typeof r.done === "boolean") {
        if (r.done) {
          state.routineLog[tDs] = state.routineLog[tDs] || {};
          state.routineLog[tDs][r.id] = true;
        }
        delete r.done;
      }
    });
    state.goals.forEach((g) => {
      if (g.scope === "day" && !g.date) g.date = tDs;
      if (g.scope === "week" && !g.weekStart) g.weekStart = wk;
    });
    // jornais: garante que existe sempre pelo menos um (o "Pessoal" original)
    if (!state.journals || state.journals.length === 0) {
      state.journals = [{ id: "default", name: "Pessoal", withDates: true }];
    }
    if (!state.activeJournalId || !state.journals.some((j) => j.id === state.activeJournalId)) {
      state.activeJournalId = state.journals[0].id;
    }
    state.journal.forEach((e) => {
      if (!e.date) e.date = e.createdAt ? toDateStr(new Date(e.createdAt)) : tDs;
      if (!e.journalId) e.journalId = state.journals[0].id;
    });
    // rotinas: entradas antigas guardavam um booleano por dia ("true"),
    // agora cada rotina guarda um objeto por horário (chave "_" quando não tem sub-horários)
    Object.keys(state.routineLog).forEach((ds) => {
      const dayLog = state.routineLog[ds];
      Object.keys(dayLog).forEach((rid) => {
        if (typeof dayLog[rid] === "boolean") {
          dayLog[rid] = dayLog[rid] ? { _: true } : {};
        }
      });
    });
    save();
  }
  migrate();

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function bump(el) {
    if (!el) return;
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  }

  // removes an element with a leave animation, falls back to a timeout
  // in case transitionend doesn't fire (e.g. element already hidden)
  function removeAnimated(el, done) {
    if (!el) { if (done) done(); return; }
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      el.removeEventListener("transitionend", onEnd);
      el.remove();
      if (done) done();
    };
    const onEnd = (e) => { if (e.target === el) finish(); };
    el.addEventListener("transitionend", onEnd);
    el.classList.add("leaving");
    setTimeout(finish, 320);
  }

  function playEnter(el) {
    el.classList.add("entering");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.remove("entering"));
    });
  }

  const dateFmt = new Intl.DateTimeFormat("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  // ---------- Selected day (drives routines, day goals & journal date) ----------
  let selectedDate = todayStr();

  const DAY_STRIP_SIDE = 3;

  function buildDayStrip() {
    const stripEl = document.getElementById("day-strip");
    stripEl.innerHTML = "";
    const base = parseDateStr(selectedDate);
    for (let i = -DAY_STRIP_SIDE; i <= DAY_STRIP_SIDE; i++) {
      const d = addDays(base, i);
      const ds = toDateStr(d);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "day-pill" + (ds === todayStr() ? " is-today" : "") + (ds === selectedDate ? " selected" : "");
      btn.textContent = String(d.getDate());
      btn.dataset.date = ds;
      btn.addEventListener("click", () => selectDate(ds));
      stripEl.appendChild(btn);
    }
  }

  function updateDateLabel() {
    document.getElementById("today-date").textContent = dateFmt.format(parseDateStr(selectedDate));
  }

  function selectDate(ds) {
    if (ds === selectedDate) return;
    selectedDate = ds;
    buildDayStrip();
    updateDateLabel();
    renderRoutines();
    renderGoals();
  }

  // ---------- Navigation between the 4 main screens ----------
  const screens = {
    inicio: document.getElementById("screen-inicio"),
    metas: document.getElementById("screen-metas"),
    diario: document.getElementById("screen-diario"),
    agenda: document.getElementById("screen-agenda")
  };
  const navBtns = document.querySelectorAll(".nav-btn");
  const navIndicator = document.getElementById("nav-indicator");
  const VIEW_ORDER = ["inicio", "metas", "diario", "agenda"];
  let currentView = "inicio";
  let navigating = false;

  function positionNavIndicator(view) {
    const btn = document.querySelector(`.nav-btn[data-nav="${view}"]`);
    if (!btn || !navIndicator) return;
    navIndicator.style.left = btn.offsetLeft + "px";
    navIndicator.style.width = btn.offsetWidth + "px";
  }

  function goTo(view) {
    if (view === currentView || navigating || !screens[view]) return;
    navigating = true;
    const curIdx = VIEW_ORDER.indexOf(currentView);
    const nextIdx = VIEW_ORDER.indexOf(view);
    const forward = nextIdx > curIdx;
    const cur = screens[currentView];
    const next = screens[view];

    navBtns.forEach((b) => b.classList.toggle("active", b.dataset.nav === view));
    positionNavIndicator(view);

    cur.classList.add(forward ? "exiting-fwd" : "exiting-back");
    setTimeout(() => {
      cur.classList.add("hidden");
      cur.classList.remove("exiting-fwd", "exiting-back");
      next.classList.remove("hidden");
      next.classList.add(forward ? "pre-enter-fwd" : "pre-enter-back");
      void next.offsetWidth;
      requestAnimationFrame(() => {
        next.classList.remove("pre-enter-fwd", "pre-enter-back");
      });
      currentView = view;
      navigating = false;
    }, 180);
  }

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => goTo(el.dataset.nav));
  });

  window.addEventListener("resize", () => positionNavIndicator(currentView));

  // ---------- Swipe navigation (iOS convention: left = forward, right = back) ----------
  (function setupSwipe() {
    const appEl = document.querySelector(".app");
    let startX = 0;
    let startY = 0;
    let tracking = false;

    function bounceEdge(dir) {
      const el = screens[currentView];
      el.style.setProperty("--edge-dir", dir);
      el.classList.remove("edge-bounce");
      void el.offsetWidth;
      el.classList.add("edge-bounce");
      setTimeout(() => el.classList.remove("edge-bounce"), 280);
    }

    appEl.addEventListener(
      "touchstart",
      (e) => {
        if (navigating) return;
        const target = e.target;
        if (target.closest("input, textarea, .bottom-nav, .day-strip-scroll, .journal-tabs-scroll, .drag-handle, [contenteditable]")) return;
        const t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;
        tracking = true;
      },
      { passive: true }
    );

    appEl.addEventListener(
      "touchend",
      (e) => {
        if (!tracking) return;
        tracking = false;
        const t = e.changedTouches[0];
        const deltaX = t.clientX - startX;
        const deltaY = t.clientY - startY;
        const THRESHOLD = 55;
        if (Math.abs(deltaX) < THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY) * 1.4) return;

        const curIdx = VIEW_ORDER.indexOf(currentView);
        if (deltaX < 0) {
          // arrastar para a esquerda -> avança (convenção iOS)
          if (curIdx < VIEW_ORDER.length - 1) {
            goTo(VIEW_ORDER[curIdx + 1]);
          } else {
            bounceEdge(1);
          }
        } else {
          // arrastar para a direita -> volta atrás
          if (curIdx > 0) {
            goTo(VIEW_ORDER[curIdx - 1]);
          } else {
            bounceEdge(-1);
          }
        }
      },
      { passive: true }
    );

    appEl.addEventListener(
      "touchcancel",
      () => { tracking = false; },
      { passive: true }
    );
  })();

  // ---------- Generic list item builder ----------
  const DRAG_HANDLE_SVG =
    '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="1.6"/><circle cx="16" cy="6" r="1.6"/><circle cx="8" cy="12" r="1.6"/><circle cx="16" cy="12" r="1.6"/><circle cx="8" cy="18" r="1.6"/><circle cx="16" cy="18" r="1.6"/></svg>';

  function makeListItem({ id, text, done, onToggle, onDelete, editable, onEditSave, dragHandle }) {
    const li = document.createElement("li");
    li.className = "list-item" + (done ? " done" : "");
    li.dataset.id = id;

    if (dragHandle) {
      const handle = document.createElement("span");
      handle.className = "drag-handle";
      handle.innerHTML = DRAG_HANDLE_SVG;
      li.appendChild(handle);
    }

    const box = document.createElement("span");
    box.className = "checkbox";
    box.innerHTML = CHECK_SVG;
    box.addEventListener("click", onToggle);
    li.appendChild(box);

    const span = document.createElement("span");
    span.className = "item-text";
    span.textContent = text;
    if (editable) {
      span.contentEditable = "true";
      span.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          span.blur();
        }
      });
      span.addEventListener("blur", () => {
        const val = span.textContent.trim();
        if (!val) {
          span.textContent = text;
          return;
        }
        span.textContent = val;
        if (onEditSave) onEditSave(val);
      });
    }
    li.appendChild(span);

    if (onDelete) {
      const del = document.createElement("button");
      del.className = "item-delete";
      del.textContent = "×";
      del.addEventListener("click", onDelete);
      li.appendChild(del);
    }
    return li;
  }

  function emptyHint(text) {
    const p = document.createElement("li");
    p.className = "empty-hint";
    p.textContent = text;
    return p;
  }

  function clearEmptyHint(list) {
    const hint = list.querySelector(".empty-hint");
    if (hint) hint.remove();
  }

  function toggleListItem(li, isDone) {
    li.classList.toggle("done", isDone);
    if (isDone) {
      li.classList.remove("just-checked");
      void li.offsetWidth;
      li.classList.add("just-checked");
      vibrate(12);
    }
  }

  // ---------- Routines (checklist por dia, guardadas em routineLog) ----------
  const routinesList = document.getElementById("routines-list");
  const routinesCounter = document.getElementById("routines-counter");
  const SLOT_PRESETS = ["Manhã", "Tarde", "Noite"];
  const SLOT_SHORT = { "Manhã": "M", "Tarde": "T", "Noite": "N" };
  const SLOTS_ICON_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.3"/><path d="M12 7.5V12l3 2.2"/></svg>';

  // rotinas simples (sem sub-horários) usam sempre a chave "_" internamente
  function routineSlots(r) {
    return r.slots && r.slots.length ? r.slots : ["_"];
  }

  function isSlotDone(id, ds, slot) {
    return !!(state.routineLog[ds] && state.routineLog[ds][id] && state.routineLog[ds][id][slot]);
  }

  function setSlotDone(id, ds, slot, val) {
    if (!state.routineLog[ds]) state.routineLog[ds] = {};
    if (!state.routineLog[ds][id]) state.routineLog[ds][id] = {};
    if (val) state.routineLog[ds][id][slot] = true;
    else delete state.routineLog[ds][id][slot];
  }

  function isRoutineFullyDone(r, ds) {
    return routineSlots(r).every((s) => isSlotDone(r.id, ds, s));
  }

  // dias seguidos com a rotina 100% completa (todos os sub-horários), a
  // contar sempre a partir de hoje de verdade — não do dia que estás a ver.
  // Se hoje ainda não estiver feita, a sequência não quebra já: continua a
  // contar a partir de ontem (só quebra de facto à meia-noite sem check).
  function routineStreak(r) {
    let cursor = new Date();
    if (!isRoutineFullyDone(r, toDateStr(cursor))) {
      cursor = addDays(cursor, -1);
    }
    let count = 0;
    let guard = 0;
    while (isRoutineFullyDone(r, toDateStr(cursor)) && guard < 3650) {
      count++;
      cursor = addDays(cursor, -1);
      guard++;
    }
    return count;
  }

  function updateRoutinesCounter() {
    let done = 0;
    let total = 0;
    state.routines.forEach((r) => {
      const slots = routineSlots(r);
      total += slots.length;
      done += slots.filter((s) => isSlotDone(r.id, selectedDate, s)).length;
    });
    routinesCounter.textContent = `${done}/${total}`;
    bump(routinesCounter);
    updateReminderBanner();
  }

  function renderRoutines() {
    routinesList.innerHTML = "";
    if (state.routines.length === 0) {
      routinesList.appendChild(emptyHint("Sem rotinas ainda. Adiciona a primeira abaixo."));
    }
    state.routines.forEach((r, index) => routinesList.appendChild(buildRoutineItem(r, index)));
    updateRoutinesCounter();
  }

  function buildRoutineItem(r, index) {
    const slots = routineSlots(r);
    const multi = slots.length > 1;

    const li = document.createElement("li");
    li.className = "list-item routine-item" + (isRoutineFullyDone(r, selectedDate) ? " done" : "");
    li.dataset.id = r.id;

    const handle = document.createElement("span");
    handle.className = "drag-handle";
    handle.innerHTML = DRAG_HANDLE_SVG;
    li.appendChild(handle);

    const body = document.createElement("div");
    body.className = "routine-body";

    const mainRow = document.createElement("div");
    mainRow.className = "routine-main-row";

    function refreshDoneState() {
      const full = isRoutineFullyDone(r, selectedDate);
      li.classList.toggle("done", full);
      if (full) {
        li.classList.remove("just-checked");
        void li.offsetWidth;
        li.classList.add("just-checked");
        vibrate(12);
      }
      refreshStreakBadge();
    }

    if (multi) {
      const pillWrap = document.createElement("div");
      pillWrap.className = "routine-slots";
      slots.forEach((slot) => {
        const pill = document.createElement("button");
        pill.type = "button";
        pill.className = "slot-pill" + (isSlotDone(r.id, selectedDate, slot) ? " done" : "");
        pill.textContent = SLOT_SHORT[slot] || slot.slice(0, 1).toUpperCase();
        pill.title = slot;
        pill.addEventListener("click", () => {
          const newVal = !isSlotDone(r.id, selectedDate, slot);
          setSlotDone(r.id, selectedDate, slot, newVal);
          pill.classList.toggle("done", newVal);
          if (newVal) vibrate(8);
          save();
          refreshDoneState();
          updateRoutinesCounter();
        });
        pillWrap.appendChild(pill);
      });
      mainRow.appendChild(pillWrap);
    } else {
      const box = document.createElement("span");
      box.className = "checkbox";
      box.innerHTML = CHECK_SVG;
      box.addEventListener("click", () => {
        const newVal = !isSlotDone(r.id, selectedDate, "_");
        setSlotDone(r.id, selectedDate, "_", newVal);
        save();
        refreshDoneState();
        updateRoutinesCounter();
      });
      mainRow.appendChild(box);
    }

    const span = document.createElement("span");
    span.className = "item-text";
    span.textContent = r.text;
    span.contentEditable = "true";
    span.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        span.blur();
      }
    });
    span.addEventListener("blur", () => {
      const val = span.textContent.trim();
      if (!val) {
        span.textContent = r.text;
        return;
      }
      span.textContent = val;
      r.text = val;
      save();
    });
    mainRow.appendChild(span);

    const streakBadge = document.createElement("span");
    streakBadge.className = "routine-streak hidden";
    streakBadge.innerHTML = '<span class="routine-streak-fire">🔥</span><span class="routine-streak-n"></span>';
    const streakN = streakBadge.querySelector(".routine-streak-n");
    function refreshStreakBadge() {
      const n = routineStreak(r);
      if (n >= 3) {
        streakN.textContent = "x" + n;
        streakBadge.classList.remove("hidden");
      } else {
        streakBadge.classList.add("hidden");
      }
    }
    refreshStreakBadge();
    mainRow.appendChild(streakBadge);

    const slotsBtn = document.createElement("button");
    slotsBtn.type = "button";
    slotsBtn.className = "routine-slots-btn" + (multi ? " active" : "");
    slotsBtn.innerHTML = SLOTS_ICON_SVG;
    slotsBtn.setAttribute("aria-label", "Horários da rotina");
    slotsBtn.addEventListener("click", () => {
      editor.classList.toggle("open");
    });
    mainRow.appendChild(slotsBtn);

    const del = document.createElement("button");
    del.className = "item-delete";
    del.textContent = "×";
    del.addEventListener("click", () => {
      state.routines = state.routines.filter((x) => x.id !== r.id);
      save();
      removeAnimated(li, () => renderRoutines());
    });
    mainRow.appendChild(del);

    body.appendChild(mainRow);

    const editor = document.createElement("div");
    editor.className = "routine-slots-editor";
    const editorInner = document.createElement("div");
    editorInner.className = "routine-slots-editor-inner";
    const hint = document.createElement("span");
    hint.className = "routine-slots-hint";
    hint.textContent = "Horários:";
    editorInner.appendChild(hint);
    SLOT_PRESETS.forEach((preset) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "slot-chip" + (r.slots && r.slots.includes(preset) ? " active" : "");
      chip.textContent = preset;
      chip.addEventListener("click", () => {
        const current = r.slots && r.slots.length ? r.slots.slice() : [];
        const i = current.indexOf(preset);
        if (i === -1) current.push(preset);
        else current.splice(i, 1);
        r.slots = current.length ? current : undefined;
        save();
        const fresh = buildRoutineItem(r, index);
        fresh.querySelector(".routine-slots-editor").classList.add("open");
        li.replaceWith(fresh);
        updateRoutinesCounter();
      });
      editorInner.appendChild(chip);
    });
    editor.appendChild(editorInner);
    body.appendChild(editor);

    li.appendChild(body);

    setupRoutineDrag(li, handle, index);
    return li;
  }

  function setupRoutineDrag(li, handle, index) {
    let dragging = false;
    let startY = 0;
    let itemHeight = 0;
    let targetIndex = index;
    let siblings = [];

    function onPointerMove(e) {
      if (!dragging) return;
      const deltaY = e.clientY - startY;
      li.style.transform = `translateY(${deltaY}px)`;
      const rawOffset = Math.round(deltaY / itemHeight);
      const newTarget = Math.min(Math.max(index + rawOffset, 0), state.routines.length - 1);
      if (newTarget !== targetIndex) {
        targetIndex = newTarget;
        siblings.forEach(({ el, i }) => {
          let shift = 0;
          if (index < targetIndex && i > index && i <= targetIndex) shift = -itemHeight;
          else if (index > targetIndex && i >= targetIndex && i < index) shift = itemHeight;
          el.style.transform = shift ? `translateY(${shift}px)` : "";
        });
      }
    }

    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      try { handle.releasePointerCapture(e.pointerId); } catch (err) {}
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      li.classList.remove("dragging");
      li.style.transform = "";
      siblings.forEach(({ el }) => { el.style.transform = ""; });
      if (targetIndex !== index) {
        const [moved] = state.routines.splice(index, 1);
        state.routines.splice(targetIndex, 0, moved);
        save();
        renderRoutines();
      }
    }

    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      dragging = true;
      startY = e.clientY;
      targetIndex = index;
      itemHeight = li.getBoundingClientRect().height;
      document.querySelectorAll(".routine-slots-editor.open").forEach((el) => el.classList.remove("open"));
      siblings = Array.from(routinesList.querySelectorAll(".list-item"))
        .map((el, i) => ({ el, i }))
        .filter(({ el }) => el !== li);
      li.classList.add("dragging");
      try { handle.setPointerCapture(e.pointerId); } catch (err) {}
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    });
  }

  document.getElementById("routine-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("routine-input");
    const text = input.value.trim();
    if (!text) return;
    const r = { id: uid(), text };
    state.routines.push(r);
    input.value = "";
    save();
    clearEmptyHint(routinesList);
    const li = buildRoutineItem(r, state.routines.length - 1);
    routinesList.appendChild(li);
    playEnter(li);
    updateRoutinesCounter();
  });

  // ---------- Goals (metas da semana / do dia selecionado) ----------
  let goalScope = "semana";
  const goalsList = document.getElementById("goals-list");
  const goalsWeekPreview = document.getElementById("goals-week-preview");
  const goalsWeekCounter = document.getElementById("goals-week-counter");
  const tabIndicator = document.getElementById("tab-indicator");

  function positionTabIndicator() {
    const activeTab = document.querySelector(".tab.active");
    if (!activeTab || !tabIndicator) return;
    tabIndicator.style.left = activeTab.offsetLeft + "px";
    tabIndicator.style.width = activeTab.offsetWidth + "px";
  }

  document.querySelectorAll(".tab").forEach((t) => {
    t.addEventListener("click", () => {
      goalScope = t.dataset.scope;
      document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("active", x === t));
      positionTabIndicator();
      renderGoals();
    });
  });

  function scopeKeyOf(scope) {
    return scope === "dia" ? "day" : "week";
  }

  function emptyGoalsMsg() {
    return `Sem metas para ${goalScope === "dia" ? "este dia" : "esta semana"}.`;
  }

  function renderGoals() {
    const scopeKey = scopeKeyOf(goalScope);
    const filtered =
      scopeKey === "day"
        ? state.goals.filter((g) => g.scope === "day" && g.date === selectedDate)
        : state.goals.filter((g) => g.scope === "week" && g.weekStart === weekKeyOf(selectedDate));
    goalsList.innerHTML = "";
    if (filtered.length === 0) {
      goalsList.appendChild(emptyHint(emptyGoalsMsg()));
    }
    filtered.forEach((g) => goalsList.appendChild(buildGoalItem(g, goalsList)));
    renderGoalsPreview();
  }

  function buildGoalItem(g, listEl) {
    return makeListItem({
      id: g.id,
      text: g.text,
      done: g.done,
      onToggle: (e) => {
        g.done = !g.done;
        toggleListItem(e.currentTarget.closest(".list-item"), g.done);
        save();
        renderGoalsPreview();
      },
      onDelete: (e) => {
        const li = e.currentTarget.closest(".list-item");
        state.goals = state.goals.filter((x) => x.id !== g.id);
        save();
        removeAnimated(li, () => {
          if (listEl.children.length === 0) {
            listEl.appendChild(emptyHint(emptyGoalsMsg()));
          }
          renderGoalsPreview();
        });
      }
    });
  }

  function renderGoalsPreview() {
    const wk = weekKeyOf(selectedDate);
    const weekGoals = state.goals.filter((g) => g.scope === "week" && g.weekStart === wk);
    goalsWeekPreview.innerHTML = "";
    if (weekGoals.length === 0) {
      goalsWeekPreview.appendChild(emptyHint("Sem metas para esta semana."));
    }
    weekGoals.slice(0, 4).forEach((g) => {
      const li = makeListItem({
        id: g.id,
        text: g.text,
        done: g.done,
        onToggle: (e) => {
          g.done = !g.done;
          toggleListItem(e.currentTarget.closest(".list-item"), g.done);
          save();
          document.querySelectorAll(`#goals-list .list-item[data-id="${g.id}"]`).forEach((el) => {
            toggleListItem(el, g.done);
          });
          const done = state.goals.filter((x) => x.scope === "week" && x.weekStart === wk && x.done).length;
          goalsWeekCounter.textContent = `${done}/${weekGoals.length}`;
          bump(goalsWeekCounter);
        }
      });
      goalsWeekPreview.appendChild(li);
    });
    const done = weekGoals.filter((g) => g.done).length;
    goalsWeekCounter.textContent = `${done}/${weekGoals.length}`;
  }

  document.getElementById("goal-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("goal-input");
    const text = input.value.trim();
    if (!text) return;
    const scopeKey = scopeKeyOf(goalScope);
    const g =
      scopeKey === "day"
        ? { id: uid(), text, done: false, scope: "day", date: selectedDate }
        : { id: uid(), text, done: false, scope: "week", weekStart: weekKeyOf(selectedDate) };
    state.goals.push(g);
    input.value = "";
    save();
    clearEmptyHint(goalsList);
    const li = buildGoalItem(g, goalsList);
    goalsList.appendChild(li);
    playEnter(li);
    renderGoalsPreview();
  });

  // ---------- Peso (um registo por dia; repetir no mesmo dia atualiza) ----------
  const weightList = document.getElementById("weight-list");
  const weightCurrentEl = document.getElementById("weight-current");
  const weightDeltaEl = document.getElementById("weight-delta");
  const weightForm = document.getElementById("weight-form");
  const weightValueInput = document.getElementById("weight-value-input");
  const weightNoteInput = document.getElementById("weight-note-input");

  const shortDateFmt = new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "short" });
  function formatShortDate(ds) {
    if (ds === todayStr()) return "Hoje";
    if (ds === toDateStr(addDays(new Date(), -1))) return "Ontem";
    return shortDateFmt.format(parseDateStr(ds));
  }

  function sortedWeightEntries() {
    return state.weightEntries.slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }

  function renderWeightCurrent() {
    const sorted = sortedWeightEntries();
    if (sorted.length === 0) {
      weightCurrentEl.textContent = "Ainda sem registos";
      weightDeltaEl.textContent = "";
      weightDeltaEl.className = "weight-delta";
      return;
    }
    const latest = sorted[0];
    weightCurrentEl.innerHTML =
      `<span class="weight-current-value">${latest.value.toFixed(1)} kg</span>` +
      `<span class="weight-current-date">${formatShortDate(latest.date)}</span>`;
    if (sorted.length < 2) {
      weightDeltaEl.textContent = "";
      weightDeltaEl.className = "weight-delta";
      return;
    }
    const diff = Math.round((latest.value - sorted[1].value) * 10) / 10;
    if (diff === 0) {
      weightDeltaEl.textContent = "sem alteração";
      weightDeltaEl.className = "weight-delta neutral";
    } else if (diff < 0) {
      weightDeltaEl.textContent = `▼ ${Math.abs(diff).toFixed(1)} kg`;
      weightDeltaEl.className = "weight-delta down";
    } else {
      weightDeltaEl.textContent = `▲ ${diff.toFixed(1)} kg`;
      weightDeltaEl.className = "weight-delta up";
    }
  }

  function buildWeightItem(entry) {
    const li = document.createElement("li");
    li.className = "list-item weight-item";
    li.dataset.id = entry.id;

    const info = document.createElement("div");
    info.className = "weight-item-info";

    const valueSpan = document.createElement("span");
    valueSpan.className = "weight-item-value";
    valueSpan.textContent = entry.value.toFixed(1) + " kg";
    valueSpan.contentEditable = "true";
    valueSpan.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        valueSpan.blur();
      }
    });
    valueSpan.addEventListener("blur", () => {
      const n = parseFloat(valueSpan.textContent.replace(",", ".").replace(/[^\d.]/g, ""));
      if (!isFinite(n) || n <= 0) {
        valueSpan.textContent = entry.value.toFixed(1) + " kg";
        return;
      }
      entry.value = Math.round(n * 10) / 10;
      valueSpan.textContent = entry.value.toFixed(1) + " kg";
      save();
      renderWeightCurrent();
    });
    info.appendChild(valueSpan);

    const dateSpan = document.createElement("span");
    dateSpan.className = "weight-item-date";
    dateSpan.textContent = formatShortDate(entry.date);
    info.appendChild(dateSpan);

    const noteSpan = document.createElement("span");
    noteSpan.className = "weight-item-note";
    noteSpan.textContent = entry.note || "";
    noteSpan.dataset.placeholder = "+ nota";
    noteSpan.contentEditable = "true";
    noteSpan.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        noteSpan.blur();
      }
    });
    noteSpan.addEventListener("blur", () => {
      entry.note = noteSpan.textContent.trim();
      noteSpan.textContent = entry.note;
      save();
    });
    info.appendChild(noteSpan);

    li.appendChild(info);

    const del = document.createElement("button");
    del.className = "item-delete";
    del.textContent = "×";
    del.addEventListener("click", () => {
      state.weightEntries = state.weightEntries.filter((x) => x.id !== entry.id);
      save();
      removeAnimated(li, () => renderWeightList());
    });
    li.appendChild(del);

    return li;
  }

  function renderWeightList() {
    weightList.innerHTML = "";
    const sorted = sortedWeightEntries();
    if (sorted.length === 0) {
      weightList.appendChild(emptyHint("Ainda sem registos de peso."));
    }
    sorted.forEach((entry) => weightList.appendChild(buildWeightItem(entry)));
    renderWeightCurrent();
  }

  if (weightForm) {
    weightForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const raw = weightValueInput.value.replace(",", ".");
      const n = parseFloat(raw);
      if (!isFinite(n) || n <= 0) return;
      const value = Math.round(n * 10) / 10;
      const note = weightNoteInput.value.trim();
      const ds = todayStr();
      const existing = state.weightEntries.find((x) => x.date === ds);
      if (existing) {
        existing.value = value;
        existing.note = note;
      } else {
        state.weightEntries.push({ id: uid(), date: ds, value, note });
      }
      weightValueInput.value = "";
      weightNoteInput.value = "";
      save();
      renderWeightList();
    });
  }

  // ---------- Reminders ----------
  const remindersList = document.getElementById("reminders-list");

  function buildReminderItem(r, index) {
    const li = document.createElement("li");
    li.className = "list-item";
    li.dataset.id = r.id;

    const handle = document.createElement("span");
    handle.className = "drag-handle";
    handle.innerHTML = DRAG_HANDLE_SVG;
    li.appendChild(handle);

    const span = document.createElement("span");
    span.className = "item-text";
    span.textContent = r.text;
    span.contentEditable = "true";
    span.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        span.blur();
      }
    });
    span.addEventListener("blur", () => {
      const val = span.textContent.trim();
      if (!val) {
        span.textContent = r.text;
        return;
      }
      span.textContent = val;
      r.text = val;
      save();
    });
    li.appendChild(span);

    const del = document.createElement("button");
    del.className = "item-delete";
    del.textContent = "×";
    del.addEventListener("click", () => {
      state.reminders = state.reminders.filter((x) => x.id !== r.id);
      save();
      removeAnimated(li, () => {
        if (remindersList.children.length === 0) {
          remindersList.appendChild(emptyHint("Sem lembretes ativos."));
        }
      });
    });
    li.appendChild(del);

    setupReminderDrag(li, handle, index);
    return li;
  }

  function setupReminderDrag(li, handle, index) {
    let dragging = false;
    let startY = 0;
    let itemHeight = 0;
    let targetIndex = index;
    let siblings = [];

    function onPointerMove(e) {
      if (!dragging) return;
      const deltaY = e.clientY - startY;
      li.style.transform = `translateY(${deltaY}px)`;
      const rawOffset = Math.round(deltaY / itemHeight);
      const newTarget = Math.min(Math.max(index + rawOffset, 0), state.reminders.length - 1);
      if (newTarget !== targetIndex) {
        targetIndex = newTarget;
        siblings.forEach(({ el, i }) => {
          let shift = 0;
          if (index < targetIndex && i > index && i <= targetIndex) shift = -itemHeight;
          else if (index > targetIndex && i >= targetIndex && i < index) shift = itemHeight;
          el.style.transform = shift ? `translateY(${shift}px)` : "";
        });
      }
    }

    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      try { handle.releasePointerCapture(e.pointerId); } catch (err) {}
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      li.classList.remove("dragging");
      li.style.transform = "";
      siblings.forEach(({ el }) => { el.style.transform = ""; });
      if (targetIndex !== index) {
        const [moved] = state.reminders.splice(index, 1);
        state.reminders.splice(targetIndex, 0, moved);
        save();
        renderReminders();
      }
    }

    handle.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      dragging = true;
      startY = e.clientY;
      targetIndex = index;
      itemHeight = li.getBoundingClientRect().height;
      siblings = Array.from(remindersList.querySelectorAll(".list-item"))
        .map((el, i) => ({ el, i }))
        .filter(({ el }) => el !== li);
      li.classList.add("dragging");
      try { handle.setPointerCapture(e.pointerId); } catch (err) {}
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    });
  }

  function renderReminders() {
    remindersList.innerHTML = "";
    if (state.reminders.length === 0) {
      remindersList.appendChild(emptyHint("Sem lembretes ativos."));
    }
    state.reminders.forEach((r, index) => remindersList.appendChild(buildReminderItem(r, index)));
  }

  document.getElementById("reminder-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("reminder-input");
    const text = input.value.trim();
    if (!text) return;
    const r = { id: uid(), text };
    state.reminders.push(r);
    input.value = "";
    save();
    clearEmptyHint(remindersList);
    const li = buildReminderItem(r, state.reminders.length - 1);
    remindersList.appendChild(li);
    playEnter(li);
  });

  // ---------- Journal (vários jornais: com datas ou tipo caderno) ----------
  const journalTabsEl = document.getElementById("journal-tabs");
  const journalEntries = document.getElementById("journal-entries");
  const journalSaveBtn = document.getElementById("journal-save");
  const journalInput = document.getElementById("journal-input");
  const journalInputLabel = document.getElementById("journal-input-label");
  const journalNewCollapse = document.getElementById("journal-new-collapse");
  const journalNewName = document.getElementById("journal-new-name");
  const journalNewTypeButtons = document.querySelectorAll("#journal-new-type .slot-chip");
  let journalNewType = "dates";

  function currentJournal() {
    return state.journals.find((j) => j.id === state.activeJournalId) || state.journals[0];
  }

  function selectJournal(id) {
    if (id === state.activeJournalId) return;
    state.activeJournalId = id;
    save();
    renderJournalTabs();
    renderJournal();
  }

  function renderJournalTabs() {
    journalTabsEl.innerHTML = "";
    state.journals.forEach((j) => {
      const tab = document.createElement("div");
      tab.className = "journal-tab" + (j.id === state.activeJournalId ? " active" : "");
      tab.dataset.id = j.id;

      const label = document.createElement("span");
      label.className = "journal-tab-label";
      label.textContent = j.name;
      label.addEventListener("click", () => selectJournal(j.id));
      tab.appendChild(label);

      if (state.journals.length > 1) {
        const x = document.createElement("span");
        x.className = "journal-tab-x";
        x.textContent = "×";
        x.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!confirm(`Eliminar o jornal "${j.name}" e todas as suas entradas?`)) return;
          state.journals = state.journals.filter((jj) => jj.id !== j.id);
          state.journal = state.journal.filter((entry) => entry.journalId !== j.id);
          if (state.activeJournalId === j.id) state.activeJournalId = state.journals[0].id;
          save();
          renderJournalTabs();
          renderJournal();
        });
        tab.appendChild(x);
      }

      journalTabsEl.appendChild(tab);
    });

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "journal-tab-add";
    addBtn.textContent = "+";
    addBtn.setAttribute("aria-label", "Novo jornal");
    addBtn.addEventListener("click", () => {
      journalNewCollapse.classList.toggle("open");
      if (journalNewCollapse.classList.contains("open")) journalNewName.focus();
    });
    journalTabsEl.appendChild(addBtn);
  }

  journalNewTypeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      journalNewType = btn.dataset.type;
      journalNewTypeButtons.forEach((b) => b.classList.toggle("active", b === btn));
    });
  });

  document.getElementById("journal-new-confirm").addEventListener("click", () => {
    const name = journalNewName.value.trim();
    if (!name) {
      journalNewName.focus();
      return;
    }
    const nj = { id: uid(), name, withDates: journalNewType === "dates" };
    state.journals.push(nj);
    state.activeJournalId = nj.id;
    journalNewName.value = "";
    journalNewType = "dates";
    journalNewTypeButtons.forEach((b) => b.classList.toggle("active", b.dataset.type === "dates"));
    journalNewCollapse.classList.remove("open");
    save();
    renderJournalTabs();
    renderJournal();
  });

  // ---------- Deteção de links no texto do jornal ----------
  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const URL_REGEX = /(https?:\/\/[^\s<]+[^\s<.,:;!?'")\]])/g;

  function linkifyText(str) {
    return escapeHtml(str).replace(
      URL_REGEX,
      (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
  }

  function buildEntryBox(entry) {
    const box = document.createElement("div");
    box.className = "journal-entry";
    box.dataset.id = entry.id;

    const text = document.createElement("div");
    text.className = "journal-entry-text";
    text.innerHTML = linkifyText(entry.text);

    function autoResize(el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }

    function startEditing() {
      if (box.querySelector(".journal-entry-edit")) return;
      const editArea = document.createElement("textarea");
      editArea.className = "journal-entry-edit";
      editArea.value = entry.text;
      text.replaceWith(editArea);
      editArea.focus();
      editArea.setSelectionRange(editArea.value.length, editArea.value.length);
      autoResize(editArea);
      editArea.addEventListener("input", () => autoResize(editArea));
      editArea.addEventListener("blur", () => {
        const val = editArea.value.trim();
        if (val) {
          entry.text = val;
          text.innerHTML = linkifyText(val);
          save();
        }
        editArea.replaceWith(text);
      });
    }

    text.addEventListener("click", (e) => {
      if (e.target.closest("a")) return; // deixa o link abrir normalmente
      startEditing();
    });

    const del = document.createElement("button");
    del.className = "item-delete";
    del.textContent = "×";
    del.addEventListener("click", () => {
      state.journal = state.journal.filter((x) => x.id !== entry.id);
      save();
      removeAnimated(box, () => renderJournal());
    });
    box.appendChild(text);
    box.appendChild(del);
    return box;
  }

  // entrada isolada (jornais tipo caderno, ou entradas de hoje num jornal com datas)
  function buildJournalEntryWrap(entry, labelText) {
    const wrap = document.createElement("div");
    wrap.className = "journal-day";
    wrap.dataset.id = entry.id;
    if (labelText) {
      const dateLabel = document.createElement("div");
      dateLabel.className = "journal-date";
      dateLabel.textContent = labelText;
      wrap.appendChild(dateLabel);
    }
    wrap.appendChild(buildEntryBox(entry));
    return wrap;
  }

  // grupo colapsável com todas as entradas de um dia passado
  function buildJournalDayGroup(dateStr, dayEntries) {
    const group = document.createElement("div");
    group.className = "journal-day-group";
    group.dataset.date = dateStr;

    const header = document.createElement("button");
    header.type = "button";
    header.className = "journal-day-header";

    const label = document.createElement("span");
    label.className = "journal-date";
    label.textContent = dateFmt.format(parseDateStr(dateStr));
    header.appendChild(label);

    const count = document.createElement("span");
    count.className = "journal-day-count";
    count.textContent = String(dayEntries.length);
    header.appendChild(count);

    const chevron = document.createElement("span");
    chevron.className = "journal-day-chevron";
    chevron.textContent = "›";
    header.appendChild(chevron);

    const body = document.createElement("div");
    body.className = "journal-day-body";
    dayEntries.forEach((entry) => body.appendChild(buildEntryBox(entry)));

    header.addEventListener("click", () => {
      group.classList.toggle("open");
    });

    group.appendChild(header);
    group.appendChild(body);
    return group;
  }

  function renderJournal() {
    const j = currentJournal();
    if (!j) return;
    journalInputLabel.textContent = j.withDates ? "Nova entrada" : "Nova nota";
    journalInput.placeholder = j.withDates ? "Como correu o dia?" : "Escreve uma nota…";

    journalEntries.innerHTML = "";
    const entries = state.journal.filter((e) => e.journalId === j.id);
    if (entries.length === 0) {
      const p = document.createElement("p");
      p.className = "empty-hint";
      p.textContent = j.withDates
        ? "Ainda sem entradas. Escreve a primeira acima."
        : "Ainda sem notas. Escreve a primeira acima.";
      journalEntries.appendChild(p);
      return;
    }

    if (!j.withDates) {
      const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
      sorted.forEach((entry) => journalEntries.appendChild(buildJournalEntryWrap(entry, null)));
      return;
    }

    const today = todayStr();
    const todayEntries = entries.filter((e) => e.date === today).sort((a, b) => b.createdAt - a.createdAt);
    todayEntries.forEach((entry) => journalEntries.appendChild(buildJournalEntryWrap(entry, "Hoje")));

    const byDate = {};
    entries
      .filter((e) => e.date !== today)
      .forEach((e) => {
        if (!byDate[e.date]) byDate[e.date] = [];
        byDate[e.date].push(e);
      });
    Object.keys(byDate)
      .sort((a, b) => (a < b ? 1 : -1))
      .forEach((ds) => {
        const dayEntries = byDate[ds].sort((a, b) => b.createdAt - a.createdAt);
        journalEntries.appendChild(buildJournalDayGroup(ds, dayEntries));
      });
  }

  journalSaveBtn.addEventListener("click", () => {
    const text = journalInput.value.trim();
    if (!text) return;
    const j = currentJournal();
    const entry = { id: uid(), text, date: selectedDate, createdAt: Date.now(), journalId: j.id };
    state.journal.push(entry);
    journalInput.value = "";
    save();
    bump(journalSaveBtn);
    journalSaveBtn.classList.add("pop");
    setTimeout(() => journalSaveBtn.classList.remove("pop"), 320);
    renderJournal();
    if (j.withDates && entry.date !== todayStr()) {
      const group = journalEntries.querySelector(`.journal-day-group[data-date="${entry.date}"]`);
      if (group) group.classList.add("open");
    }
    const newBox = journalEntries.querySelector(`.journal-entry[data-id="${entry.id}"]`);
    if (newBox) playEnter(newBox);
  });

  // ---------- Princípios (cartão interativo na Início, sem ecrã próprio) ----------
  let principleIndex = state.principles.findIndex((p) => p.isToday);
  if (principleIndex < 0) principleIndex = 0;
  let principleIsNewDraft = false;

  const principleTextEl = document.getElementById("principle-text");
  const principlePrevBtn = document.getElementById("principle-prev");
  const principleNextBtn = document.getElementById("principle-next");
  const principleCountEl = document.getElementById("principle-count");
  const principleAddBtn = document.getElementById("principle-add");
  const principleDeleteBtn = document.getElementById("principle-delete");

  function currentPrinciple() {
    if (state.principles.length === 0) return null;
    if (principleIndex >= state.principles.length) principleIndex = state.principles.length - 1;
    if (principleIndex < 0) principleIndex = 0;
    return state.principles[principleIndex];
  }

  function renderPrincipleCard() {
    const p = currentPrinciple();
    principleTextEl.textContent = p ? p.text : "";
    const total = state.principles.length;
    principleCountEl.textContent = total > 0 ? `${principleIndex + 1}/${total}` : "";
    principlePrevBtn.disabled = total <= 1;
    principleNextBtn.disabled = total <= 1;
    principleDeleteBtn.classList.toggle("hidden", total === 0);
  }

  principlePrevBtn.addEventListener("click", () => {
    if (state.principles.length === 0) return;
    principleIndex = (principleIndex - 1 + state.principles.length) % state.principles.length;
    markCurrentAsToday();
    renderPrincipleCard();
  });

  principleNextBtn.addEventListener("click", () => {
    if (state.principles.length === 0) return;
    principleIndex = (principleIndex + 1) % state.principles.length;
    markCurrentAsToday();
    renderPrincipleCard();
  });

  function markCurrentAsToday() {
    state.principles.forEach((p, i) => (p.isToday = i === principleIndex));
    save();
  }

  principleAddBtn.addEventListener("click", () => {
    const p = { id: uid(), text: "", isToday: false };
    state.principles.push(p);
    principleIndex = state.principles.length - 1;
    principleIsNewDraft = true;
    renderPrincipleCard();
    principleTextEl.focus();
  });

  principleDeleteBtn.addEventListener("click", () => {
    if (state.principles.length === 0) return;
    state.principles.splice(principleIndex, 1);
    if (principleIndex >= state.principles.length) principleIndex = Math.max(0, state.principles.length - 1);
    if (state.principles.length > 0) markCurrentAsToday();
    else save();
    renderPrincipleCard();
  });

  principleTextEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      principleTextEl.blur();
    }
  });

  principleTextEl.addEventListener("blur", () => {
    const val = principleTextEl.textContent.trim();
    const p = currentPrinciple();
    if (!val) {
      if (principleIsNewDraft && p) {
        state.principles.splice(principleIndex, 1);
        if (principleIndex >= state.principles.length) principleIndex = Math.max(0, state.principles.length - 1);
        save();
      }
      principleIsNewDraft = false;
      renderPrincipleCard();
      return;
    }
    if (p) {
      p.text = val;
    } else {
      const np = { id: uid(), text: val, isToday: true };
      state.principles.push(np);
      principleIndex = state.principles.length - 1;
    }
    principleIsNewDraft = false;
    markCurrentAsToday();
    renderPrincipleCard();
  });

  // ---------- Aviso de rotinas por completar ----------
  // Duas camadas: um aviso local (só funciona com a app aberta/em 2º plano) e,
  // se SUPABASE_URL estiver configurado, notificações push reais enviadas por
  // um GitHub Action agendado mesmo com a app fechada (ver NOTIFICACOES-SETUP.md).
  let lastNotifyAt = 0;
  const NOTIFY_COOLDOWN_MS = 20 * 60 * 1000;
  let pushSubscription = null;
  let pushSyncTimer = null;

  function pushConfigured() {
    return !SUPABASE_URL.startsWith("COLOCA_") && !SUPABASE_ANON_KEY.startsWith("COLOCA_");
  }

  function getDeviceId() {
    let id = localStorage.getItem("tlmDeviceId");
    if (!id) {
      id = uid() + uid();
      localStorage.setItem("tlmDeviceId", id);
    }
    return id;
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    const output = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) output[i] = rawData.charCodeAt(i);
    return output;
  }

  // envia (com debounce) o estado atual das rotinas + subscrição push para o
  // Supabase, para o GitHub Action conseguir decidir se envia notificação
  function syncPushState() {
    if (!pushConfigured() || !pushSubscription) return;
    clearTimeout(pushSyncTimer);
    pushSyncTimer = setTimeout(() => {
      const incomplete = incompleteRoutinesToday();
      const incompleteMorning = incompleteMorningRoutinesToday();
      const body = {
        id: getDeviceId(),
        subscription: pushSubscription.toJSON(),
        incomplete_count: incomplete,
        incomplete_text:
          incomplete === 1 ? "1 rotina por fazer hoje." : `${incomplete} rotinas por fazer hoje.`,
        incomplete_morning_count: incompleteMorning,
        incomplete_morning_text:
          incompleteMorning === 1 ? "1 rotina da manhã por fazer." : `${incompleteMorning} rotinas da manhã por fazer.`,
        agenda_events: state.events
          .filter((ev) => ev.time && ev.date >= todayStr())
          .map((ev) => ({ date: ev.date, time: ev.time, title: ev.title })),
        updated_at: new Date().toISOString()
      };
      fetch(`${SUPABASE_URL}/rest/v1/tlm_devices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "resolution=merge-duplicates"
        },
        body: JSON.stringify(body)
      }).catch(() => {});
    }, 800);
  }

  function subscribeForPush() {
    if (!pushConfigured()) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((existing) => {
        if (existing) {
          pushSubscription = existing;
          syncPushState();
          return;
        }
        reg.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
          })
          .then((sub) => {
            pushSubscription = sub;
            syncPushState();
          })
          .catch(() => {});
      });
    });
  }

  function incompleteRoutinesToday() {
    const t = todayStr();
    let count = 0;
    state.routines.forEach((r) => {
      routineSlots(r).forEach((s) => {
        if (!isSlotDone(r.id, t, s)) count++;
      });
    });
    return count;
  }

  // só conta sub-horários "Manhã" por fazer (para o aviso das 11:30)
  function incompleteMorningRoutinesToday() {
    const t = todayStr();
    let count = 0;
    state.routines.forEach((r) => {
      routineSlots(r).forEach((s) => {
        if (s === "Manhã" && !isSlotDone(r.id, t, s)) count++;
      });
    });
    return count;
  }

  function updateReminderBanner() {
    const banner = document.getElementById("notif-banner");
    if (!banner) return;
    const incomplete = incompleteRoutinesToday();
    if (state.routines.length === 0 || incomplete === 0) {
      banner.classList.add("hidden");
      syncPushState();
      return;
    }
    banner.classList.remove("hidden");
    const textEl = banner.querySelector(".notif-text");
    textEl.textContent =
      incomplete === 1 ? "Tens 1 rotina por fazer hoje." : `Tens ${incomplete} rotinas por fazer hoje.`;
    const btn = banner.querySelector(".notif-enable");
    if (btn) {
      const canAsk = "Notification" in window && Notification.permission === "default";
      btn.classList.toggle("hidden", !canAsk);
    }
    syncPushState();
  }

  function requestNotifPermission() {
    if (!("Notification" in window)) return;
    Notification.requestPermission().then((perm) => {
      updateReminderBanner();
      if (perm === "granted") subscribeForPush();
    });
  }

  function maybeFireBackgroundNotification() {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const incomplete = incompleteRoutinesToday();
    if (incomplete === 0) return;
    const now = Date.now();
    if (now - lastNotifyAt < NOTIFY_COOLDOWN_MS) return;
    lastNotifyAt = now;
    const body =
      incomplete === 1 ? "1 rotina por fazer hoje." : `${incomplete} rotinas por fazer hoje.`;
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready
        .then((reg) => reg.showNotification("tlm", { body, tag: "tlm-routines" }))
        .catch(() => {
          try { new Notification("tlm", { body }); } catch (e) {}
        });
    } else {
      try { new Notification("tlm", { body }); } catch (e) {}
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      maybeFireBackgroundNotification();
    } else {
      updateReminderBanner();
    }
  });

  const notifEnableBtn = document.getElementById("notif-enable-btn");
  if (notifEnableBtn) notifEnableBtn.addEventListener("click", requestNotifPermission);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
    if ("Notification" in window && Notification.permission === "granted") {
      subscribeForPush();
    }
  }

  // ---------- Agenda (mês + eventos por dia) ----------
  let agendaMonth = new Date();
  agendaMonth.setDate(1);
  let agendaSelectedDate = todayStr();

  const monthFmt = new Intl.DateTimeFormat("pt-PT", { month: "long", year: "numeric" });

  function renderAgendaMonth() {
    const grid = document.getElementById("agenda-grid");
    const label = document.getElementById("agenda-month-label");
    if (!grid || !label) return;
    label.textContent = monthFmt.format(agendaMonth);
    grid.innerHTML = "";

    const year = agendaMonth.getFullYear();
    const month = agendaMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // semana começa à segunda
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < startOffset; i++) {
      const blank = document.createElement("div");
      blank.className = "agenda-cell empty";
      grid.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const ds = toDateStr(d);
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className =
        "agenda-cell" +
        (ds === todayStr() ? " is-today" : "") +
        (ds === agendaSelectedDate ? " selected" : "");
      const hasEvents = state.events.some((ev) => ev.date === ds);
      const num = document.createElement("span");
      num.textContent = String(day);
      cell.appendChild(num);
      if (hasEvents) {
        const dot = document.createElement("span");
        dot.className = "agenda-dot";
        cell.appendChild(dot);
      }
      cell.addEventListener("click", () => selectAgendaDay(ds));
      grid.appendChild(cell);
    }
  }

  function selectAgendaDay(ds) {
    agendaSelectedDate = ds;
    renderAgendaMonth();
    renderAgendaEvents();
  }

  const AGENDA_ROW_H = 52;
  const AGENDA_BLOCK_H = 44;

  function renderAgendaEvents() {
    const untimedWrap = document.getElementById("agenda-untimed-wrap");
    const untimedList = document.getElementById("agenda-untimed-list");
    const timeline = document.getElementById("agenda-timeline");
    const scrollEl = document.getElementById("agenda-timeline-scroll");
    const label = document.getElementById("agenda-selected-label");
    if (!timeline || !label) return;
    label.textContent = dateFmt.format(parseDateStr(agendaSelectedDate));

    const dayEvents = state.events.filter((ev) => ev.date === agendaSelectedDate);
    const timed = dayEvents.filter((ev) => ev.time).sort((a, b) => a.time.localeCompare(b.time));
    const untimed = dayEvents.filter((ev) => !ev.time);

    // eventos sem hora, mostrados como lista simples acima da grelha
    untimedList.innerHTML = "";
    if (untimed.length === 0) {
      untimedWrap.classList.add("hidden");
    } else {
      untimedWrap.classList.remove("hidden");
      untimed.forEach((ev) => untimedList.appendChild(buildAgendaEvent(ev)));
    }

    // grelha de horas (0h-23h), ao estilo do calendário do iPhone
    timeline.innerHTML = "";
    timeline.style.height = `${24 * AGENDA_ROW_H}px`;

    for (let h = 0; h < 24; h++) {
      const row = document.createElement("div");
      row.className = "agenda-hour-row";
      const lbl = document.createElement("span");
      lbl.className = "agenda-hour-label";
      lbl.textContent = `${pad(h)}:00`;
      row.appendChild(lbl);
      row.addEventListener("click", (e) => {
        if (e.target !== row) return;
        const rect = row.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        const minute = Math.min(45, Math.round(((offsetY / AGENDA_ROW_H) * 60) / 15) * 15);
        document.getElementById("event-time-input").value = `${pad(h)}:${pad(minute)}`;
        document.getElementById("event-title-input").focus();
      });
      timeline.appendChild(row);
    }

    if (agendaSelectedDate === todayStr()) {
      const now = new Date();
      const top = ((now.getHours() * 60 + now.getMinutes()) / 60) * AGENDA_ROW_H;
      const nowLine = document.createElement("div");
      nowLine.className = "agenda-now-line";
      nowLine.style.top = `${top}px`;
      timeline.appendChild(nowLine);
    }

    timed.forEach((ev) => {
      const [hh, mm] = ev.time.split(":").map(Number);
      const top = ((hh * 60 + mm) / 60) * AGENDA_ROW_H;
      const block = buildAgendaEventBlock(ev);
      block.style.top = `${Math.min(top + 1, 24 * AGENDA_ROW_H - AGENDA_BLOCK_H)}px`;
      timeline.appendChild(block);
    });

    if (scrollEl) {
      requestAnimationFrame(() => {
        const targetHour = agendaSelectedDate === todayStr() ? new Date().getHours() : 8;
        scrollEl.scrollTop = Math.max(0, targetHour * AGENDA_ROW_H - AGENDA_ROW_H);
      });
    }
  }

  function buildAgendaEvent(ev) {
    const li = document.createElement("li");
    li.className = "agenda-event";
    li.dataset.id = ev.id;

    const time = document.createElement("span");
    time.className = "agenda-event-time";
    time.textContent = ev.time || "";

    const body = document.createElement("div");
    body.className = "agenda-event-body";
    const title = document.createElement("div");
    title.className = "agenda-event-title";
    title.textContent = ev.title;
    body.appendChild(title);
    if (ev.notes) {
      const notes = document.createElement("div");
      notes.className = "agenda-event-notes";
      notes.textContent = ev.notes;
      body.appendChild(notes);
    }

    const del = document.createElement("button");
    del.className = "item-delete";
    del.textContent = "×";
    del.addEventListener("click", () => {
      state.events = state.events.filter((x) => x.id !== ev.id);
      save();
      syncPushState();
      removeAnimated(li, () => {
        renderAgendaMonth();
        renderAgendaEvents();
      });
    });

    li.appendChild(time);
    li.appendChild(body);
    li.appendChild(del);
    return li;
  }

  function buildAgendaEventBlock(ev) {
    const div = document.createElement("div");
    div.className = "agenda-event-block";
    div.style.height = `${AGENDA_BLOCK_H}px`;
    div.dataset.id = ev.id;

    const time = document.createElement("span");
    time.className = "agenda-event-block-time";
    time.textContent = ev.time;
    div.appendChild(time);

    const title = document.createElement("span");
    title.className = "agenda-event-block-title";
    title.textContent = ev.title;
    div.appendChild(title);

    const del = document.createElement("button");
    del.type = "button";
    del.className = "agenda-event-block-delete";
    del.textContent = "×";
    del.addEventListener("click", (e) => {
      e.stopPropagation();
      state.events = state.events.filter((x) => x.id !== ev.id);
      save();
      syncPushState();
      renderAgendaMonth();
      renderAgendaEvents();
    });
    div.appendChild(del);

    return div;
  }

  const agendaPrevBtn = document.getElementById("agenda-prev");
  const agendaNextBtn = document.getElementById("agenda-next");
  if (agendaPrevBtn) {
    agendaPrevBtn.addEventListener("click", () => {
      agendaMonth = new Date(agendaMonth.getFullYear(), agendaMonth.getMonth() - 1, 1);
      renderAgendaMonth();
    });
  }
  if (agendaNextBtn) {
    agendaNextBtn.addEventListener("click", () => {
      agendaMonth = new Date(agendaMonth.getFullYear(), agendaMonth.getMonth() + 1, 1);
      renderAgendaMonth();
    });
  }

  const eventForm = document.getElementById("event-form");
  if (eventForm) {
    eventForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const titleInput = document.getElementById("event-title-input");
      const timeInput = document.getElementById("event-time-input");
      const notesInput = document.getElementById("event-notes-input");
      const title = titleInput.value.trim();
      if (!title) return;
      const ev = {
        id: uid(),
        date: agendaSelectedDate,
        time: timeInput.value || null,
        title,
        notes: notesInput.value.trim()
      };
      state.events.push(ev);
      titleInput.value = "";
      timeInput.value = "";
      notesInput.value = "";
      save();
      syncPushState();
      renderAgendaMonth();
      renderAgendaEvents();
    });
  }

  // ---------- Init ----------
  buildDayStrip();
  updateDateLabel();
  document.getElementById("today-date").addEventListener("click", () => {
    selectDate(todayStr());
  });

  renderRoutines();
  renderGoals();
  renderWeightList();
  renderReminders();
  renderJournalTabs();
  renderJournal();
  renderPrincipleCard();
  renderAgendaMonth();
  renderAgendaEvents();
  updateReminderBanner();

  requestAnimationFrame(() => {
    positionNavIndicator(currentView);
    positionTabIndicator();
  });
})();
