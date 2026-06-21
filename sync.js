(function initSync(global) {
  const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const SESSION_KEY = "rj-pq-party-session-v1";

  let db = null;
  let partyListenerRef = null;
  let connectedListenerRef = null;
  let passwordHash = null;
  let applyingRemote = false;

  function isConfigured() {
    const config = global.FIREBASE_CONFIG;
    return Boolean(
      config?.databaseURL &&
        config?.apiKey &&
        config.apiKey !== "YOUR_API_KEY"
    );
  }

  function initFirebase() {
    if (!isConfigured()) return null;
    if (!db) {
      if (!global.firebase?.apps?.length) {
        global.firebase.initializeApp(global.FIREBASE_CONFIG);
      }
      db = global.firebase.database();
    }
    return db;
  }

  async function hashPassword(password) {
    const data = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function generatePartyCode() {
    let code = "";
    for (let i = 0; i < 6; i += 1) {
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
    return code;
  }

  function normalizeRooms(rooms) {
    if (!Array.isArray(rooms) || rooms.length !== 4) return null;
    const normalized = rooms.map((room) => {
      if (!Array.isArray(room) || room.length !== 10) return null;
      return room.map((row) => {
        if (!Array.isArray(row) || row.length !== 4) return null;
        return row.map((cell) => (cell === "success" || cell === "fail" ? cell : null));
      });
    });
    return normalized.some((room) => !room) ? null : normalized;
  }

  function saveSession(partyId) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ partyId }));
  }

  function loadSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.partyId ? parsed : null;
    } catch {
      return null;
    }
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function partyRef(partyId) {
    return initFirebase().ref(`parties/${partyId}`);
  }

  function stopListeners() {
    if (partyListenerRef) {
      partyListenerRef.off();
      partyListenerRef = null;
    }
    if (connectedListenerRef) {
      connectedListenerRef.off();
      connectedListenerRef = null;
    }
  }

  async function createParty(password, emptyRooms) {
    const firebase = initFirebase();
    if (!firebase) throw new Error("not_configured");

    const hash = await hashPassword(password);
    passwordHash = hash;

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const partyId = generatePartyCode();
      const ref = partyRef(partyId);
      const result = await ref.transaction((current) => {
        if (current) return undefined;
        return {
          passwordHash: hash,
          rooms: emptyRooms,
          updatedAt: firebase.database.ServerValue.TIMESTAMP,
        };
      });

      if (result.committed) {
        saveSession(partyId);
        return partyId;
      }
    }

    throw new Error("create_failed");
  }

  async function joinParty(partyId, password) {
    if (!initFirebase()) throw new Error("not_configured");

    const normalizedId = partyId.trim().toUpperCase();
    const snapshot = await partyRef(normalizedId).once("value");
    const data = snapshot.val();

    if (!data) throw new Error("not_found");

    const hash = await hashPassword(password);
    if (hash !== data.passwordHash) throw new Error("wrong_password");

    passwordHash = hash;
    saveSession(normalizedId);
    return { partyId: normalizedId, rooms: normalizeRooms(data.rooms) };
  }

  function subscribe(partyId, onRoomsChange, onStatusChange) {
    stopListeners();

    const firebase = initFirebase();
    if (!firebase) return;

    partyListenerRef = partyRef(partyId);
    connectedListenerRef = firebase.ref(".info/connected");

    connectedListenerRef.on("value", (snap) => {
      onStatusChange(Boolean(snap.val()));
    });

    partyListenerRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        onStatusChange(false, "closed");
        return;
      }

      const rooms = normalizeRooms(data.rooms);
      if (!rooms) return;

      applyingRemote = true;
      onRoomsChange(rooms);
      applyingRemote = false;
    });
  }

  async function pushRooms(partyId, rooms) {
    if (applyingRemote || !passwordHash) return;

    const firebase = initFirebase();
    if (!firebase) return;

    await partyRef(partyId).update({
      passwordHash,
      rooms,
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
    });
  }

  function leaveParty() {
    stopListeners();
    passwordHash = null;
    clearSession();
  }

  global.PartySync = {
    isConfigured,
    createParty,
    joinParty,
    subscribe,
    pushRooms,
    leaveParty,
    loadSession,
  };
})(window);
