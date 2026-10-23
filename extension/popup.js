const api = globalThis.browser ?? globalThis.chrome;
const main = document.querySelector("main");
const ready = document.querySelector("#ready");
const form = document.querySelector("#key-form");
const input = document.querySelector("#api-key");
const save = form.querySelector(".save");
const saveLabel = save.querySelector(".save-label");
const replace = document.querySelector("#replace");
const cancel = document.querySelector("#cancel");
const status = document.querySelector("#status");
const keyError = document.querySelector("#key-error");
const toggleKey = document.querySelector("#toggle-key");
const update = document.querySelector("#update");
const checkUpdate = document.querySelector("#check-update");
const manifest = api.runtime.getManifest();
const RELEASES = "https://github.com/canmenzo/explain/releases";

function showStatus(message, state = "") {
  status.textContent = message;
  status.dataset.state = state;
}

// setup: no key yet. ready: key saved. replacing: key saved and the form is open to swap it.
function render(state) {
  main.dataset.state = state;
  ready.hidden = state === "setup";
  form.hidden = state === "ready";
  replace.hidden = state !== "ready";
  replace.setAttribute("aria-expanded", String(state === "replacing"));
  cancel.hidden = state !== "replacing";
  input.placeholder = state === "replacing" ? "Paste a new key" : "Paste your key";
  if (state !== "ready") input.focus();
}

function resetInput() {
  input.value = "";
  input.removeAttribute("aria-invalid");
  keyError.hidden = true;
  setVisible(false);
}

function setVisible(visible) {
  input.type = visible ? "text" : "password";
  toggleKey.setAttribute("aria-label", visible ? "Hide API key" : "Show API key");
  toggleKey.setAttribute("aria-pressed", String(visible));
}

api.storage.local.get("geminiKey").then((value) => {
  render(value.geminiKey ? "ready" : "setup");
}).catch(() => {
  render("setup");
  showStatus("Could not read your saved key. Reopen Explain to try again.", "error");
});

toggleKey.addEventListener("click", () => setVisible(input.type === "password"));

replace.addEventListener("click", () => {
  showStatus("");
  render("replacing");
});

cancel.addEventListener("click", () => {
  resetInput();
  showStatus("");
  render("ready");
  replace.focus();
});

input.addEventListener("input", () => {
  input.removeAttribute("aria-invalid");
  keyError.hidden = true;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const key = input.value.trim();
  if (!key) {
    keyError.textContent = "Paste your Gemini API key to continue.";
    keyError.hidden = false;
    input.setAttribute("aria-invalid", "true");
    input.focus();
    return;
  }
  save.disabled = true;
  saveLabel.textContent = "Saving…";
  form.setAttribute("aria-busy", "true");
  showStatus("");
  try {
    const result = await api.runtime.sendMessage({ type: "save-key", key });
    if (result?.ok) {
      resetInput();
      render("ready");
      replace.focus();
      showStatus("Key saved.", "success");
    } else {
      showStatus("Could not save the key. Try again.", "error");
    }
  } catch {
    showStatus("Could not save the key. Reopen Explain and try again.", "error");
  } finally {
    save.disabled = false;
    saveLabel.textContent = "Save key";
    form.removeAttribute("aria-busy");
  }
});

// Copies loaded from the GitHub zip never update on their own, so the popup checks GitHub releases.
// Store installs update through the store and skip this.
function newer(a, b) {
  const [x, y] = [a, b].map((value) => value.split(".").map(Number));
  for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  return false;
}

async function findUpdate(force) {
  let { release } = await api.storage.local.get("release");
  if (force || !release || Date.now() - release.checked > 6 * 3600e3) {
    const response = await fetch("https://api.github.com/repos/canmenzo/explain/releases/latest");
    if (!response.ok) throw new Error(`GitHub ${response.status}`);
    const latest = await response.json();
    const zip = `explain-${manifest.browser_specific_settings ? "firefox" : "chrome"}.zip`;
    release = {
      checked: Date.now(),
      version: latest.tag_name.replace(/^v/, ""),
      zip: latest.assets.find((asset) => asset.name === zip)?.browser_download_url ?? latest.html_url,
      notes: latest.html_url,
    };
    await api.storage.local.set({ release });
  }
  const available = newer(release.version, manifest.version);
  update.hidden = !available;
  if (available) {
    const safe = (url) => (typeof url === "string" && url.startsWith("https://github.com/") ? url : RELEASES);
    document.querySelector("#update-title").textContent = `Version ${release.version} is available`;
    document.querySelector("#update-zip").href = safe(release.zip);
    document.querySelector("#update-notes").href = safe(release.notes);
  }
  return available;
}

document.querySelector("#version").textContent = `v${manifest.version}`;
document.querySelector("#update-reload").addEventListener("click", () => api.runtime.reload());

checkUpdate.addEventListener("click", async (event) => {
  event.preventDefault();
  checkUpdate.textContent = "Checking…";
  try {
    checkUpdate.textContent = (await findUpdate(true)) ? "Update available" : "You're up to date";
  } catch {
    checkUpdate.textContent = "Could not check";
  }
});

api.management?.getSelf?.().then((self) => {
  if (self.installType !== "development") return;
  document.querySelector("#update-check").hidden = false;
  return findUpdate(false);
}).catch(() => {});
