# Algebra Adventure Game - Complete Overview & Technical Documentation

![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Android-orange.svg)

## 📖 Table of Contents

- [Overview](#overview)
- [Educational Framework](#educational-framework)
- [Game Structure](#game-structure)
- [Technical Stack](#technical-stack)
- [Architecture](#architecture)
- [Mission & NPC Mapping](#mission--npc-mapping)
- [Question System](#question-system)
- [Installation & Setup](#installation--setup)
- [Development](#development)
- [Deployment](#deployment)
- [Features](#features)

---

## 🎮 Overview

**Algebra Adventure** is an interactive educational game that teaches algebra through real-world problem-solving within the context of Philippine government structure. Players progress through 50 missions across 5 government levels, learning mathematics while gaining civic education.

### Key Highlights

- **50 Comprehensive Missions** spanning basic arithmetic to expert-level algebra
- **Philippine Government Integration** - Learn about Barangay to National government structure
- **Real-world Applications** - Every math problem relates to authentic Filipino scenarios
- **Progressive Difficulty** - Carefully designed curriculum from Grade 7 to advanced topics
- **Gamified Learning** - Engaging gameplay with NPCs, quests, collectibles, and rewards

---

## 📚 Educational Framework

### Learning Objectives

#### 1. Mathematics Mastery
- Progress from basic arithmetic to advanced algebra
- 50 comprehensive missions with real-world applications
- Topics include: equations, functions, polynomials, matrices, complex numbers, and more

#### 2. Civic Education
- Learn Philippine government structure (Barangay → City → Province → Region → National)
- Understand roles of different government agencies
- Appreciate public service careers and STEM opportunities

#### 3. Cultural Relevance
- Authentic Filipino context and scenarios
- Philippine government positions and agencies
- Local currency (₱) and culturally relevant examples

#### 4. Career Awareness
- Exposure to various professions (vendors, engineers, scientists, government officials)
- Government career paths (DepEd, DOST, NEDA, etc.)
- STEM career opportunities

---

## 🏛️ Game Structure

### Government Hierarchy (5 Levels)

```
LEVEL 1: BARANGAY (Missions 1-10)
├─ Community Level - Basic Algebra
├─ NPCs: Local vendors, teachers, community officials
└─ Topics: Arithmetic, percentages, simple equations

LEVEL 2: CITY (Missions 11-20)
├─ Municipal Level - Intermediate Algebra
├─ NPCs: Business professionals, urban planners
└─ Topics: Linear equations, business math, optimization

LEVEL 3: PROVINCE (Missions 21-30)
├─ Provincial Government - Advanced Algebra
├─ NPCs: Provincial officials and department heads
└─ Topics: Quadratics, systems, advanced functions

LEVEL 4: REGION (Missions 31-40)
├─ Regional Government - Mastery Level
├─ NPCs: Regional directors of national agencies
└─ Topics: Polynomials, matrices, complex functions

LEVEL 5: NATIONAL (Missions 41-50)
├─ National Government - Expert Level
├─ NPCs: Cabinet secretaries, national scientists
└─ Topics: Complex numbers, proofs, advanced theorems
```

### Philippine Government Agencies Featured

- **DepEd** - Department of Education
- **DOST** - Department of Science and Technology
- **CHED** - Commission on Higher Education
- **NEDA** - National Economic and Development Authority
- **PAGASA** - Philippine Atmospheric, Geophysical and Astronomical Services Administration
- **PSA** - Philippine Statistics Authority
- **DBM** - Department of Budget and Management
- **DTI** - Department of Trade and Industry
- **DA** - Department of Agriculture
- **DOH** - Department of Health
- **DPWH** - Department of Public Works and Highways
- **DSWD** - Department of Social Welfare and Development
- **DILG** - Department of Interior and Local Government

---

## 💻 Technical Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3.1 | React framework for web application |
| **React** | 19.0.0 | UI library for component-based architecture |
| **TypeScript** | 5.x | Type-safe JavaScript development |
| **Phaser** | 3.90.0 | Game engine for 2D gameplay |
| **TailwindCSS** | 3.3.0 | Utility-first CSS framework |
| **Supabase** | 2.75.0 | Backend as a Service (authentication, database) |
| **Capacitor** | 6.2.1 | Cross-platform mobile deployment |

### Development Tools

- **Lucide React** - Icon library
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **ESLint** - Code linting

### Platform Support

- ✅ **Web** - Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ **Android** - APK build via Capacitor
- ✅ **PWA** - Progressive Web App support

---

## 🏗️ Architecture

### Project Structure

```
FIONA/
├── src/
│   ├── app/                    # Next.js app directory
│   ├── game/                   # Phaser game logic
│   │   ├── scenes/            # Game scenes (Boot, Preloader, Game, etc.)
│   │   ├── PhaserGame.tsx     # Phaser-React integration
│   │   └── EventBus.ts        # Event communication system
│   ├── components/            # React UI components
│   │   ├── EnhancedQuizSystem.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── Shop.tsx
│   │   └── ...
│   ├── lib/                   # Utility libraries
│   │   └── supabase.ts        # Supabase client
│   └── types/                 # TypeScript type definitions
├── public/
│   ├── assets/
│   │   ├── audio/             # Sound effects and music
│   │   ├── images/            # Sprites, backgrounds, UI
│   │   └── maps/              # Tilemap JSON files
│   └── icons/                 # PWA icons
├── documentation/             # Game documentation
├── android/                   # Capacitor Android project
└── dist/                      # Build output
```

### Key Systems

#### 1. **Game Engine (Phaser 3)**
- Scene management (Boot → Preloader → MainMenu → Game)
- Sprite rendering and animation
- Physics and collision detection
- Tilemap integration for multi-level maps

#### 2. **Quiz System**
- 50 unique questions stored in `src/App.tsx`
- Multiple choice format with 4 options
- Detailed explanations and step-by-step solutions
- Formula references and hints
- Dynamic difficulty progression

#### 3. **NPC Interaction System**
- 50 unique NPCs mapped to missions
- Dialog system with quest progression
- Mission completion tracking
- Reward distribution

#### 4. **Leaderboard System**
- Real-time score tracking via Supabase
- Global rankings
- Player statistics and achievements
- Secure data validation

#### 5. **Shop & Reward System**
- In-game currency (coins)
- Purchasable items and power-ups
- Collectibles and achievements
- Progress-based unlocks

#### 6. **Collision System**
- Custom collision editor
- Multi-map collision data
- Debug mode for testing
- Optimized collision detection

#### 7. **Timer System**
- Mission time tracking
- Performance metrics
- Speed-run challenges
- Time-based rewards

---

## 🗺️ Mission & NPC Mapping

### Level 1: BARANGAY (Missions 1-10)

| Mission | NPC | Topic | Location |
|---------|-----|-------|----------|
| 1 | Vendor Mang Pedro | Market calculations | Barangay Market |
| 2 | Store Owner Aling Maria | Discounts & percentages | Barangay Store |
| 3 | Coach Miguel | Perimeter & geometry | Sports Court |
| 4 | Baker Tess | Unit conversions | Barangay Bakery |
| 5 | Student Leader Ana | Basic budgeting | Barangay School |
| 6 | Gardener Noel | Area calculations | Barangay Garden |
| 7 | Math Teacher Mrs. Cruz | Number patterns | Barangay School |
| 8 | Shop Owner Danny | Unit price comparison | Barangay Shop |
| 9 | Parent Rosa | Family budgeting | Barangay Home |
| 10 | Banker Mr. Santos | Savings & interest | Barangay Cooperative |

### Level 2: CITY (Missions 11-20)

| Mission | NPC | Topic | Location |
|---------|-----|-------|----------|
| 11 | Entrepreneur Carlos | Business profit | Business District |
| 12 | Accountant Lisa | Revenue projections | Finance Office |
| 13 | Logistics Manager Ben | Route optimization | Logistics Center |
| 14 | Sales Director Kim | Growth rates | Sales Office |
| 15 | Urban Planner Gina | Area division | Planning Office |
| 16 | Transit Manager Roy | Speed & distance | Transit Hub |
| 17 | Architect Maya | Height calculations | Architecture Firm |
| 18 | City Planner Tom | Population statistics | Planning Dept |
| 19 | Engineer Sarah | Material quantities | Engineering Office |
| 20 | Transport Chief Mike | Fare calculations | Transport Office |

### Level 3: PROVINCE (Missions 21-30)

| Mission | NPC | Agency | Topic |
|---------|-----|--------|-------|
| 21 | Provincial Budget Officer | Budget Office | Budget allocation |
| 22 | Provincial Planning Officer | Planning Office | Revenue modeling |
| 23 | Provincial Engineer | Engineering Office | Infrastructure planning |
| 24 | Provincial Treasurer | Treasury | Cost analysis |
| 25 | Provincial Administrator | Admin Office | Policy coordination |
| 26 | Provincial Agriculturist | Agriculture Office | Operations optimization |
| 27 | Provincial Assessor | Assessor's Office | Land planning |
| 28 | Provincial Health Officer | Health Office | Resource management |
| 29 | Provincial Social Welfare Officer | Social Welfare | Investment analysis |
| 30 | Provincial Governor | Governor's Office | Strategic planning |

### Level 4: REGION (Missions 31-40)

| Mission | NPC | Agency | Topic |
|---------|-----|--------|-------|
| 31 | RDC Director | Regional Development Council | Complex quadratics |
| 32 | NEDA Regional Director | NEDA | Polynomial division |
| 33 | DepEd Regional Director | DepEd | Function composition |
| 34 | DOST Regional Director | DOST | Advanced factoring |
| 35 | DTI Regional Director | DTI | Rational functions |
| 36 | DA Regional Director | DA | Exponential models |
| 37 | DOH Regional Director | DOH | Logarithmic analysis |
| 38 | DPWH Regional Director | DPWH | Matrix systems |
| 39 | DSWD Regional Director | DSWD | Sequence patterns |
| 40 | DILG Regional Director | DILG | Advanced inequalities |

### Level 5: NATIONAL (Missions 41-50)

| Mission | NPC | Agency | Topic |
|---------|-----|--------|-------|
| 41 | DepEd Undersecretary | DepEd Central | Radical equations |
| 42 | DOST Secretary | DOST | Complex numbers |
| 43 | CHED Commissioner | CHED | Polynomial theorems |
| 44 | NEDA Director General | NEDA | Advanced matrices |
| 45 | National Scientist | NAST | Conic sections |
| 46 | PAGASA Administrator | PAGASA | Parametric equations |
| 47 | PSA Administrator | PSA | Advanced sequences |
| 48 | Senate Education Chair | Philippine Senate | Binomial theorem |
| 49 | DBM Secretary | DBM | Partial fractions |
| 50 | DepEd Secretary | DepEd Main Office | Mathematical proofs |

---

## ❓ Question System

### Question Structure

Each of the 50 missions has a corresponding quiz question stored in `src/App.tsx`:

```typescript
{
  question: string;        // The math problem text
  options: string[];       // Array of 4 multiple choice answers
  correctAnswer: number;   // Index of correct answer (0-3)
  explanation: string;     // Detailed solution explanation
  steps: string[];        // Step-by-step solution breakdown
  formula: string;        // Mathematical formula used
  hints: string[];        // Helpful solving hints
}
```

### Sample Questions by Level

#### Level 1 (Barangay) - Basic Algebra
**Q1 (Vendor Mang Pedro):** During a 20% off sale, a shirt costs ₱240. What was its original price?
- **Answer:** ₱300
- **Topic:** Percentage calculations

**Q6 (Gardener Noel):** Garden area x² + 7x + 12 m². Factor to find dimensions.
- **Answer:** (x + 3) by (x + 4)
- **Topic:** Factoring quadratics

#### Level 2 (City) - Intermediate Algebra
**Q13 (Logistics Manager Ben):** Revenue R = -2p² + 80p. What price maximizes revenue?
- **Answer:** ₱20
- **Topic:** Quadratic optimization

**Q17 (Architect Maya):** Budget [40, 30, 30]% of ₱500M. Education allocation?
- **Answer:** ₱200M
- **Topic:** Matrix operations

#### Level 3 (Province) - Advanced Algebra
**Q23 (Provincial Engineer):** Solve √(2x + 5) = 7
- **Answer:** x = 22
- **Topic:** Radical equations

**Q28 (Provincial Health Officer):** Solve 2x + y = 8, x - y = 1
- **Answer:** x = 3, y = 2
- **Topic:** Systems of equations

#### Level 4 (Region) - Mastery Level
**Q31 (RDC Director):** Solve 3-variable system: x + y + z = 12, 2x - y + z = 5, x + 2y - z = 8
- **Answer:** x = 3
- **Topic:** 3-variable systems

**Q37 (DOH Regional Director):** If f(x) = 2x - 3 and g(x) = x² + 1, find (f ∘ g)(2)
- **Answer:** 7
- **Topic:** Function composition

#### Level 5 (National) - Expert Level
**Q42 (DOST Secretary):** Simplify complex number: (3 + 2i)(1 - 4i)
- **Answer:** 11 - 10i
- **Topic:** Complex numbers

**Q45 (National Scientist):** Expand using Binomial Theorem: (x + 2)⁴
- **Answer:** x⁴ + 8x³ + 24x² + 32x + 16
- **Topic:** Binomial theorem

### Difficulty Progression

```
Missions 1-10:  Basic arithmetic, percentages, simple equations
Missions 11-20: Intermediate algebra, linear equations, word problems
Missions 21-30: Advanced algebra, systems, quadratics
Missions 31-40: Mastery algebra, polynomials, functions
Missions 41-50: Expert algebra, complex numbers, proofs
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn**
- **Git**

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd FIONA
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the template
cp ENV_TEMPLATE.txt .env

# Edit .env with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
```
http://localhost:8080
```

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `SUPABASE_SCHEMA.sql`
3. Copy your project URL and anon key to `.env`

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with logging
npm run dev-nolog        # Start dev server without logging

# Build
npm run build            # Production build with logging
npm run build-nolog      # Production build without logging
npm run export           # Export static site

# Mobile (Android)
npm run build:capacitor  # Build for Capacitor
npm run mobile:sync      # Sync web assets to mobile
npm run mobile:open:android          # Open Android Studio
npm run mobile:build:android         # Build debug APK
npm run mobile:build:android:release # Build release APK
```

### Development Workflow

1. **Make changes** to source files in `src/`
2. **Test locally** using `npm run dev`
3. **Build** using `npm run build`
4. **Test production build** locally
5. **Deploy** to hosting platform

### Adding New Missions

1. Add NPC data to mission configuration
2. Add question to `src/App.tsx` questions object
3. Update collision data for NPC placement
4. Test mission flow and quiz functionality

---

## 📦 Deployment

### Web Deployment

**Vercel (Recommended)**
```bash
npm run build
# Deploy via Vercel CLI or GitHub integration
```

**Netlify**
```bash
npm run build
# Deploy dist/ folder
```

### Android APK Build

**Quick Build**
```bash
npm run build:capacitor
cd android
./gradlew assembleDebug
```

**Release Build**
```bash
npm run build:capacitor
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/`

See `APK_BUILD_GUIDE.md` for detailed instructions.

### PWA Deployment

The game includes PWA support with:
- Service worker for offline functionality
- App manifest for installation
- Optimized icons (192x192, 512x512)
- Splash screens

See `PWA_SETUP_GUIDE.md` for details.

---

## ✨ Features

### Core Gameplay
- ✅ 50 unique missions across 5 government levels
- ✅ Interactive NPC dialog system
- ✅ Real-time quiz system with explanations
- ✅ Progressive difficulty curve
- ✅ Multiple game maps (Barangay, City, Province, Region, National)

### Educational Features
- ✅ Comprehensive algebra curriculum (Grade 7 to advanced)
- ✅ Step-by-step solution explanations
- ✅ Formula references and hints
- ✅ Real-world problem applications
- ✅ Philippine government civic education

### Game Systems
- ✅ **Leaderboard** - Global rankings and statistics
- ✅ **Shop System** - Purchasable items and upgrades
- ✅ **Collectibles** - Hidden items and achievements
- ✅ **Timer System** - Performance tracking
- ✅ **Secret Quests** - Hidden challenges
- ✅ **Collision Editor** - Custom map collision data

### Technical Features
- ✅ **Cross-platform** - Web, Android, PWA
- ✅ **Responsive UI** - Works on all screen sizes
- ✅ **Cloud Save** - Progress saved via Supabase
- ✅ **Offline Support** - PWA capabilities
- ✅ **Performance Optimized** - Fast loading and smooth gameplay

### UI/UX
- ✅ Modern, clean interface
- ✅ Intuitive controls
- ✅ Visual feedback and animations
- ✅ Accessibility considerations
- ✅ Mobile-friendly touch controls

---

## 📄 Documentation

Additional documentation available in the `documentation/` folder and root directory:

- `ARCHITECTURE.md` - System architecture overview
- `GAME_FEATURES_DOCUMENTATION.md` - Detailed feature documentation
- `LEADERBOARD_SETUP_GUIDE.md` - Leaderboard implementation
- `SHOP_REWARD_SYSTEM_DOCUMENTATION.md` - Shop system details
- `COLLISION_EDITOR_DOCUMENTATION.md` - Collision system guide
- `SECRET_QUEST_SYSTEM_DOCUMENTATION.md` - Secret quest mechanics
- `TIMER_SYSTEM_DOCUMENTATION.md` - Timer implementation
- `APK_BUILD_GUIDE.md` - Android build instructions
- `PWA_SETUP_GUIDE.md` - PWA configuration

---

## 📊 Game Statistics

- **Total Missions:** 50
- **Government Levels:** 5 (Barangay → National)
- **Unique NPCs:** 50
- **Quiz Questions:** 50
- **Government Agencies Featured:** 13+
- **Math Topics Covered:** 30+
- **Supported Platforms:** 3 (Web, Android, PWA)

---

## 🎯 Learning Outcomes

Upon completing all 50 missions, players will have mastered:

### Mathematics
- ✅ Basic arithmetic and percentages
- ✅ Linear equations and inequalities
- ✅ Quadratic equations and factoring
- ✅ Systems of equations (2 and 3 variables)
- ✅ Polynomial operations and theorems
- ✅ Functions and function composition
- ✅ Exponential and logarithmic functions
- ✅ Matrices and determinants
- ✅ Complex numbers
- ✅ Sequences and series
- ✅ Conic sections
- ✅ Mathematical proofs and reasoning

### Civic Knowledge
- ✅ Philippine government structure
- ✅ Roles of different government levels
- ✅ Functions of major government agencies
- ✅ Public service career paths
- ✅ Government decision-making processes

---

## 🤝 Contributing

This is an educational project. For contributions or suggestions, please refer to the project maintainers.

---

## 📝 License

MIT License - See `LICENSE` file for details.

---

## 🙏 Acknowledgments

- **Phaser** - Game engine framework
- **Next.js** - React framework
- **Supabase** - Backend infrastructure
- **Philippine Government** - Structural inspiration for educational content

---

## 📞 Support

For technical issues or questions, refer to the documentation files or contact the development team.

---

**Version:** 1.2.0  
**Last Updated:** December 2024  
**Platform:** Web | Android | PWA  
**Target Audience:** Students (Grade 7+), Educators, Math Learners

---

*Algebra Adventure - Making Math Fun Through Civic Engagement* 🎮📐🇵🇭
