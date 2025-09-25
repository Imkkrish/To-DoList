# 📝 To-Do List Web App

> “Productivity isn’t just about getting stuff done — it’s about slaying tasks with style.”

A sleek, animated, and priority-powered To-Do List built with vanilla HTML, CSS (Tailwind), and JavaScript — hosted live on GitHub Pages. No frameworks, no fluff — just vibes and functionality.

### 🚀 Live Demo

👉 [Click here to get productive](https://imkkrish.github.io/To-DoList/)

---
## ✨ Features

* 🎨 **Dark & Light Mode Toggle** (saved to `localStorage`)
* 🧈 **Task Prioritization** – Chill 🧈, Normal 📌, Urgent 🔥
* ✅ **Mark tasks as done** with a single click
* ✏️ **Edit or delete tasks** anytime
* 📂 **Filter**: All | Active | Done
* 🗑️ **Clear completed tasks**
* 📦 **Data Persistence** using localStorage
* 🔥 Tailwind CSS-powered UI – responsive, minimal, and glowing

---

## 🛠️ Tech Stack

| Tech         | Usage                 |
| ------------ | --------------------- |
| HTML5        | Structure             |
| Tailwind CSS | Styling               |
| JavaScript   | Functionality & Logic |
| LocalStorage | Persistence           |
| GitHub Pages | Deployment            |

---

## 📁 Project Structure

```
├── index.html         # Main HTML file
├── script.js          # JavaScript logic
├── service-worker.js  # PWA offline + Share Target handler
├── manifest.webmanifest
├── quick-add.html     # Minimal quick-add window
├── quick-add.js
├── icons/
│   └── favicon.svg
└── README.md          # You're reading it!

```

---

## ⚙️ How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/imkkrish/To-DoList.git

# 2. Open the folder
cd To-DoList

# 3. Open index.html in your browser
```

That’s it. No npm install. No build step. Just open and go.

---

## 📦 PWA (Installable App)

- Android (Chrome): Menu → Add to Home screen or Install app.
- Windows/Linux (Chrome/Edge): Omnibox Install button → Install.
- macOS (Chrome/Edge): File → Install To-Do List. Safari (macOS 14+): Share → Add to Dock.

### Quick Add (widget-like)
- Use app shortcut "Quick Add" from the installed app icon (Android, Windows, ChromeOS, some desktop Chromium).
- Direct URL: `/quick-add.html` or `/quick-add.html?priority=urgent`.
- Protocol handler: open a link like `web+todo:Buy milk` to prefill Quick Add.

### Share to the app (Android/Chromium)
- Share text/links from other apps/sites → select this app; it opens Quick Add with the content.

### Offline and Badging
- Works offline; data stored in `localStorage`.
- App badge shows active task count where supported (Chromium-based browsers).

Note: Native OS homescreen/desktop widgets aren’t available to PWAs on Android/macOS yet. Use the "Quick Add" shortcut/window as a lightweight alternative.

---

## 🙌 Acknowledgments

* Inspired by every “to-do” app that *almost* got it right
* Tailwind CSS for making things look good without writing a single class from scratch
* Coffee ☕ for driving late-night coding sessions

---

Made with 💖 by [Krish Kumar](https://github.com/imkkrish)

---

Wanna collab or suggest features?
Open an [issue](https://github.com/imkkrish/To-DoList/issues) or slide into my inbox 😄
