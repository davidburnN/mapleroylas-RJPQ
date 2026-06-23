const COLS = 4;
const ROWS = 10;
const ROOM_COUNT = 4;
const STORAGE_KEY = "rj-pq-platform-memory-v1";
const LANG_KEY = "rj-pq-lang";

const messages = {
  "zh-TW": {
    documentTitle: "羅密歐與茱麗葉 · 平台記憶",
    title: "羅密歐與茱麗葉",
    subtitle: "平台記憶工具 · 四房間 4×10",
    legendSuccess: "左鍵：我成功的平台",
    legendFail: "右鍵：他人成功 / 我失敗",
    legendClear: "再點一次：清除標記",
    roomNavLabel: "房間選擇",
    room: (n) => `房間 ${n}`,
    success: (n) => `成功 ${n}`,
    fail: (n) => `失敗 ${n}`,
    remaining: (n) => `未試 ${n}`,
    col: (n) => `列 ${n}`,
    cellLabel: (row, col) => `第 ${row} 排，第 ${col} 列`,
    gridLabel: "平台格子",
    clearRoom: "清除此房間",
    undoRoom: "回復此房間",
    clearAll: "清除全部房間",
    footerAutosave: "資料自動儲存於瀏覽器本機 · 關閉後仍保留",
    confirmClearRoom: (n) => `確定要清除房間 ${n} 的所有標記嗎？`,
    confirmClearAll: "確定要清除全部四個房間的記錄嗎？",
    langSwitch: "EN",
    langSwitchAria: "切換為英文",
  },
  en: {
    documentTitle: "Romeo & Juliet · Platform Memory",
    title: "Romeo & Juliet",
    subtitle: "Platform tracker · 4 rooms, 4×10",
    legendSuccess: "Left click: my success",
    legendFail: "Right click: others' success / my fail",
    legendClear: "Click again: clear mark",
    roomNavLabel: "Room selection",
    room: (n) => `Room ${n}`,
    success: (n) => `Success ${n}`,
    fail: (n) => `Fail ${n}`,
    remaining: (n) => `Untried ${n}`,
    col: (n) => `Col ${n}`,
    cellLabel: (row, col) => `Row ${row}, Col ${col}`,
    gridLabel: "Platform grid",
    clearRoom: "Clear this room",
    undoRoom: "Undo this room",
    clearAll: "Clear all rooms",
    footerAutosave: "Data auto-saved locally · persists after closing",
    confirmClearRoom: (n) => `Clear all marks in room ${n}?`,
    confirmClearAll: "Clear all records in all four rooms?",
    langSwitch: "中文",
    langSwitchAria: "Switch to Chinese",
  },
};

function loadLanguage() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "zh-TW" || saved === "en") return saved;
  return navigator.language.startsWith("zh") ? "zh-TW" : "en";
}

const state = {
  currentRoom: 0,
  lang: loadLanguage(),
  rooms: loadState(),
  lastClearedRoomSnapshot: null,
};

function t(key, ...args) {
  const value = messages[state.lang][key];
  return typeof value === "function" ? value(...args) : value;
}

const els = {
  roomTabs: document.getElementById("roomTabs"),
  roomTitle: document.getElementById("roomTitle"),
  colLabels: document.getElementById("colLabels"),
  rowLabels: document.getElementById("rowLabels"),
  platformGrid: document.getElementById("platformGrid"),
  successCount: document.getElementById("successCount"),
  failCount: document.getElementById("failCount"),
  remainingCount: document.getElementById("remainingCount"),
  clearRoomBtn: document.getElementById("clearRoomBtn"),
  undoRoomBtn: document.getElementById("undoRoomBtn"),
  clearAllBtn: document.getElementById("clearAllBtn"),
  pageTitle: document.getElementById("pageTitle"),
  pageSubtitle: document.getElementById("pageSubtitle"),
  legendSuccess: document.getElementById("legendSuccess"),
  legendFail: document.getElementById("legendFail"),
  legendClear: document.getElementById("legendClear"),
  footerText: document.getElementById("footerText"),
  langToggle: document.getElementById("langToggle"),
};

function createEmptyRoom() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function createEmptyRooms() {
  return Array.from({ length: ROOM_COUNT }, createEmptyRoom);
}

function cloneRoom(room) {
  return room.map((row) => [...row]);
}

function normalizeRooms(rooms) {
  if (!Array.isArray(rooms) || rooms.length !== ROOM_COUNT) return createEmptyRooms();
  return rooms.map((room) => {
    if (!Array.isArray(room) || room.length !== ROWS) return createEmptyRoom();
    return room.map((row) => {
      if (!Array.isArray(row) || row.length !== COLS) return Array(COLS).fill(null);
      return row.map((cell) => (cell === "success" || cell === "fail" ? cell : null));
    });
  });
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyRooms();
    return normalizeRooms(JSON.parse(raw));
  } catch {
    return createEmptyRooms();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.rooms));
}

function saveLanguage() {
  localStorage.setItem(LANG_KEY, state.lang);
}

function countRoomStats(room) {
  let success = 0;
  let fail = 0;

  for (const row of room) {
    for (const cell of row) {
      if (cell === "success") success += 1;
      if (cell === "fail") fail += 1;
    }
  }

  return {
    success,
    fail,
    remaining: COLS * ROWS - success - fail,
  };
}

function renderStaticText() {
  document.documentElement.lang = state.lang;
  document.title = t("documentTitle");
  els.pageTitle.textContent = t("title");
  els.pageSubtitle.textContent = t("subtitle");
  els.legendSuccess.textContent = t("legendSuccess");
  els.legendFail.textContent = t("legendFail");
  els.legendClear.textContent = t("legendClear");
  els.roomTabs.setAttribute("aria-label", t("roomNavLabel"));
  els.platformGrid.setAttribute("aria-label", t("gridLabel"));
  els.clearRoomBtn.textContent = t("clearRoom");
  els.undoRoomBtn.textContent = t("undoRoom");
  els.clearAllBtn.textContent = t("clearAll");
  els.footerText.textContent = t("footerAutosave");
  els.langToggle.textContent = t("langSwitch");
  els.langToggle.setAttribute("aria-label", t("langSwitchAria"));
}

function renderTabs() {
  els.roomTabs.innerHTML = "";

  state.rooms.forEach((room, index) => {
    const stats = countRoomStats(room);
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = `room-tab${index === state.currentRoom ? " active" : ""}`;
    tab.innerHTML = `
      ${t("room", index + 1)}
      <span class="room-tab__badge">✓${stats.success} ✕${stats.fail}</span>
    `;
    tab.addEventListener("click", () => {
      state.currentRoom = index;
      render();
    });
    els.roomTabs.appendChild(tab);
  });
}

function renderLabels() {
  els.colLabels.innerHTML = `<span></span>${Array.from({ length: COLS }, (_, i) => `<span>${t("col", i + 1)}</span>`).join("")}`;
  els.rowLabels.innerHTML = Array.from({ length: ROWS }, (_, i) => `<span>${ROWS - i}</span>`).join("");
}

function renderGrid() {
  const room = state.rooms[state.currentRoom];
  els.platformGrid.innerHTML = "";

  for (let displayRow = 0; displayRow < ROWS; displayRow += 1) {
    const rowIndex = ROWS - 1 - displayRow;
    const row = room[rowIndex];

    row.forEach((cell, colIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "platform-cell";
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-label", t("cellLabel", rowIndex + 1, colIndex + 1));

      if (cell === "success") button.classList.add("platform-cell--success");
      if (cell === "fail") button.classList.add("platform-cell--fail");

      button.addEventListener("click", (event) => {
        event.preventDefault();
        handleCellClick(rowIndex, colIndex, "success");
      });

      button.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        handleCellClick(rowIndex, colIndex, "fail");
      });

      els.platformGrid.appendChild(button);
    });
  }
}

function renderStats() {
  const stats = countRoomStats(state.rooms[state.currentRoom]);
  els.roomTitle.textContent = t("room", state.currentRoom + 1);
  els.successCount.textContent = t("success", stats.success);
  els.failCount.textContent = t("fail", stats.fail);
  els.remainingCount.textContent = t("remaining", stats.remaining);
  els.undoRoomBtn.disabled = state.lastClearedRoomSnapshot?.roomIndex !== state.currentRoom;
}

function handleCellClick(row, col, target) {
  const room = state.rooms[state.currentRoom];
  const current = room[row][col];
  room[row][col] = current === target ? null : target;
  saveState();
  render();
}

function clearRoom(roomIndex) {
  state.lastClearedRoomSnapshot = {
    roomIndex,
    roomData: cloneRoom(state.rooms[roomIndex]),
  };
  state.rooms[roomIndex] = createEmptyRoom();
  saveState();
  render();
}

function undoClearRoom(roomIndex) {
  if (state.lastClearedRoomSnapshot?.roomIndex !== roomIndex) return;
  state.rooms[roomIndex] = cloneRoom(state.lastClearedRoomSnapshot.roomData);
  state.lastClearedRoomSnapshot = null;
  saveState();
  render();
}

function clearAllRooms() {
  if (!confirm(t("confirmClearAll"))) return;
  state.rooms = createEmptyRooms();
  saveState();
  render();
}

function toggleLanguage() {
  state.lang = state.lang === "zh-TW" ? "en" : "zh-TW";
  saveLanguage();
  render();
}

function render() {
  renderStaticText();
  renderTabs();
  renderLabels();
  renderGrid();
  renderStats();
}

function safeListen(element, eventName, handler, elementName) {
  if (!element) {
    console.warn(`[app] Missing element: ${elementName}`);
    return;
  }
  element.addEventListener(eventName, handler);
}

safeListen(
  els.clearRoomBtn,
  "click",
  () => clearRoom(state.currentRoom),
  "clearRoomBtn"
);
safeListen(els.undoRoomBtn, "click", () => undoClearRoom(state.currentRoom), "undoRoomBtn");
safeListen(els.clearAllBtn, "click", clearAllRooms, "clearAllBtn");
safeListen(els.langToggle, "click", toggleLanguage, "langToggle");

render();
