// Resolve the extension API across browsers:
//   Firefox exposes `browser` (promise-based); Chrome/Vivaldi/Brave expose `chrome`.
const ext = (typeof browser !== "undefined") ? browser : chrome;

const baseInput = document.getElementById("base");
const scrapeBtn = document.getElementById("scrape");
const grantBtn  = document.getElementById("grant");
const statusEl  = document.getElementById("status");

const ALL = { origins: ["<all_urls>"] };

function setStatus(msg, kind) {
  statusEl.textContent = msg;
  if (kind) statusEl.dataset.kind = kind;
  else statusEl.removeAttribute("data-kind");
}

// This function is serialized and injected into each tab. It must be fully
// self-contained — it cannot reference anything outside its own body except
// the argument passed in via `args`.
function collectLinks(base) {
  const out = [];
  const seen = new Set();
  const anchors = document.querySelectorAll("a[href]");
  for (const a of anchors) {
    const href = a.href; // browser resolves this to an absolute URL
    if (href && href.startsWith(base) && !seen.has(href)) {
      seen.add(href);
      out.push(href);
    }
  }
  return out;
}

async function hasAccess() {
  try { return await ext.permissions.contains(ALL); }
  catch (e) { return false; }
}

async function refreshAccessUI() {
  const ok = await hasAccess();
  grantBtn.hidden = ok;
  return ok;
}

async function init() {
  // Prefill the filter with the active tab's origin as a convenient starting point.
  try {
    const [active] = await ext.tabs.query({ active: true, currentWindow: true });
    if (active && active.url && /^https?:/i.test(active.url)) {
      baseInput.value = new URL(active.url).origin + "/";
    }
  } catch (e) { /* leave blank */ }

  baseInput.focus();
  baseInput.select();
  await refreshAccessUI();
}

grantBtn.addEventListener("click", async () => {
  try {
    const granted = await ext.permissions.request(ALL);
    await refreshAccessUI();
    setStatus(
      granted ? "Access granted. Ready to scrape." : "Access not granted — some tabs may be skipped.",
      granted ? "ok" : "warn"
    );
  } catch (e) {
    setStatus("Could not request access: " + e.message, "warn");
  }
});

scrapeBtn.addEventListener("click", async () => {
  const base = baseInput.value.trim();
  if (!base) {
    setStatus("Enter a base URL first.", "warn");
    baseInput.focus();
    return;
  }

  scrapeBtn.disabled = true;

  let tabs = [];
  try {
    // "highlighted" = the tabs you've multi-selected with Ctrl/Cmd/Shift-click.
    // The active tab is always highlighted, so a single tab works too.
    tabs = await ext.tabs.query({ highlighted: true, currentWindow: true });
  } catch (e) {
    setStatus("Could not read tabs: " + e.message, "warn");
    scrapeBtn.disabled = false;
    return;
  }

  setStatus("Scanning " + tabs.length + (tabs.length === 1 ? " tab…" : " tabs…"), "busy");

  const merged = new Set(); // global de-dupe, preserves first-seen order
  let scanned = 0;
  let skipped = 0;

  for (const tab of tabs) {
    try {
      const results = await ext.scripting.executeScript({
        target: { tabId: tab.id },
        func: collectLinks,
        args: [base]
      });
      const links = (results && results[0] && results[0].result) || [];
      for (const link of links) merged.add(link);
      scanned++;
    } catch (e) {
      // Privileged pages (about:, chrome://, the add-ons page, PDF viewer,
      // reader view) can't be injected into — skip them quietly.
      skipped++;
    }
  }

  if (merged.size === 0) {
    const accessOk = await hasAccess();
    if (!accessOk && skipped > 0) {
      setStatus('Tabs were blocked. Click "Grant access to sites" above, then scrape again.', "warn");
    } else {
      let msg = "No matching links across " + scanned + (scanned === 1 ? " tab." : " tabs.");
      if (skipped) msg += " (" + skipped + " skipped — browser/system pages)";
      setStatus(msg, "warn");
    }
    scrapeBtn.disabled = false;
    return;
  }

  const text = Array.from(merged).join("\n") + "\n";

  try {
    // Download via a temporary <a download> link rather than the downloads API.
    // This grabs the data the instant we click, so it still works in Firefox even
    // though the popup closes (wiping the blob) the moment the Save dialog takes
    // focus. The downloads API reads the blob too late and fails there.
    //
    // Whether a "choose folder + name" dialog appears is controlled by the
    // browser's download setting ("Always ask you where to save files"). When
    // that's off, the file saves straight to the Downloads folder instead.
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filtered_urls.txt"; // suggested filename
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => { try { URL.revokeObjectURL(url); } catch (e) {} }, 60000);

    let msg = merged.size + " unique URL" + (merged.size === 1 ? "" : "s") +
              " from " + scanned + (scanned === 1 ? " tab" : " tabs") + " sent to download.";
    if (skipped) msg += " · " + skipped + " skipped";
    setStatus(msg, "ok");
  } catch (e) {
    setStatus("Download failed: " + (e && e.message ? e.message : e), "warn");
  } finally {
    scrapeBtn.disabled = false;
  }
});

init();
