# 🌊 AquaSafe Nexus X∞

### Multi-Domain Risk Intelligence Platform — Water · Infrastructure · Environment

> A deterministic, explainable, and auditable risk analysis platform that predicts, explains, and acts — before damage occurs.

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| 🚀 Live Demo | https://aqua-safe-nexus-gb0dv0zwn-shuva-0s-projects.vercel.app/ |
| 💻 GitHub | https://github.com/shuva-0/AquaSafe-x |

---

## 💡 Core Idea

Traditional monitoring systems are **reactive** — contamination or failure is detected *after* it causes damage. Time is lost. Risk escalates. Intervention becomes expensive.

**AquaSafe Nexus X∞** transforms multi-domain monitoring into a **predictive, explainable, and action-driven intelligence system** across three critical domains:

- 🌊 **Water** — fluid contamination and quality analysis
- 🏗️ **Infrastructure** — structural integrity and load monitoring
- 🍃 **Environment** — air quality and pollution tracking

---

## 🧠 What It Does

AquaSafe Nexus X∞ is a **deterministic risk intelligence engine** that:

- Quantifies risk using a **mathematically consistent weighted scoring model**
- Identifies root causes via **Explainable AI (XAI) contribution analysis**
- Predicts future degradation trends using rule-based forecasting
- Generates **tiered, actionable decisions** — Immediate, Short-term, Long-term
- Runs **entirely client-side** — no ML, no external APIs, fully reproducible

---

## 🔄 System Flow

```
Sensor / User Input
        ↓
Validation & Normalization Engine
        ↓
Risk Index Computation  R = Σ(wᵢ · penaltyᵢ) / Σ(wᵢ)
        ↓
XAI Explainability Layer (Contribution Analysis)
        ↓
Prediction Engine (Trend + Forecast)
        ↓
Decision Engine (3-Tier Actions)
        ↓
Alert System (INFO / WARNING / CRITICAL)
```

---

## ⚙️ Math Engine

### Parameter Normalization

Each parameter is normalized to a penalty score `[0, 100]`:

```
If value < safeMin  →  penalty = ((safeMin - value) / (safeMin - critMin)) × 100
If value > safeMax  →  penalty = ((value - safeMax) / (critMax - safeMax)) × 100
If within safe range →  penalty = (|value - ideal| / halfRange) × 15
All penalties clamped to [0, 100]
```

### Risk Index

```
R = Σ(wᵢ × penaltyᵢ) / Σ(wᵢ)        bounded [0, 100]
```

### XAI Contribution

```
Cᵢ = (penaltyᵢ / Σ penalties) × 100   (always sums to 100%)
```

### Confidence Score

Starts at 100. Deductions:
- −15 per missing parameter
- −5 per parameter with penalty = 100 (fully clamped)
- −5 if Risk Index > 90

---

## 📊 Domain Parameters & Safe Ranges

### 🌊 Water

| Parameter | Unit | Safe Range | Ideal | Weight |
|-----------|------|------------|-------|--------|
| pH | — | 6.5 – 8.5 | 7.0 | 2.0 |
| Turbidity | NTU | 0 – 4 | 0.5 | 1.8 |
| Dissolved Oxygen | mg/L | 7 – 14 | 9.0 | 1.5 |
| Conductivity | μS/cm | 100 – 800 | 300 | 1.2 |
| Temperature | °C | 10 – 30 | 20 | 1.0 |
| Nitrate | mg/L | 0 – 10 | 2.0 | 1.6 |

### 🏗️ Infrastructure

| Parameter | Unit | Safe Range | Ideal | Weight |
|-----------|------|------------|-------|--------|
| Load Stress | % | 0 – 60 | 20 | 2.2 |
| Vibration | Hz | 0 – 25 | 5 | 1.9 |
| Crack Index | CI | 0 – 0.3 | 0.0 | 2.5 |
| Temperature | °C | −5 – 45 | 20 | 1.3 |
| Moisture | % | 5 – 40 | 15 | 1.6 |
| Usage Intensity | % | 10 – 75 | 40 | 1.4 |

### 🍃 Environment

| Parameter | Unit | Safe Range | Ideal | Weight |
|-----------|------|------------|-------|--------|
| AQI | — | 0 – 100 | 15 | 2.0 |
| PM2.5 | μg/m³ | 0 – 35 | 5 | 2.3 |
| Temperature | °C | 10 – 35 | 22 | 1.2 |
| Humidity | % | 30 – 70 | 50 | 1.0 |
| CO₂ | ppm | 300 – 1000 | 420 | 1.7 |
| Noise | dB | 25 – 65 | 40 | 1.4 |

---

## 🚨 Severity & Alert Thresholds

### Severity (Risk Index R)

| Level | Range | Color |
|-------|-------|-------|
| ✅ SAFE | R < 20 | `#10b981` |
| ⚠️ WARNING | 20 ≤ R < 65 | `#f59e0b` |
| 🔴 CRITICAL | R ≥ 65 | `#ef4444` |

### Alerts (per-parameter penalty)

| Level | Penalty |
|-------|---------|
| INFO | 15 – 19 |
| WARNING | 20 – 59 |
| CRITICAL | ≥ 60 |

---

## 🔮 Prediction Engine (Rule-Based)

| Risk Index | Trend | Forecast |
|------------|-------|---------|
| R ≥ 65 | ↓ Degrading | Critical threshold exceeded. Rapid deterioration expected. |
| R ≥ 20 | ↓ Degrading | Trending toward critical. Estimated Xh to threshold. |
| R ≥ 10 | → Stable | Minor deviations. Monitor every 6h. |
| R < 10 | ↑ Improving | All parameters optimal. |

---

## 🎯 Decision Engine (3-Tier)

| Tier | Trigger | Action |
|------|---------|--------|
| **IMMEDIATE** | Severity = CRITICAL | Emergency response targeting top XAI contributor |
| **SHORT-TERM** | Severity = WARNING or CRITICAL | Sensor calibration, increase monitoring to 2h |
| **LONG-TERM** | Always | Schedule inspection, review thresholds, evaluate sensor drift |

---

## 🎛️ Simulation Mode

Each domain has 3 built-in scenarios:

- **Normal** — all parameters at ideal values
- **Alert** — parameters drifting toward warning thresholds
- **Critical** — parameters exceeding critical boundaries

Simulate button cycles through scenarios with randomized noise. Auto-refreshes every **2.2 seconds** when running.

---

## 🖥️ Pages

### `/analyze`
- Domain selector tabs: Water | Infrastructure | Environment
- Dynamic parameter sliders per domain
- Slider thumb color: green (safe) → yellow (warning) → red (critical) based on live penalty
- Results panel:
  - Animated SVG arc gauge (Risk Index)
  - Severity badge, trend indicator, confidence %
  - Active alerts list
  - XAI contribution bars (sorted by contribution)
  - Forecast text
  - 3-tier decision actions

### `/dashboard`
- All 3 domains side by side
- Per-domain: Risk Index, severity badge, trend, top 3 XAI drivers, alert count
- Platform-wide average risk score
- Simultaneous simulation across all domains

---

## 🔥 Key Features

| Feature | Description |
|---------|-------------|
| 🧪 Deterministic Engine | Pure math, no ML — consistent and reproducible every time |
| 🧠 Explainability (XAI) | Every parameter's exact contribution shown and ranked |
| 🔮 Predictive Analysis | Trend detection + time-to-threshold forecasting |
| 🚨 Multi-Level Alerts | INFO / WARNING / CRITICAL per parameter |
| 🎯 Decision Intelligence | 3-tier prioritized action recommendations |
| 🎛️ Simulation Mode | Live scenario cycling with noise injection |
| ⚙️ Confidence Scoring | Prevents misleading outputs from incomplete data |
| 📱 Mobile Responsive | Full dark-theme UI, works on all screen sizes |

---

## 🆚 How This Is Different

| Traditional Systems | AquaSafe Nexus X∞ |
|---------------------|-------------------|
| Reactive monitoring | Predictive intelligence |
| Black-box outputs | Fully explainable math |
| Raw data display | Actionable decision tiers |
| Single domain | Water + Infrastructure + Environment |
| No forecasting | Trend + time-to-threshold prediction |
| Generic alerts | Parameter-specific, contributor-aware alerts |

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Charts | Inline SVG (no external libraries) |
| Engine | Pure client-side math functions |
| Deployment | Vercel |

**Zero external dependencies** for the risk engine — no chart libraries, no ML packages, no API calls.

---

## 🗂️ Project Structure

```
├── app/
│   ├── analyze/         # Analysis page with sliders and results
│   └── dashboard/       # Multi-domain overview
├── lib/
│   ├── engine/          # Pure math: normalization, risk index, XAI, prediction
│   └── domains/         # Domain configs (parameters, weights, ranges)
├── types/
│   └── index.ts         # TypeScript type definitions
└── components/          # Reusable UI components
```

---

## 🚀 Run Locally

```bash
git clone https://github.com/shuva-0/AquaSafe-x
cd AquaSafe-x
npm install
npm run dev
```

Open: `http://localhost:3000`

---

## 🎯 Usage

1. Open the live demo or run locally
2. Navigate to **Analyze**
3. Select a domain: **Water**, **Infrastructure**, or **Environment**
4. Adjust parameter sliders (or click **Simulate** for live scenarios)
5. Click **Analyze** to compute results
6. Review:
   - Risk Index gauge and severity
   - XAI contribution breakdown
   - Forecast and trend
   - Decision recommendations
7. Visit **Dashboard** for a cross-domain overview

---

## 📐 Design System

| Element | Value |
|---------|-------|
| Background | `#0f172a` |
| Surface | `#1e293b` |
| Border | `#334155` |
| Water domain | `#0ea5e9` |
| Infrastructure domain | `#f59e0b` |
| Environment domain | `#10b981` |
| Safe | `#10b981` |
| Warning | `#f59e0b` |
| Critical | `#ef4444` |
| Number font | Monospace |

---

## 🎯 Future Scope

- IoT sensor integration (real-time data streams)
- Geospatial risk mapping
- Government water & infrastructure system integration
- Advanced anomaly detection
- Mobile app deployment

---

## 🏁 Final Statement

Monitoring is not enough.

The gap between **measurement** and **decision** is where damage happens.

**AquaSafe Nexus X∞ closes that gap — predictively, explainably, and immediately.**

---

*Formula: `R = Σ(wᵢ · nᵢ) / Σ(wᵢ)` — deterministic, bounded, auditable.*
