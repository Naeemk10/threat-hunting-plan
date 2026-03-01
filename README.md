# 🎯 Threat Hunting: Crash to Advanced
### 27-Day SOC Analyst Training Program

A daily 20-minute interactive threat hunting curriculum built for SOC analysts.

## Features
- ✅ 27 structured daily lessons (Foundations → Intermediate → Advanced)
- 🌐 Real-world attack examples (APT29, Cobalt Strike, Conti, Capital One, etc.)
- 💻 Ready-to-use KQL detection queries
- 🛠 15+ tool & resource links
- 🎯 Daily quiz questions
- 💾 Progress auto-saved in browser (localStorage)

---

## 🚀 How to Run Locally

**Requirements:** Node.js 16+ installed

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/threat-hunting-plan.git
cd threat-hunting-plan

# Install dependencies
npm install

# Start the app
npm start
```

App opens at → **http://localhost:3000**

---

## 🌐 Deploy to GitHub Pages (Free Hosting)

### Step 1 — Update homepage in package.json
Open `package.json` and change this line:
```json
"homepage": "https://YOUR_USERNAME.github.io/threat-hunting-plan"
```

### Step 2 — Deploy
```bash
npm install
npm run deploy
```

### Step 3 — Enable GitHub Pages
1. Go to your repo on GitHub
2. Settings → Pages
3. Source: **Deploy from branch**
4. Branch: **gh-pages** → **/root**
5. Save

Your app will be live at:
**https://YOUR_USERNAME.github.io/threat-hunting-plan**

---

## 📁 Project Structure
```
src/
  App.js          ← Main app with all 27 days of content
  index.js        ← React entry point
public/
  index.html      ← HTML shell
package.json      ← Dependencies + deploy scripts
```

---

## 🛠 Tech Stack
- React 18
- Pure CSS-in-JS (no external UI library)
- localStorage for progress persistence
- GitHub Pages for free hosting

---

*Built for SOC analysts who want to level up their threat hunting skills 20 minutes at a time.*
