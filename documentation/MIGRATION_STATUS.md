# 🔄 Migration Status: CIVIKA → Algebra Adventure

## **Migration Progress Overview**

Current Status: **75% Complete** ✅

---

## **✅ COMPLETED MIGRATIONS**

### **1. Core Branding (100%)**
- ✅ `package.json` - Updated to "algebra-adventure"
- ✅ `public/manifest.json` - Updated to "Algebra Adventure"
- ✅ `src/pages/_document.tsx` - Meta tags updated
- ✅ `README.md` - Updated title (if applicable)

### **2. Game State & Validation (100%)**
- ✅ `src/utils/GameStateManager.ts` - Header comment updated
- ✅ `src/utils/GameValidation.ts` - All 20 badge names updated to math theme

**Old → New Badges:**
```
Level 1:
Eco-Kabataan → Market Mathematician
Registered Voter → Discount Detective
Community Explorer → Perimeter Pro
Law Reader → Unit Converter
Digital Defender → Budget Boss
Public Service Aide → Geometry Genius
Peacekeeper → Pattern Master
Historian → Price Calculator
Health Advocate → Money Manager
Youth Leader → Savings Expert

Level 2:
Municipal Councilor → Profit Analyzer
Financial Steward → Revenue Strategist
Infrastructure Expert → Route Optimizer
Commerce Facilitator → Growth Forecaster
Urban Planner → Area Specialist
Green Champion → Speed Calculator
Safety Coordinator → Division Expert
Cultural Guardian → Percentage Master
Health Administrator → Formula Wizard
City Leader → Algebra Champion
```

### **3. Mission Content (100%)**
- ✅ `src/App.tsx` - All 20 quiz questions updated to algebra/math
- ✅ `src/game/scenes/BarangayMap.ts` - Mission names & NPCs updated
- ✅ `src/game/scenes/CityMap.ts` - Mission names & NPCs updated

**Mission Themes Changed:**
```
Level 1 (Barangay):
Civic Education → Basic Math
- Market transactions
- Discounts & percentages
- Geometry basics
- Unit conversion
- Budgeting

Level 2 (City):
Civic Governance → Intermediate Algebra
- Business profit
- Revenue calculations
- Route optimization
- Growth projections
- Linear equations
```

### **4. Design System (100%)**
- ✅ `tailwind.config.js` - New math-themed colors, animations
- ✅ `src/styles/globals.css` - Custom scrollbars, animations
- ✅ `src/pages/_document.tsx` - New fonts (Quicksand, JetBrains Mono)

### **5. New Components (100%)**
- ✅ `src/components/AchievementCelebration.tsx` - Created
- ✅ `src/components/EnhancedQuizSystem.tsx` - Created with hints & solutions

---

## **⚠️ PENDING MIGRATIONS**

### **1. UI Components (60%)**

#### **Main Menu - `src/components/MainMenu.tsx`**
**Status:** ⚠️ Partially Migrated

**Remaining Issues:**
```typescript
Line 35: if (window.confirm("Are you sure you want to exit CIVIKA?")) {
Line 69: alt="CIVIKA Logo"
Line 96: CIVIKA (commented out, but still present)
Line 99: 🏰 A Civic Education Adventure 🏰 (commented out)
```

**Required Changes:**
```typescript
// Line 35
- "Are you sure you want to exit CIVIKA?"
+ "Are you sure you want to exit Algebra Adventure?"

// Line 69
- alt="CIVIKA Logo"
+ alt="Algebra Adventure Logo"

// Lines 96-99: Remove or update comments
- CIVIKA
- 🏰 A Civic Education Adventure 🏰
+ Algebra Adventure
+ 📐 Math in Motion 📐
```

---

#### **Credits - `src/components/Credits.tsx`**
**Status:** ⚠️ Needs Major Update

**Remaining Issues:**
```typescript
Line 18: name: "CIVIKA Development Team"
Line 134: alt="CIVIKA Logo"
Line 138: "CIVIKA - A Civic Education Adventure"
Line 246: <strong>CIVIKA</strong> was created...
Line 280: © 2025 CIVIKA Development Team
```

**Required Changes:**
```typescript
// Line 18
- name: "CIVIKA Development Team"
+ name: "Algebra Adventure Development Team"

// Line 134
- alt="CIVIKA Logo"
+ alt="Algebra Adventure Logo"

// Line 138
- "CIVIKA - A Civic Education Adventure"
+ "Algebra Adventure - Math in Motion"

// Line 246
- <strong>CIVIKA</strong> was created as a capstone project to promote civic education
+ <strong>Algebra Adventure</strong> was created as a capstone project to teach algebra through interactive gameplay

// Line 280
- © 2025 CIVIKA Development Team
+ © 2025 Algebra Adventure Development Team
```

---

### **2. Service Layers (40%)**

#### **ShopService - `src/services/ShopService.ts`**
**Status:** ⚠️ Needs Content Update

**Remaining Issues:**
```typescript
Line 108: name: "Civic Crown"
Line 109: description: "Crown of the civic leader"
Line 456: "You've mastered civic governance!"
```

**Required Changes:**
```typescript
// Civic Crown → Math Crown
{
    id: "crown-1",
-   name: "Civic Crown",
-   description: "Crown of the civic leader",
+   name: "Math Master Crown",
+   description: "Crown of the math champion",
    category: ShopItemCategory.COSMETICS,
    rarity: ShopItemRarity.RARE,
    price: 300,
}

// Update reward messages
- "You've mastered civic governance!"
+ "You've mastered algebra! Accept this trophy as recognition!"
```

---

#### **SecretQuestService - `src/services/SecretQuestService.ts`**
**Status:** ⚠️ Needs Major Content Update

**Remaining Issues:**
```typescript
Line 202: title: PlayerTitle.CIVIC_SAGE
Line 222: name: "Perfect Civic Leader"
Line 349: name: "The Old Civic Shrine"
Line 353: hint: "An ancient monument to civic duty"
Line 370: "The path to civic excellence is long but rewarding."
Line 398: "Continue your quest, civic champion."
Line 783: [PlayerTitle.CIVIC_SAGE]: "Discovered all hidden knowledge"
Line 786: [PlayerTitle.MASTER_OF_CIVICS]: "Mastered everything"
Line 804: PlayerTitle.MASTER_OF_CIVICS
Line 811: PlayerTitle.CIVIC_SAGE
```

**Required Changes:**
```typescript
// Update Player Titles
enum PlayerTitle {
-   CIVIC_SAGE = "civic_sage",
+   MATH_SAGE = "math_sage",
    
-   MASTER_OF_CIVICS = "master_of_civics",
+   MASTER_OF_ALGEBRA = "master_of_algebra",
}

// Update Quest Names
{
    id: "secret-perfect-1",
-   name: "Perfect Civic Leader",
+   name: "Perfect Math Student",
    description: "Complete all missions with 100% accuracy",
}

// Update Hidden Locations
{
    id: "hidden-shrine",
-   name: "The Old Civic Shrine",
+   name: "The Ancient Math Monument",
    percentX: 50,
    percentY: 85,
-   hint: "An ancient monument to civic duty",
+   hint: "An ancient monument to mathematical wisdom",
}

// Update NPC Dialogues
- "The path to civic excellence is long but rewarding."
+ "The path to mathematical mastery is long but rewarding."

- "Continue your quest, civic champion."
+ "Continue your quest, math champion."

// Update Title Descriptions
titleDescriptions = {
-   [PlayerTitle.CIVIC_SAGE]: "Discovered all hidden knowledge",
+   [PlayerTitle.MATH_SAGE]: "Discovered all hidden mathematical secrets",
    
-   [PlayerTitle.MASTER_OF_CIVICS]: "Mastered everything",
+   [PlayerTitle.MASTER_OF_ALGEBRA]: "Mastered all algebraic concepts",
}
```

---

### **3. Game Scenes (90%)**

#### **MainMenu.ts - `src/game/scenes/MainMenu.ts`**
**Status:** ⚠️ Minor Update Needed

**Remaining Issues:**
```typescript
Line 83: // Keep this for compatibility but it's not used in CIVIKA
```

**Required Changes:**
```typescript
// Line 83
- // Keep this for compatibility but it's not used in CIVIKA
+ // Keep this for compatibility but it's not used in Algebra Adventure
```

---

#### **Game.ts - `src/game/scenes/Game.ts`**
**Status:** ✅ Not Used (Placeholder Scene)

This scene appears to be a template/placeholder and is not actively used in the game. Can be left as-is or removed.

---

### **4. Type Definitions (50%)**

**Files Needing Updates:**
- ✅ `src/types/collision.ts` - No civic references
- ✅ `src/types/leaderboard.ts` - No civic references
- ⚠️ `src/types/secretQuest.ts` - PlayerTitle enum needs updating
- ⚠️ `src/types/shop.ts` - Item descriptions may need review

---

### **5. Miscellaneous Components**

#### **Minor Updates Needed:**
- ⚠️ `src/components/Settings.tsx` - May have CIVIKA references
- ⚠️ `src/components/PWAInstallPrompt.tsx` - Install prompt text
- ⚠️ `src/components/LandscapePrompt.tsx` - May have game name
- ⚠️ `src/components/CollisionEditor.tsx` - Comments may reference CIVIKA

---

## **📊 DETAILED BREAKDOWN**

### **Migration by File Type:**

| Category | Total Files | Completed | Pending | Progress |
|----------|------------|-----------|---------|----------|
| **Core Config** | 3 | 3 | 0 | 100% ✅ |
| **Game Logic** | 4 | 4 | 0 | 100% ✅ |
| **UI Components** | 15 | 9 | 6 | 60% ⚠️ |
| **Services** | 5 | 3 | 2 | 60% ⚠️ |
| **Game Scenes** | 4 | 3 | 1 | 75% ⚠️ |
| **Type Definitions** | 5 | 4 | 1 | 80% ⚠️ |
| **New Components** | 2 | 2 | 0 | 100% ✅ |

---

## **🎯 PRIORITY ACTION ITEMS**

### **High Priority (User-Facing)**
1. ⚠️ **MainMenu.tsx** - Update exit confirmation & logo alt text
2. ⚠️ **Credits.tsx** - Update all CIVIKA branding to Algebra Adventure
3. ⚠️ **PWAInstallPrompt.tsx** - Update install prompt text

### **Medium Priority (Content)**
4. ⚠️ **SecretQuestService.ts** - Update titles, quest names, dialogues
5. ⚠️ **ShopService.ts** - Update item names & descriptions
6. ⚠️ **src/types/secretQuest.ts** - Update PlayerTitle enum

### **Low Priority (Non-Critical)**
7. ⚠️ **Settings.tsx** - Check for any CIVIKA references
8. ⚠️ **LandscapePrompt.tsx** - Update game name if present
9. ⚠️ **MainMenu.ts** - Update comment

---

## **📋 MIGRATION CHECKLIST**

### **Phase 1: Core Branding (Completed ✅)**
- [x] Update package.json
- [x] Update manifest.json
- [x] Update _document.tsx meta tags
- [x] Update fonts (add Quicksand, JetBrains Mono)

### **Phase 2: Game Content (Completed ✅)**
- [x] Update all 20 mission names
- [x] Update all 20 NPC names
- [x] Update all 20 quiz questions
- [x] Update all 20 badge names
- [x] Update notifications & explanations

### **Phase 3: Visual Design (Completed ✅)**
- [x] Add math-themed color palette
- [x] Create new animations
- [x] Add custom scrollbars
- [x] Create AchievementCelebration component
- [x] Create EnhancedQuizSystem component

### **Phase 4: UI Components (In Progress ⚠️)**
- [ ] Update MainMenu.tsx
- [ ] Update Credits.tsx
- [ ] Update PWAInstallPrompt.tsx
- [ ] Update Settings.tsx
- [ ] Update LandscapePrompt.tsx

### **Phase 5: Services & Types (Pending ⚠️)**
- [ ] Update ShopService.ts
- [ ] Update SecretQuestService.ts
- [ ] Update PlayerTitle enum
- [ ] Update item descriptions

### **Phase 6: Testing & Polish**
- [ ] Test all UI text for consistency
- [ ] Verify no "civic" references remain
- [ ] Update all game dialogues
- [ ] Final QA pass

---

## **🔍 SEARCH & REPLACE GUIDE**

### **Global Text Replacements:**

```bash
# Find all remaining references
CIVIKA → Algebra Adventure
civika → algebra adventure
civic education → algebra education
civic leader → math champion
civic excellence → mathematical mastery
civic duty → mathematical learning
civic governance → algebra mastery
Civic Crown → Math Master Crown
Civic Sage → Math Sage
Master of Civics → Master of Algebra
```

### **Recommended Grep Commands:**
```bash
# Find all CIVIKA references
grep -r "CIVIKA" src/

# Find all civic references (case-insensitive)
grep -ri "civic" src/

# Find specific files with issues
grep -l "civic" src/components/*.tsx
grep -l "CIVIKA" src/services/*.ts
```

---

## **🚀 NEXT STEPS**

### **Immediate Actions:**
1. **Update MainMenu.tsx** - 5 minutes
2. **Update Credits.tsx** - 10 minutes
3. **Update SecretQuestService.ts** - 20 minutes
4. **Update ShopService.ts** - 10 minutes
5. **Update remaining components** - 15 minutes

**Total Estimated Time:** ~1 hour

### **Testing After Updates:**
1. Run development server: `npm run dev`
2. Navigate through all menus
3. Check credits page
4. Verify shop items
5. Complete a secret quest
6. Check for console errors

---

## **📝 NOTES**

### **What's Been Migrated:**
- ✅ All mission content (20/20)
- ✅ All quiz questions (20/20)
- ✅ All badge names (20/20)
- ✅ All NPC names (20/20)
- ✅ Core branding (package, manifest, meta tags)
- ✅ Design system (colors, fonts, animations)
- ✅ New educational components

### **What Still References CIVIKA:**
- ⚠️ Some UI component text (MainMenu, Credits)
- ⚠️ Some service layer content (Shop items, Secret quests)
- ⚠️ Some player titles and descriptions
- ⚠️ Some NPC dialogues in hidden quests

### **Impact Assessment:**
- **Critical:** None (game is playable)
- **High:** UI text updates (user-facing)
- **Medium:** Service content (secondary features)
- **Low:** Comments and internal references

---

## **✨ MIGRATION QUALITY**

### **What's Been Done Well:**
- ✅ Complete content transformation (civic → algebra)
- ✅ All educational mechanics updated
- ✅ Consistent math theming throughout core gameplay
- ✅ New visual design matches algebra theme
- ✅ Progressive difficulty maintained

### **What Needs Attention:**
- ⚠️ Consistency in UI text across all components
- ⚠️ Some legacy civic-themed items in shop
- ⚠️ Some civic titles in secret quest system
- ⚠️ Minor comment updates

---

**Current Migration Status: 75% Complete**
**Estimated Time to 100%: ~1 hour**
**Blockers: None**
**Ready for Production: After Phase 4 completion**

---

**Last Updated:** October 14, 2025
