# 📝 To-Do List PWA (React PWA, GitHub Pages)

> "Productivity isn't just about getting stuff done — it's about slaying tasks with style."

Sleek, animated, priority-powered To-Do List now running as a **React (CDN) Progressive Web App** with a desktop/mobile widget and GitHub Pages deployment.

### 🚀 Live Demo

Deploy from your repo’s `main`/`master` branch with GitHub Pages. This repo contains a ready-to-go Pages workflow.

---
## ✨ Features

### Core Features
* 🎨 **Dark & Light Mode Toggle** (saved to `localStorage`)
* 🧈 **Task Prioritization** – Chill 🧈, Normal 📌, Urgent 🔥
* ✅ **Mark tasks as done** with a single click
* ✏️ **Edit or delete tasks** anytime
* 📂 **Filter**: All | Active | Done
* 🗑️ **Clear completed tasks**
* 📦 **Data Persistence** using localStorage + IndexedDB
* 🔥 Tailwind CSS-powered UI – responsive, minimal, and glowing

### 🚀 PWA Features
* 📱 **Installable** - Add to home screen on Android, iOS, Mac, Windows
* 🌐 **Offline Support** - Works without internet connection
* 🔔 **Push Notifications** - Get notified about tasks
* 🔄 **Background Sync** - Syncs data when back online
* 🎯 **Desktop Widget** - Quick access widget for desktop
* 📲 **App-like Experience** - Standalone mode, no browser UI
* 🔔 **Smart Notifications** - Task reminders and updates

---

## 🛠️ Tech Stack

| Tech         | Usage                 |
| ------------ | --------------------- |
| HTML5        | Structure             |
| Tailwind CSS | Styling               |
| JavaScript   | Functionality & Logic |
| LocalStorage | Persistence           |
| IndexedDB    | Offline Storage       |
| Service Worker | PWA & Offline Support |
| Web App Manifest | PWA Configuration |
| GitHub Pages | Deployment            |

---

## 📁 Project Structure

```
├── index.html           # Main HTML file
├── script.js            # JavaScript logic
├── manifest.json        # PWA manifest
├── sw.js               # Service Worker
├── widget.html         # Desktop widget
├── icon-generator.html # Icon generation tool
├── icons/              # PWA icons
│   ├── icon-16x16.png
│   ├── icon-32x32.png
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
├── PWA-SETUP.md        # PWA setup guide
└── README.md           # You're reading it!
```

---

## ⚙️ How to Run Locally

```bash
# 1. Clone your repo
git clone <your-fork-or-repo-url>

# 2. Open the folder
cd <repo>

# 3. Open index.html in your browser (no build step)
```

That's it. No npm install. No build step. Just open and go.

---

## 📱 PWA Installation

### Install as PWA:
1. **Android**: Open in Chrome → Tap "Install" button → Add to home screen
2. **iOS**: Open in Safari → Share button → "Add to Home Screen"
3. **Desktop**: Open in Chrome/Edge → Click install button in address bar

### Desktop Widget:
- Click the 📱 button in the app header
- A compact widget window opens for quick task management
- Widget syncs automatically with the main app

### Generate Custom Icons:
1. Open `icon-generator.html` in your browser
2. Download the generated icons
3. Replace files in the `icons/` folder

For detailed setup instructions, see [PWA-SETUP.md](./PWA-SETUP.md)

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
