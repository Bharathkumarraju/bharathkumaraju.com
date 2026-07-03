// ============================================================================
// AI Profile Assistant widget for bharathkumaraju.com
// Talks ONLY to your Cloudflare Worker. No API key ever lives in the browser.
// >>> After you deploy the Worker, set API_BASE below to your Worker URL. <<<
// e.g. "https://profile-ai-assistant.<your-subdomain>.workers.dev"
// ============================================================================
const API_BASE =
  "localhost" === window.location.hostname
    ? "http://localhost:8787"
    : "https://profile-ai-assistant.bhrthdsra1.workers.dev";

const MAX_CONVERSATION_HISTORY = 10;
const CONVERSATION_STARTERS = [
  "What e-books has he published?",
  "What topics do his e-books cover?",
  "What's his experience with Kubernetes and EKS?",
  "Tell me about his Terraform and IaC work",
  "Which cloud platforms has he worked with?",
  "What are his CNCF certifications?",
];

let sessionId = null,
  messageHistory = [],
  isStreaming = !1,
  eventSource = null;

function generateUUID() {
  return "undefined" != typeof crypto && crypto.randomUUID
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
        const t = (16 * Math.random()) | 0;
        return ("x" === e ? t : (3 & t) | 8).toString(16);
      });
}
function getStoredSession() {
  try {
    return sessionStorage.getItem("chatSessionId");
  } catch (e) {
    return null;
  }
}
function setStoredSession(e) {
  try {
    sessionStorage.setItem("chatSessionId", e);
  } catch (e) {}
}
function escapeHtml(e) {
  const t = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return e.replace(/[&<>"']/g, (e) => t[e]);
}
function parseMarkdown(e) {
  if (!e) return "";
  return escapeHtml(e)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^\s*[-*]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\s*)+/g, "<ul>$&</ul>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (e, t, n) =>
      /^https?:\/\//i.test(n)
        ? `<a href="${n}" target="_blank" rel="noopener">${t}</a>`
        : t
    )
    .replace(/\n/g, "<br>");
}
function createChatWidget() {
  if (document.getElementById("chat-widget-root")) return;
  const e = document.createElement("div");
  e.id = "chat-widget-root";
  const t = document.createElement("button");
  t.className = "chat-widget-toggle";
  t.setAttribute("aria-label", "Ask AI about Bharath's profile");
  t.innerHTML =
    '\n    <span>💬</span>\n    <span class="chat-widget-toggle-text">Ask AI About My Profile</span>\n  ';
  t.onclick = toggleChat;
  const n = document.createElement("div");
  n.className = "chat-widget-container";
  n.id = "chat-widget-container";
  const a = document.createElement("div");
  a.className = "chat-widget-header";
  a.innerHTML =
    '\n    <div class="chat-widget-title">\n      <div class="chat-widget-avatar">🤖</div>\n      <div class="chat-widget-title-text">\n        <h3>AI Profile Assistant</h3>\n        <span>Ask about Bharath\'s background</span>\n      </div>\n    </div>\n    <button class="chat-widget-close" aria-label="Close chat">\n      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n        <path d="M18 6L6 18M6 6l12 12"/>\n      </svg>\n    </button>\n  ';
  a.querySelector(".chat-widget-close").onclick = toggleChat;
  const s = document.createElement("div");
  s.className = "chat-widget-tabs";
  s.innerHTML =
    '\n    <button class="chat-widget-tab active" data-tab="chat" role="tab" aria-selected="true">💬 Chat</button>\n    <button class="chat-widget-tab" data-tab="jobmatch" role="tab" aria-selected="false">💼 Job Match</button>\n  ';
  s.querySelectorAll(".chat-widget-tab").forEach((e) => {
    e.onclick = () => switchTab(e.dataset.tab);
  });
  const o = document.createElement("div");
  o.className = "chat-widget-content";
  const c = document.createElement("div");
  c.className = "chat-widget-panel active";
  c.id = "chat-panel";
  c.innerHTML =
    '\n    <div class="chat-widget-messages" id="chat-messages" role="log" aria-live="polite">\n      <div class="chat-welcome">\n        <div class="chat-welcome-icon">👋</div>\n        <h4>Hi! I can help you learn about Bharath\'s background.</h4>\n        <p>Ask me anything about his experience, skills, or certifications.</p>\n      </div>\n    </div>\n    <div class="chat-starters" id="chat-starters-wrap">\n      <button type="button" class="chat-starters-toggle" id="chat-starters-toggle" aria-expanded="true">\n        <span>💡 Quick Questions</span>\n        <span class="chat-starters-caret" id="chat-starters-caret">▾</span>\n      </button>\n      <div class="chat-starters-chips" id="chat-starters"></div>\n    </div>\n    <div class="chat-widget-input-area">\n      <input \n        type="text" \n        class="chat-widget-input" \n        id="chat-input"\n        placeholder="Type your message..."\n        maxlength="2000"\n        aria-label="Type your message"\n      />\n      <button class="chat-widget-send" id="chat-send" aria-label="Send message">\n        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>\n        </svg>\n      </button>\n    </div>\n  ';
  const i = document.createElement("div");
  i.className = "chat-widget-panel";
  i.id = "jobmatch-panel";
  i.innerHTML =
    '\n    <div class="chat-jobmatch-area">\n      <label class="chat-jobmatch-label">Paste Job Description</label>\n      <p class="chat-jobmatch-hint">I\'ll analyze how well Bharath\'s experience matches this role.</p>\n      <textarea \n        class="chat-jobmatch-textarea" \n        id="jobmatch-textarea"\n        placeholder="Paste the job description here..."\n        maxlength="5000"\n      ></textarea>\n      <button class="chat-jobmatch-button" id="jobmatch-button">\n        🔍 Analyze Compatibility\n      </button>\n      <div id="jobmatch-results"></div>\n    </div>\n  ';
  o.appendChild(c);
  o.appendChild(i);
  n.appendChild(a);
  n.appendChild(s);
  n.appendChild(o);
  e.appendChild(t);
  e.appendChild(n);
  document.body.appendChild(e);
  initializeEventListeners();
  sessionId = getStoredSession();
  addConversationStarters();
}
function initializeEventListeners() {
  const e = document.getElementById("chat-input"),
    t = document.getElementById("chat-send");
  e &&
    e.addEventListener("keypress", (e) => {
      "Enter" !== e.key || e.shiftKey || (e.preventDefault(), sendMessage());
    });
  t && (t.onclick = () => sendMessage());
  const n = document.getElementById("jobmatch-button");
  n && (n.onclick = analyzeJobDescription);
  const tog = document.getElementById("chat-starters-toggle");
  tog && (tog.onclick = toggleStarters);
}
function collapseStarters() {
  const w = document.getElementById("chat-starters-wrap");
  if (w) w.classList.add("collapsed");
  const c = document.getElementById("chat-starters-caret");
  if (c) c.textContent = "▴";
  const t = document.getElementById("chat-starters-toggle");
  if (t) t.setAttribute("aria-expanded", "false");
}
function toggleStarters() {
  const w = document.getElementById("chat-starters-wrap");
  if (!w) return;
  const collapsed = w.classList.toggle("collapsed");
  const c = document.getElementById("chat-starters-caret");
  if (c) c.textContent = collapsed ? "▴" : "▾";
  const t = document.getElementById("chat-starters-toggle");
  if (t) t.setAttribute("aria-expanded", collapsed ? "false" : "true");
}
function addConversationStarters() {
  const e = document.getElementById("chat-starters");
  e &&
    CONVERSATION_STARTERS.forEach((t) => {
      const n = document.createElement("button");
      n.className = "chat-starter-chip";
      n.textContent = t;
      n.onclick = () => {
        const e = document.getElementById("chat-input");
        e && (e.value = t);
        sendMessage(t);
      };
      e.appendChild(n);
    });
}
function toggleChat() {
  const e = document.getElementById("chat-widget-container"),
    t = document.querySelector(".chat-widget-toggle");
  e.classList.contains("open")
    ? (e.classList.remove("open"), t.classList.remove("hidden"))
    : (e.classList.add("open"),
      t.classList.add("hidden"),
      setTimeout(() => {
        const e = document.getElementById("chat-input");
        e && e.focus();
      }, 100));
}
function switchTab(e) {
  document.querySelectorAll(".chat-widget-tab").forEach((t) => {
    const n = t.dataset.tab === e;
    t.classList.toggle("active", n);
    t.setAttribute("aria-selected", n ? "true" : "false");
  });
  document.querySelectorAll(".chat-widget-panel").forEach((t) => {
    t.classList.toggle("active", t.id === `${e}-panel`);
  });
}
function addMessage(e, t, n = !1) {
  const a = document.getElementById("chat-messages");
  if (!a) return;
  const s = a.querySelector(".chat-welcome");
  s && s.remove();
  if ("assistant" === e && !n) {
    const e = a.querySelector(".chat-typing");
    e && e.remove();
  }
  if (n && "assistant" === e) {
    const e = a.querySelector(".chat-message.assistant.streaming");
    if (e)
      return (
        (e.querySelector(".chat-message-content").innerHTML = parseMarkdown(t)),
        void scrollToBottom()
      );
  }
  const o = document.createElement("div");
  o.className = `chat-message ${e}${n ? " streaming" : ""}`;
  const c = "user" === e ? "👤" : "🤖",
    i = parseMarkdown(t);
  o.innerHTML = `\n    <div class="chat-message-avatar">${c}</div>\n    <div class="chat-message-content">${i}</div>\n  `;
  a.appendChild(o);
  scrollToBottom();
  return o;
}
function showTypingIndicator() {
  const e = document.getElementById("chat-messages");
  if (!e) return;
  const t = e.querySelector(".chat-typing");
  t && t.remove();
  const n = document.createElement("div");
  n.className = "chat-typing";
  n.innerHTML =
    '\n    <div class="chat-message-avatar">🤖</div>\n    <div class="chat-typing-dots">\n      <span></span>\n      <span></span>\n      <span></span>\n    </div>\n    <span class="chat-typing-text">Thinking...</span>\n  ';
  e.appendChild(n);
  scrollToBottom();
}
function removeTypingIndicator() {
  const e = document.querySelector(".chat-typing");
  e && e.remove();
}
function scrollToBottom() {
  const e = document.getElementById("chat-messages");
  e && (e.scrollTop = e.scrollHeight);
}
function setInputEnabled(e) {
  const t = document.getElementById("chat-input"),
    n = document.getElementById("chat-send");
  t && ((t.disabled = !e), e && t.focus());
  n && (n.disabled = !e);
  isStreaming = !e;
}
function showError(e, t = "chat-messages") {
  const n = document.getElementById(t);
  if (!n) return;
  n.querySelectorAll(".chat-error").forEach((e) => e.remove());
  const a = document.createElement("div");
  a.className = "chat-error";
  a.textContent = e;
  n.appendChild(a);
  scrollToBottom();
}
async function sendMessage(e = null) {
  if (isStreaming) return;
  const t = document.getElementById("chat-input"),
    n = e || t?.value?.trim();
  if (n) {
    collapseStarters();
    for (
      t && !e && (t.value = ""),
        addMessage("user", n),
        messageHistory.push({ role: "user", content: n });
      messageHistory.length > 20;

    )
      messageHistory.shift();
    showTypingIndicator();
    setInputEnabled(!1);
    try {
      const e = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: window.location.origin },
        body: JSON.stringify({ message: n, sessionId: sessionId }),
      });
      if (!e.ok) {
        const t = await e.json().catch(() => ({}));
        throw new Error(t.error || `HTTP ${e.status}`);
      }
      const t = e.body.getReader(),
        a = new TextDecoder();
      let s = "",
        o = "",
        c = null;
      for (;;) {
        const { done: e, value: n } = await t.read();
        if (e) break;
        s += a.decode(n, { stream: !0 });
        const i = s.split("\n");
        s = i.pop() || "";
        for (const e of i) {
          const t = e.trim();
          if (!t.startsWith("data: ")) continue;
          const n = t.slice(6);
          if ("[DONE]" !== n)
            try {
              const e = JSON.parse(n);
              switch (e.type) {
                case "session":
                  sessionId = e.sessionId;
                  setStoredSession(sessionId);
                  break;
                case "chunk":
                  removeTypingIndicator();
                  o += e.content;
                  c
                    ? ((c.querySelector(".chat-message-content").innerHTML =
                        parseMarkdown(o)),
                      scrollToBottom())
                    : ((c = addMessage("assistant", o, !0)),
                      c.classList.add("streaming"));
                  break;
                case "error":
                  throw new Error(e.message || "Stream error");
              }
            } catch (e) {}
        }
      }
      c && c.classList.remove("streaming");
      o && messageHistory.push({ role: "assistant", content: o });
    } catch (e) {
      console.error("Chat error:", e);
      removeTypingIndicator();
      showError(`Sorry, there was an error: ${e.message}. Please try again.`);
    } finally {
      setInputEnabled(!0);
    }
  }
}
async function analyzeJobDescription() {
  const e = document.getElementById("jobmatch-textarea"),
    t = document.getElementById("jobmatch-button"),
    n = document.getElementById("jobmatch-results"),
    a = e?.value?.trim();
  if (a) {
    t.disabled = !0;
    t.textContent = "⏳ Analyzing...";
    n.innerHTML = "";
    try {
      const e = await fetch(`${API_BASE}/api/job-match`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: window.location.origin },
        body: JSON.stringify({ jobDescription: a }),
      });
      if (!e.ok) {
        const t = await e.json().catch(() => ({}));
        throw new Error(t.error || `HTTP ${e.status}`);
      }
      displayJobMatchResults(await e.json(), n);
    } catch (e) {
      console.error("Job match error:", e);
      const t = document.createElement("div");
      t.className = "chat-error";
      t.style.margin = "0";
      t.textContent = `Sorry, there was an error analyzing the job description: ${e.message}`;
      n.appendChild(t);
    } finally {
      t.disabled = !1;
      t.textContent = "🔍 Analyze Compatibility";
    }
  } else alert("Please paste a job description first.");
}
function displayJobMatchResults(e, t) {
  const n =
      e.matchPercentage >= 70 ? "high" : e.matchPercentage >= 40 ? "medium" : "low",
    a =
      e.matchingSkills?.map((e) => `<li>${escapeHtml(String(e))}</li>`).join("") ||
      "<li>None specified</li>",
    s =
      e.skillGaps?.map((e) => `<li>${escapeHtml(String(e))}</li>`).join("") ||
      "<li>None identified</li>",
    o = escapeHtml(String(e.matchPercentage)),
    c = escapeHtml(String(e.recommendation || "Analysis Complete")),
    i = escapeHtml(String(e.seniorityFit || "")),
    r = escapeHtml(String(e.reasoning || e.rawResponse || "No detailed reasoning provided."));
  t.innerHTML = `\n    <div class="chat-jobmatch-results">\n      <div class="chat-jobmatch-match">\n        <div class="chat-jobmatch-percentage ${n}">${o}%</div>\n        <div class="chat-jobmatch-recommendation">\n          <h4>${c}</h4>\n          <span>${i}</span>\n        </div>\n      </div>\n\n      <div class="chat-jobmatch-section">\n        <h5>💪 Matching Skills</h5>\n        <ul>${a}</ul>\n      </div>\n\n      <div class="chat-jobmatch-section">\n        <h5>📋 Skill Gaps</h5>\n        <ul>${s}</ul>\n      </div>\n\n      <div class="chat-jobmatch-section">\n        <h5>📝 Reasoning</h5>\n        <p>${r}</p>\n      </div>\n    </div>\n  `;
}
function initChatWidget() {
  "loading" === document.readyState
    ? document.addEventListener("DOMContentLoaded", createChatWidget)
    : createChatWidget();
}
initChatWidget();
