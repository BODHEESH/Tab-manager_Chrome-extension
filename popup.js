const tabList = document.getElementById("tabList");
const searchInput = document.getElementById("search");

// Load all tabs
function loadTabs(query = "") {
  chrome.tabs.query({}, (tabs) => {
    tabList.innerHTML = "";
    tabs
      .filter((tab) =>
        tab.title.toLowerCase().includes(query.toLowerCase())
      )
      .forEach((tab) => {
        let li = document.createElement("li");
        li.textContent = tab.title;
        li.title = tab.url;
        li.onclick = () => chrome.tabs.update(tab.id, { active: true });
        tabList.appendChild(li);
      });
  });
}

searchInput.addEventListener("input", (e) => loadTabs(e.target.value));
loadTabs();

// Save session
document.getElementById("saveSession").addEventListener("click", () => {
  chrome.tabs.query({}, (tabs) => {
    const urls = tabs.map((t) => t.url);
    chrome.storage.local.set({ savedSession: urls }, () => {
      alert("Session Saved!");
    });
  });
});

// Restore session
document.getElementById("restoreSession").addEventListener("click", () => {
  chrome.storage.local.get("savedSession", (data) => {
    if (data.savedSession) {
      data.savedSession.forEach((url) => chrome.tabs.create({ url }));
    } else {
      alert("No session found!");
    }
  });
});
