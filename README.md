# 📅 Interactive Wall Calendar Component
*Frontend Engineering Challenge Submission*

A polished, fully interactive React component designed to emulate the physical aesthetic of a wall calendar while providing powerful digital tools for organization.

---

## 🚀 Features

This project satisfies all **Core Requirements** of the assessment and implements several **Creative Liberty** features to enhance the user experience and demonstrate product sense.

### 🛠 Core Requirements Met

- **Wall Calendar Aesthetic:** Emulates a physical binder using dynamic hero images, complex CSS `clip-path` geometric cutouts, and 3D-styled binding rings.
- **Day Range Selector:** Intuitive two-click date range selection spanning multiple days or weeks, with clear visual indicators for start, end, and in-between states.
- **Context-Aware Notes:** The notes section dynamically switches context — users can save notes for a single day, an entire selected range, or a general monthly memo.
- **Fully Responsive:** Adapts flawlessly from a stacked mobile view to a segmented side-by-side desktop layout using Flexbox.

### ✨ Creative Liberty Enhancements

- **Theme Switcher:** Toggle between 3 aesthetic environments (Glacier Blue, Alpine Emerald, Canyon Clay). The entire UI re-themes dynamically via Tailwind classes.
- **Integrated Task Manager:** Add to-do items to individual dates. If a date range is selected, a task is automatically populated across all selected days.
- **Smart Calendar Indicators:** Days with pending tasks or holidays display color-coded indicator dots. Hovering reveals contextual tooltips.
- **Year Jump Dropdown:** The year typography doubles as a dropdown, allowing instant navigation up to 10 years into the past or future.
- **"Go to Today" Action:** Instantly re-centers the calendar on the user's current local date.
- **Dynamic Initialization:** The calendar automatically detects the user's system time and opens to the current day, month, and year by default.

---

## 🧠 Tech Stack & Architecture Decisions

| Tool | Reason |
|---|---|
| **React + Vite** | Fast compilation, instant HMR, minimal config overhead |
| **Tailwind CSS** | Rapid UI iteration, dynamic theme classes, clean responsive breakpoints |
| **React useState / useEffect** | Sufficient for this scope — no external state library needed |
| **localStorage API** | Client-side persistence for Notes, Tasks, and Theme across reloads |

### Notable Implementation Notes

- **`useEffect` dep array optimization:** The notes draft sync effect intentionally excludes `notesData` from its dependency array to prevent background state updates from overwriting the user's active typing session.
- **Monday-first week layout:** The calendar grid maps Monday → Sunday rather than the US Sunday → Saturday standard. This was a deliberate choice to match the spatial arrangement of the provided inspiration mockup.

---

## 💻 How to Run Locally

**1. Clone the repository**
```bash
git clone <your-repo-link-here>
```

**2. Navigate to the project directory**
```bash
cd calendar-challenge
```

**3. Install dependencies**
```bash
npm install
```

**4. Start the development server**
```bash
npm run dev
```

**5. View the app**

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

> 💡 Don't forget to replace `<your-repo-link-here>` with your actual GitHub or GitLab repository URL before submitting.