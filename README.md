# 🚀 TS Mastery Hub

> An interactive TypeScript & modern web development learning hub with a beautiful CLI tool and web companion.

**Built by [Tanvi Geetika](https://github.com) at [Red Hat](https://redhat.com), for engineers who want to level up.**

---

## ✨ Features

### 🖥️ Interactive CLI Tool
Run a single command and get an interactive learning experience right in your terminal:

- **📚 Learning Paths** — Structured roadmaps: TypeScript, React+TS, Node+TS, Testing
- **⚡ Quick Challenges** — Test your skills with interactive TypeScript quizzes
- **📋 Cheat Sheets** — Quick reference for types, generics, utility types, React, and more
- **🗺️ Developer Roadmap** — Visual ASCII roadmap from beginner to advanced
- **🔗 Curated Resources** — 30+ hand-picked tutorials, videos, courses, and tools
- **💡 Pro Tips & Patterns** — Real-world patterns used in production codebases

### 🌐 Web Companion
A stunning dark-themed website with:
- Animated backgrounds and smooth scroll effects
- Interactive learning path cards
- Visual developer roadmap
- Syntax-highlighted cheat sheets
- Categorized resource directory
- Deployable to GitHub Pages

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ts-mastery-hub.git
cd ts-mastery-hub

# Install dependencies
npm install

# Run the CLI tool (development mode)
npm run dev

# Or build and run
npm run build
npm start
```

## 📖 Usage

### CLI Tool
```bash
# Development mode (hot reload)
npm run dev

# Production mode
npm run build && npm start

# Direct alias
npm run learn
```

### Web Companion
```bash
# Open the web page locally
npm run web

# Or just open docs/index.html in your browser
```

To deploy to GitHub Pages, enable it in your repo settings and point it to the `/docs` folder.

---

## 📂 Project Structure

```
ts-mastery-hub/
├── src/cli/                  # CLI source code (TypeScript)
│   ├── index.ts              # Entry point
│   ├── ui/
│   │   ├── banner.ts         # ASCII art welcome banner
│   │   └── menu.ts           # Interactive main menu
│   └── modules/
│       ├── learning-paths.ts # Structured learning paths
│       ├── challenges.ts     # Interactive TypeScript quizzes
│       ├── cheatsheet.ts     # Quick reference cheat sheets
│       ├── resources.ts      # Curated resource directory
│       ├── roadmap.ts        # Visual developer roadmap
│       └── tips.ts           # Pro tips & patterns
├── docs/                     # Web companion (GitHub Pages)
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── package.json
├── tsconfig.cli.json
└── README.md
```

---

## 🎯 Who Is This For?

- **Developers new to TypeScript** who want a structured learning path
- **Teams** looking for shared TypeScript learning resources
- **Engineers** who want to deepen their TS knowledge with real-world patterns
- **Anyone** who prefers learning from the terminal 🖥️

---

## 🤝 Contributing

Contributions welcome! Feel free to:
- Add new challenges or tips
- Expand learning paths
- Add new resource recommendations
- Improve the web companion

---

## 📄 License

MIT © [Tanvi Geetika](https://github.com)

---

<p align="center">
  Made with ❤️ and <b>TypeScript</b> | Built at <span style="color: #ee0000;">Red Hat</span>
</p>
