/* OpsOh Tools – CSV to VCF (client-side)
   Launch phase is free; monetization is designed in from day 1.
*/

const CONFIG = {
  // Phase 1: keep true (free download).
  // Phase 2: set to false and wire Stripe Checkout (see TODO below).
  LAUNCH_FREE: true,

  // Phase 2 (future):
  // PRICE_LABEL: "$5 one-time",
  // STRIPE_CHECKOUT_URL: "https://buy.stripe.com/XXXX", // TODO
  PREVIEW_LIMIT: 10,
};

const els = {
  year: document.getElementById("year"),
  status: document.getElementById("statusPill"),
  launchNote: document.getElementById("launchNote"),
  csvFile: document.getElementById("csvFile"),
  fileMeta: document.getElementById("fileMeta"),

  colFullName: document.getElementById("colFullName"),
  colFirstName: document.getElementById("colFirstName"),
  colLastName: document.getElementById("colLastName"),
  colPhone: document.getElementById("colPhone"),
  colEmail: document.getElementById("colEmail"),

  btnPreview: document.getElementById("btnPreview"),
  btnUnlock: document.getElementById("btnUnlock"),
  btnDownload: document.getElementById("btnDownload"),

  previewCard: document.getElementById("previewCard"),
  previewCount: document.getElementById("previewCount"),
  previewTableBody: document.querySelector("#previewTable tbody"),
};

let parsed = {
  headers: [],
  rows: [], // array of objects keyed by header
};

let generated = {
  vcfText: "",
  filename: "contacts.vcf",
};

function setStatus(text, kind = "neutral") {
  els.status.textContent = text;
  els.status.style.borderColor = "rgba(255,255,255,0.14)";
  els.status.style.background = "rgba(255,255,255,0.05)";
  if (kind === "ok") {
    els.status.style.borderColor = "rgba(64,209,123,0.35)";
    els.status.style.background = "rgba(64,209,123,0.12)";
  } else if (kind === "warn") {
    els.status.style.borderColor = "rgba(255,200,87,0.35)";
    els.status.style.background = "rgba(255,200,87,0.12)";
  } else if (kind === "bad") {
    els.status.style.borderColor = "rgba(255,92,122,0.35)";
    els.status.style.background = "rgba(255,92,122,0.12)";
  }
}

function escapeVCard(value) {
  if (!value) return "";
  // Escape commas, semicolons, and newlines per vCard needs.
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}

function downloadTextFile(text, filename, mime = "text/vcard") {
  const blob = new Blob([text], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 1500);
}

function buildSelectOptions(selectEl, headers) {
  selectEl.innerHTML = "";
  const none = document.createElement("option");
  none.value = "";
  none.textContent = "— None —";
  selectEl.appendChild(none);

  headers.forEach((h) => {
    const opt = document.createElement("option");
    opt.value = h;
    opt.textContent = h;
    selectEl.appendChild(opt);
  });
}

function guessColumn(headers, patterns) {
  const lower = headers.map(h => ({ h, l: h.toLowerCase().trim() }));
  for (const p of patterns) {
    const found = lower.find(x => x.l === p || x.l.includes(p));
    if (found) return found.h;
  }
  return "";
}

/** Robust-enough CSV parser for common exports.
 * Supports quoted fields and commas inside quotes.
 */
function parseCSV(text) {
  // Use a simple state machine; avoids needing external libs.
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        field = "";
        // Skip empty trailing row
        if (row.length > 1 || row.some(x => x.trim() !== "")) rows.push(row);
        row = [];
      } else if (c === "\r") {
        // ignore
      } else {
        field += c;
      }
    }
  }

  // Final field
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.length > 1 || row.some(x => x.trim() !== "")) rows.push(row);
  }

  if (rows.length === 0) return { headers: [], data: [] };

  const headers = rows[0].map(h => h.trim()).filter(Boolean);
  const data = rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, idx) => obj[h] = (r[idx] ?? "").trim());
    return obj;
  });

  return { headers, data };
}

function buildVCF(rows, mapping) {
  const lines = [];
  let count = 0;

  for (const r of rows) {
    const fullName = (mapping.fullName && r[mapping.fullName]) ? r[mapping.fullName].trim() : "";
    const first = (mapping.firstName && r[mapping.firstName]) ? r[mapping.firstName].trim() : "";
    const last = (mapping.lastName && r[mapping.lastName]) ? r[mapping.lastName].trim() : "";
    const phone = (mapping.phone && r[mapping.phone]) ? r[mapping.phone].trim() : "";
    const email = (mapping.email && r[mapping.email]) ? r[mapping.email].trim() : "";

    // Skip empty contacts
    if (!fullName && !first && !last && !phone && !email) continue;

    const displayName = fullName || [first, last].filter(Boolean).join(" ").trim() || "Contact";
    const nLast = last || "";
    const nFirst = first || (fullName ? fullName.split(" ")[0] : "");
    const nRest = ""; // middle, prefix, suffix unsupported for v1

    lines.push("BEGIN:VCARD");
    lines.push("VERSION:3.0");
    lines.push(`FN:${escapeVCard(displayName)}`);
    lines.push(`N:${escapeVCard(nLast)};${escapeVCard(nFirst)};${nRest};;`);

    if (phone) lines.push(`TEL;TYPE=CELL:${escapeVCard(phone)}`);
    if (email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCard(email)}`);

    lines.push("END:VCARD");
    count++;
  }

  return { text: lines.join("\n"), count };
}

function renderPreview(rows, mapping) {
  const limit = CONFIG.PREVIEW_LIMIT;
  els.previewCount.textContent = String(limit);
  els.previewTableBody.innerHTML = "";

  const slice = rows.slice(0, limit);
  slice.forEach((r, idx) => {
    const tr = document.createElement("tr");
    const fullName = (mapping.fullName && r[mapping.fullName]) ? r[mapping.fullName] : "";
    const first = (mapping.firstName && r[mapping.firstName]) ? r[mapping.firstName] : "";
    const last = (mapping.lastName && r[mapping.lastName]) ? r[mapping.lastName] : "";
    const phone = (mapping.phone && r[mapping.phone]) ? r[mapping.phone] : "";
    const email = (mapping.email && r[mapping.email]) ? r[mapping.email] : "";

    const displayName = (fullName || [first, last].filter(Boolean).join(" ").trim() || "—");

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escapeHtml(displayName)}</td>
      <td>${escapeHtml(phone || "—")}</td>
      <td>${escapeHtml(email || "—")}</td>
    `;
    els.previewTableBody.appendChild(tr);
  });

  els.previewCard.style.display = "block";
}

function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getMapping() {
  return {
    fullName: els.colFullName.value,
    firstName: els.colFirstName.value,
    lastName: els.colLastName.value,
    phone: els.colPhone.value,
    email: els.colEmail.value,
  };
}

function setDefaultsFromHeaders(headers) {
  // Populate selects
  [els.colFullName, els.colFirstName, els.colLastName, els.colPhone, els.colEmail].forEach(sel => {
    buildSelectOptions(sel, headers);
  });

  // Guess mapping
  els.colFullName.value = guessColumn(headers, ["full name", "name", "contact", "display name"]);
  els.colFirstName.value = guessColumn(headers, ["first", "first name", "given", "given name"]);
  els.colLastName.value = guessColumn(headers, ["last", "last name", "surname", "family"]);
  els.colPhone.value = guessColumn(headers, ["phone", "mobile", "cell", "telephone", "tel"]);
  els.colEmail.value = guessColumn(headers, ["email", "e-mail"]);

  // Enable buttons
  els.btnPreview.disabled = false;
  els.btnDownload.disabled = false;
}

function updateMonetizationUI() {
  if (CONFIG.LAUNCH_FREE) {
    els.launchNote.innerHTML = "Launch mode: <strong>Free</strong> (limited-time)";
    els.btnUnlock.style.display = "none";
    els.btnDownload.textContent = "Download VCF";
    return;
  }

  // Phase 2 (future): gate downloads unless unlocked.
  const unlocked = localStorage.getItem("opsoh_csv_vcf_unlocked") === "1";
  els.launchNote.innerHTML = `Pricing: <strong>One-time unlock</strong>`;
  els.btnUnlock.style.display = unlocked ? "none" : "inline-flex";
  els.btnDownload.textContent = unlocked ? "Download VCF" : "Download Preview Only";
}

function handleFile(file) {
  els.fileMeta.textContent = file ? `${file.name} (${Math.round(file.size/1024)} KB)` : "No file selected";
  if (!file) return;

  setStatus("Reading…", "warn");

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const text = String(reader.result || "");
      const out = parseCSV(text);

      if (!out.headers.length) {
        setStatus("Invalid CSV", "bad");
        alert("We couldn't detect headers. Please export a CSV with a header row.");
        return;
      }

      parsed.headers = out.headers;
      parsed.rows = out.data;

      setDefaultsFromHeaders(parsed.headers);
      setStatus("Loaded", "ok");

      const safeName = file.name.replace(/\.csv$/i, "");
      generated.filename = `${safeName || "contacts"}.vcf`;

      updateMonetizationUI();
    } catch (e) {
      console.error(e);
      setStatus("Error", "bad");
      alert("Something went wrong parsing this CSV. Try a different export format.");
    }
  };
  reader.onerror = () => {
    setStatus("Read failed", "bad");
    alert("Could not read file.");
  };

  reader.readAsText(file);
}

function refreshGenerated() {
  const mapping = getMapping();
  const res = buildVCF(parsed.rows, mapping);
  generated.vcfText = res.text || "";
  return res;
}

function preview() {
  if (!parsed.rows.length) return;

  const mapping = getMapping();
  renderPreview(parsed.rows, mapping);

  const res = refreshGenerated();
  if (res.count === 0) {
    setStatus("No contacts found", "warn");
  } else {
    setStatus(`Ready (${res.count} contacts)`, "ok");
  }
}

function download() {
  if (!parsed.rows.length) return;

  const mapping = getMapping();
  const res = buildVCF(parsed.rows, mapping);

  if (CONFIG.LAUNCH_FREE) {
    if (!res.text) {
      alert("No contacts to export.");
      return;
    }
    downloadTextFile(res.text, generated.filename);
    return;
  }

  // Phase 2 (future):
  const unlocked = localStorage.getItem("opsoh_csv_vcf_unlocked") === "1";
  if (unlocked) {
    downloadTextFile(res.text, generated.filename);
    return;
  }

  // Not unlocked: download preview only
  const previewRows = parsed.rows.slice(0, CONFIG.PREVIEW_LIMIT);
  const previewRes = buildVCF(previewRows, mapping);
  downloadTextFile(previewRes.text, "preview-" + generated.filename);
  alert("Preview downloaded. Unlock to download the full file.");
}

function unlock() {
  // Phase 2 TODO:
  // 1) Create a Stripe Checkout payment link
  // 2) Put URL into CONFIG.STRIPE_CHECKOUT_URL
  // 3) Redirect user there
  // 4) After success, redirect back to this page with a query param like ?unlocked=1
  // 5) On load, detect it and store localStorage flag to enable full downloads

  alert("Unlock is coming soon. Launch is currently free.");
}

function init() {
  els.year.textContent = String(new Date().getFullYear());

  updateMonetizationUI();

  els.csvFile.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    handleFile(file);
  });

  els.btnPreview.addEventListener("click", preview);
  els.btnDownload.addEventListener("click", download);
  els.btnUnlock.addEventListener("click", unlock);

  // If you later redirect back from Stripe success, you can set ?unlocked=1
  const params = new URLSearchParams(window.location.search);
  if (params.get("unlocked") === "1") {
    localStorage.setItem("opsoh_csv_vcf_unlocked", "1");
    // Clean URL (optional)
    const clean = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, clean);
    updateMonetizationUI();
    setStatus("Unlocked", "ok");
  }
}

init();
