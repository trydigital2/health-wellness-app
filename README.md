# 🌿 PulseFit — Health & Wellness Mobile App

> A modern, complete, local-first React Native mobile application built with **TypeScript**, **Redux Toolkit**, **React Navigation v7**, and **AsyncStorage** persistence.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-0.88-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.13-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![React Navigation](https://img.shields.io/badge/React_Navigation-v7-6B46C1?style=for-the-badge&logo=react&logoColor=white)](https://reactnavigation.org/)
[![Tests Passing](https://img.shields.io/badge/Tests-34%20Passing-10B981?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

---

## 📱 App Overview

**PulseFit** is a full-featured health and wellness tracker designed to help users establish consistent daily fitness habits. It works completely offline and local-first with mock biometric data, allowing immediate local exploration without requiring third-party API keys or external backends.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        APP INTERFACE PREVIEW                           │
├───────────────────┬───────────────────┬───────────────────┬────────────┤
│  🏠 Home Screen   │ 🏋️ Workout Catalog│  📊 Progress Tab  │ 👤 Profile │
│  - Step Ring      │ - 5 Categories    │ - 7-Day SVG Chart │ - Bio Form │
│  - Quick Logging  │ - Interactive     │ - Streak Counter  │ - Reminders│
│  - Hydration Log  │   Interval Timer  │ - Success Metrics │ - Targets  │
│  - Metrics Grid   │ - Session Summary │ - Period Toggle   │ - Reset    │
└───────────────────┴───────────────────┴───────────────────┴────────────┘
```

---

## ✨ Features

### 1. 🏠 Health Home Dashboard
- **SVG Circular Progress Ring**: Clean vector ring rendering real-time daily steps, goal threshold, and completion percentage.
- **Biometric Metric Cards**: Active minutes, active calories burned, and total workouts completed today.
- **Hydration Tracker**: Instant `+250 ml` log button with real-time hydration goal progress.
- **Live Reactivity Test Loggers**: `+500` and `+1,000` step buttons to verify live UI updates instantly.
- **7-Day Trend Preview**: Mini activity chart directly on the dashboard.
- **Profile Quick Access**: One-tap avatar button navigating to the Profile and Settings.

### 2. 🏋️ Workout Catalog & Active Session Tracker
- **5 Fitness Disciplines**: Filter workouts across **Cardio**, **Strength**, **HIIT**, **Flexibility**, and **Mindfulness**.
- **Real-Time Search**: Search workouts by title, target muscle groups, or routine tags.
- **Step-by-Step Routines**: Exercise instructions, target muscles, and recommended sets/reps or durations.
- **Interactive Workout Session Mode**:
  - Live seconds timer with `MM:SS` display.
  - Session controls: **Start**, **Pause**, **Resume**, **Next Step**, and **Finish Early**.
  - Live MET-based calorie burn calculation updating dynamically.
  - Congratulatory completion modal summarizing duration, calories, and exercises finished.
- **Workout History**: Dedicated tab tracking completed sessions with timestamps and statistics.

### 3. 📊 Health Progress & Analytics
- **Interactive 7-Day SVG Bar Chart**: Renders daily metrics with a dashed goal line and interactive touch tooltips.
- **Metric Switcher**: Toggle between **Steps**, **Active Minutes**, and **Calories**.
- **Period Switcher**: Analyze trends across **Day**, **Week**, and **Month** views.
- **Consistency Streak Counter**: Algorithm tracking unbroken daily goal achievements.
- **Aggregated Statistics**: Total steps, daily averages, weekly active time, and completion rates.

### 4. 👤 Profile, Goals & Settings
- **Profile Bio Editor**: Editable name, height (cm), weight (kg), and fitness level (Beginner, Intermediate, Advanced).
- **Customizable Wellness Targets**: Adjust daily step goals (e.g. 10,000) and active minutes targets.
- **Workout Reminders**: Daily reminder toggle, time picker (e.g. `08:30`), and test notification alert.
- **Unit System Switcher**: Toggle between **Metric** (km, kg) and **Imperial** (miles, lbs).
- **Data Reset**: Reset button to restore clean default demonstration data at any time.

### 5. 🔐 Client-Side Demo Authentication
- **Login & Register Screens**: Form inputs with validation for email format, password length, and name.
- **⚡ One-Tap Demo Fill**: Pre-populates valid demo credentials (`alex@healthwellness.demo` / `Wellness2026!`).
- **Local Persistence**: Stores session token and profile state safely in AsyncStorage.

---

## 📂 Project Architecture

All source code is cleanly organized in the **`HealthProject/`** directory:

```text
HealthProject/
├── App.tsx                     # Root component with Redux store & SafeArea providers
├── index.js                    # Application registry entry point
├── package.json                # "pulsefit-mobile" metadata & scripts
├── tsconfig.json               # TypeScript configuration with @/* path aliases
├── jest.config.js              # Unit testing configuration
├── .env.example                # Environment variables template
├── assets/                     # Custom app icon, splash logo, and vector graphics
│   └── images/
│       ├── icon.png            # PulseFit health leaf & heartbeat icon
│       └── splash-icon.png     # Glowing heartbeat splash logo
├── __tests__/                  # 34 Automated Jest tests
│   ├── calculations.test.ts    # MET calories, step distance, progress, streak
│   ├── formatters.test.ts      # MM:SS duration, dates, and number formatting
│   ├── validators.test.ts      # Form validation and input verification
│   └── redux.test.ts           # Redux slices and state mutation tests
└── src/
    ├── components/             # Reusable UI component library
    │   ├── Button.tsx          # Primary, secondary, outline, danger variants
    │   ├── Header.tsx          # Navigation header with back button
    │   ├── InputField.tsx      # Text input with validation and password toggle
    │   ├── Card.tsx            # Elevated, bordered, and pressable container
    │   ├── ProgressRing.tsx    # SVG circular step progress indicator
    │   ├── WeeklyBarChart.tsx  # Interactive 7-day SVG chart with goal line
    │   ├── StatBadge.tsx       # Pill badges for categories and statuses
    │   ├── DemoBanner.tsx      # Transparent demo mode indicator
    │   ├── icons/              # Dedicated SVG health tab icons (ECG, Barbell, etc.)
    │   └── index.ts
    ├── config/
    │   └── app-env.ts          # Application environment parameters
    ├── constants/              # Centralized design & configuration tokens
    │   ├── COLORS.ts           # Emerald & Teal design palette tokens
    │   ├── STRINGS.ts          # User-facing string dictionaries
    │   ├── ROUTES.ts           # Typed route identifiers
    │   ├── API_ENDPOINTS.ts    # REST endpoints structure for future APIs
    │   ├── DIMENSIONS.ts       # Responsive layout and spacing metrics
    │   ├── defaults.ts         # Initial mock profiles and default targets
    │   └── index.ts
    ├── data/                   # Realistic demonstration datasets
    │   ├── mockWorkouts.ts     # Routines with detailed exercises & instructions
    │   └── mockActivities.ts   # 7-day trend metrics and initial history
    ├── hooks/                  # Custom React hooks
    │   ├── useAuth.tsx         # Auth context and session management
    │   ├── useWorkouts.ts      # Workout filters and session saving
    │   ├── useActivity.ts      # Activity metrics and step logger
    │   ├── useSettings.ts      # Preferences and notification triggers
    │   └── index.ts
    ├── i18n/ & languages/      # Localization dictionary (en.ts)
    ├── navigation/             # Navigation stacks and navigators
    │   ├── RootNavigator.tsx   # Auth status hydration & stack switcher
    │   ├── AppNavigator.tsx    # Bottom tabs (Home, Workouts, Progress, Profile) & WorkoutDetail
    │   └── AuthNavigator.tsx   # Native stack for Login and Register
    ├── redux/                  # Redux Toolkit centralized store
    │   ├── store.ts            # Store configuration and RootState / AppDispatch types
    │   ├── hooks.ts            # Typed useAppDispatch and useAppSelector
    │   └── slices/             # Feature slices: auth, workout, activity, settings
    ├── screens/                # Functional application screens
    │   ├── auth/
    │   │   ├── LoginScreen.tsx
    │   │   └── RegisterScreen.tsx
    │   └── main/
    │       ├── HomeScreen.tsx
    │       ├── WorkoutsScreen.tsx
    │       ├── WorkoutDetailScreen.tsx
    │       ├── ProgressScreen.tsx
    │       └── ProfileScreen.tsx
    ├── services/               # Persistent and native device services
    │   ├── storage.ts          # Typed AsyncStorage persistence wrapper
    │   ├── notifications.ts    # Notification permission & reminder scheduler
    │   └── authService.ts      # Client-side authentication logic
    ├── types/                  # TypeScript interface contracts
    └── utils/                  # Mathematical and formatting utilities
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v22.x verified)
- **Package Manager**: npm, yarn, or bun
- **Simulator / Device**: iOS Simulator (Xcode) or Android Emulator (Android Studio)

### 2. Navigate & Verify
```bash
# Navigate to the HealthProject folder
cd HealthProject

# Verify TypeScript (0 errors)
npm run typecheck

# Run automated tests (34 passing)
npm test
```

### 3. Run the App

#### Running with Metro / Expo Bundler (Recommended)
```bash
# Start Metro bundler
npm start

# Run directly on iOS Simulator
npm run ios

# Run directly on Android Emulator
npm run android

# Run on Web Browser
npm run web
```

#### Running with Bare React Native CLI
```bash
# Start React Native Metro server
npm run start:rn

# Launch on connected Android device / emulator
npx react-native run-android

# Launch on iOS simulator
npx react-native run-ios
```

---

## 🧪 Automated Testing

All core calculation formulas, string formatters, input validators, and Redux reducers are covered by automated unit tests:

```bash
cd HealthProject
npm test
```

```text
PASS __tests__/calculations.test.ts
PASS __tests__/formatters.test.ts
PASS __tests__/validators.test.ts
PASS __tests__/redux.test.ts

Test Suites: 4 passed, 4 total
Tests:       34 passed, 34 total
Snapshots:   0 total
Time:        1.26 s
```

---

## 🐙 Push to GitHub

To push this repository to GitHub:

```bash
# 1. Create a repository on GitHub named: pulsefit-mobile
# (Leave "Initialize with README" unchecked)

# 2. Stage and commit all changes
git add .
git commit -m "feat: complete PulseFit health & wellness mobile app"

# 3. Add your GitHub remote and push
git remote add origin https://github.com/YOUR_USERNAME/pulsefit-mobile.git
git branch -M main
git push -u origin main
```

---

## 📄 License
This project is open-source and available under the [MIT License](HealthProject/LICENSE).
