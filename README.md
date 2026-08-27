# ✈️ Tripholic - Professional AI Travel Planner

**Tripholic** is a modern, responsive, full-stack AI travel planning web application built as an academic mini-project. It demonstrates the seamless integration of large language model capabilities, advanced prompt engineering, structured JSON outputs, and modern web interfaces.

---

## 🌟 Key Features

1. **AI-Powered Personalized Itineraries**: Generates comprehensive, realistic day-by-day itineraries with Morning, Afternoon, and Evening slots, geographical clustering, and transit advice.
2. **Strict Budget & Financial Breakdown**: Interactive categorized budget calculator (Accommodation, Food, Transport, Activities, Miscellaneous) with total vs. budget status and cost-saving tips.
3. **Curated Attractions & Dietary Food Guide**: Suggests places with suitability rationale, entry fees, and 100% dietary-compliant food recommendations (Vegetarian, Non-Vegetarian, Vegan, Jain, etc.).
4. **Interactive Trip Modification Engine ("✏️ Modify Your Trip")**: Allows users to alter parts of the itinerary with natural language (e.g. *"Make Day 2 more adventurous"*, *"Reduce budget by 30%"*, *"Add more beaches"*, *"Make kid-friendly"*).
5. **Alternative Plan Generator**: Generates contrasting travel styles (e.g., Relaxed vs. Adventure or Budget vs. Luxury) with cost comparisons.
6. **Local Persistence & Export Tools**:
   - Save trips to local browser storage
   - Copy formatted itinerary to clipboard
   - Print / Save as PDF
   - Interactive checkable packing checklist
7. **Built-in Prompt Engineering Documentation & Academic Test Suite**:
   - Interactive prompt iteration viewer (Versions 1, 2, and 3)
   - Automated 8-test validation runner (Standard trip, Low budget, Style changes, Validation errors, API failure handling)

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      Client (React + Vite)                  │
│  - User Preferences Form & Validation                       │
│  - Interactive Itinerary, Timeline, & Budget Breakdown      │
│  - Prompt Iteration Docs & Automated Test Suite Viewer      │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP POST /api/generate-trip
                               │ HTTP POST /api/modify-trip
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Server (Node.js + Express)                  │
│  - Input Validation & Parameter Sanitization                │
│  - Context-Aware Prompt Builder with Constraints            │
│  - Fallback Procedural Engine (Zero-Crash Assurance)        │
└──────────────────────────────┬──────────────────────────────┘
                               │ @google/genai SDK
                               │ Model: gemini-3.7-flash
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Google Gemini AI API                      │
│  - Strict JSON Schema Output Generation                     │
│  - Contextual Reasoning & Geographical Clustering           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React Icons, Motion (Animations), Canvas Confetti
- **Backend**: Express 4, Node.js, TypeScript (tsx execution, esbuild bundling)
- **AI Integration**: `@google/genai` TypeScript SDK (model `gemini-3.7-flash`)
- **Build Tool**: Vite 6

---

## 🔑 Environment Variables

Create or configure `.env` (refer to `.env.example`):

```env
# Google Gemini API key for live AI generation
GEMINI_API_KEY="your-gemini-api-key"

# Application host URL
APP_URL="http://localhost:3000"
```

*Note: If no API key is provided, Tripholic automatically activates its high-fidelity procedural generation engine, guaranteeing uninterrupted demonstration and offline functionality.*

---

## 🚀 How to Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 🧪 Testing Checklist (Scenarios 1-8)

| Test ID | Scenario | Input Parameters | Expected Behavior |
| :--- | :--- | :--- | :--- |
| **Test 1** | Standard Trip | Goa, 4 Days, ₹20,000, 2 Travelers, Adventure, Vegetarian | Complete 4-day itinerary generated within ₹20,000 with vegetarian food guide. |
| **Test 2** | Low Budget | Gokarna, 3 Days, ₹5,000, 1 Traveler, Solo Explorer | Prioritizes budget hostels, local buses, and street dining without exceeding ₹5,000. |
| **Test 3** | Travel Style Switch | Change Adventure to Relaxed | Replaces high-intensity sports with cafe hopping, spa visits, and slow mornings. |
| **Test 4** | Dietary Shift | Change Vegetarian to Vegan | Updates all breakfast, lunch, and dinner recommendations to 100% plant-based options. |
| **Test 5** | Modify Request | Prompt: *"Make Day 2 more adventurous"* | Surgically updates Day 2 to include scuba diving/ATV rides while keeping other days stable. |
| **Test 6** | Missing Destination | Empty destination field | Triggers friendly inline validation message: *"Please enter a destination."* |
| **Test 7** | Invalid Duration | 0 or negative days | Triggers friendly validation error: *"Please enter a valid number of days (1-30)."* |
| **Test 8** | API Failure / Offline | Simulate network timeout | Transparently falls back to procedural generator without crashing the application. |

---

## 🎓 Academic Mini-Project Demonstration Flow (2-3 Minutes)

1. **Initial State**: Navigate to Tripholic at `http://localhost:3000`.
2. **One-Click Example**: Click **"Try Example"** to populate: *Goa, 4 days, ₹20,000, 2 travelers, Adventure, Beaches & Photography, Vegetarian*.
3. **Generate**: Click **"Generate My Trip"**. Watch the animated multi-step loading indicators.
4. **Review Sections**:
   - Inspect **Trip Summary** & **Day-by-Day Timeline**.
   - Review **Categorized Budget** (₹20,000 cap).
   - Check **Food Recommendations** (100% Vegetarian options).
5. **Modify with AI**:
   - Scroll to **"✏️ Modify Your Trip"**.
   - Click the chip **"Make Day 2 more adventurous"** (or type a custom modification).
   - Click **"Apply AI Modification"** to observe targeted Day 2 delta update.
6. **Documentation & Testing Tab**:
   - Click **"Prompt Docs"** in the navigation header to demonstrate the 3 prompt iterations and evaluation matrix to the evaluator.
   - Click **"Test Suite"** to run the 8 automated verification scenarios live.
