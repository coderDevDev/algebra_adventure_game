# 🎨 Visual Assets Status & Generation Guide

## **🌟 ART STYLE: CUTE CHIBI / KAWAII**

**All characters use adorable chibi proportions!**
- Large heads, tiny bodies (head:body = 1:1 to 1:1.5)
- Big expressive anime-style eyes
- Round, soft, friendly features
- Makes math learning less intimidating and more fun!

## **📊 Current Status Overview**

All visual asset prompts are **COMPLETE** in `VISUAL_ASSETS_PROMPTS.md` with **CHIBI STYLE** specifications!

---

## **✅ NPCs with Complete Visual Prompts**

### **LEVEL 1: Barangay NPCs (10 Characters)**

| Mission | NPC Name | Role | Prompt Status | Priority |
|---------|----------|------|---------------|----------|
| 1 | Vendor Mang Pedro | Market vendor teaching pricing | ✅ Complete | HIGH |
| 2 | Store Owner Aling Maria | Sari-sari store owner (discounts) | ✅ Complete | HIGH |
| 3 | Coach Miguel | Basketball coach (perimeter) | ✅ Complete | MEDIUM |
| 4 | Baker Tess | Baker (unit conversion) | ✅ Complete | MEDIUM |
| 5 | Student Leader Ana | Student leader (budgeting) | ✅ Complete | HIGH |
| 6 | Gardener Noel | Gardener (geometry) | ✅ Complete | MEDIUM |
| 7 | Math Teacher Mrs. Cruz | Math teacher (patterns) | ✅ Complete | HIGH |
| 8 | Shop Owner Danny | Shop owner (unit pricing) | ✅ Complete | MEDIUM |
| 9 | Parent Rosa | Family parent (budgeting) | ✅ Complete | HIGH |
| 10 | Banker Mr. Santos | Banker (savings) | ✅ Complete | HIGH |

### **LEVEL 2: City NPCs (10 Characters)**

| Mission | NPC Name | Role | Prompt Status | Priority |
|---------|----------|------|---------------|----------|
| 11 | Entrepreneur Carlos | Business entrepreneur | ✅ Complete | HIGH |
| 12 | Accountant Lisa | Professional accountant | ✅ Complete | HIGH |
| 13 | Logistics Manager Ben | Delivery/logistics manager | ✅ Complete | MEDIUM |
| 14 | Sales Director Kim | Corporate sales director | ✅ Complete | MEDIUM |
| 15 | Urban Planner Gina | City urban planner | ✅ Complete | HIGH |
| 16 | Transit Manager Roy | Public transit manager | ✅ Complete | MEDIUM |
| 17 | Architect Maya | Professional architect | ✅ Complete | HIGH |
| 18 | City Planner Tom | Senior city planner | ✅ Complete | HIGH |
| 19 | Engineer Sarah | Civil engineer | ✅ Complete | MEDIUM |
| 20 | Transport Chief Mike | Transport authority chief | ✅ Complete | MEDIUM |

---

## **🎯 Asset Generation Priority Guide**

### **PHASE 1: Critical Foundations** (Start Here!)
1. ✅ **Player Character** - Main sprite with 4 directions
2. ✅ **Barangay Background** - Level 1 map (top-down view)
3. ✅ **City Background** - Level 2 map (top-down view)

**Why first?** These are needed for basic gameplay and testing.

---

### **PHASE 2: High-Priority NPCs** (Core Educational Experience)
Generate these NPCs first as they represent the most common/important educational interactions:

#### **Barangay (Level 1):**
1. **Vendor Mang Pedro** (#1) - First mission, market math
2. **Store Owner Aling Maria** (#2) - Essential shopping/discount lessons
3. **Math Teacher Mrs. Cruz** (#7) - Central authority figure for algebra
4. **Student Leader Ana** (#5) - Relatable peer character
5. **Parent Rosa** (#9) - Family budgeting scenarios
6. **Banker Mr. Santos** (#10) - Financial literacy conclusion

#### **City (Level 2):**
1. **Entrepreneur Carlos** (#11) - Business/profit introduction
2. **Accountant Lisa** (#12) - Professional finance representative
3. **Urban Planner Gina** (#15) - City planning & optimization
4. **Architect Maya** (#17) - Design & construction math
5. **City Planner Tom** (#18) - Statistics & demographics
6. **Engineer Sarah** (#19) - Technical calculations

---

### **PHASE 3: Medium-Priority NPCs** (Supporting Cast)

#### **Barangay (Level 1):**
- **Coach Miguel** (#3) - Sports/geometry connection
- **Baker Tess** (#4) - Recipe/measurement conversions
- **Gardener Noel** (#6) - Nature-based math applications
- **Shop Owner Danny** (#8) - Additional business scenarios

#### **City (Level 2):**
- **Logistics Manager Ben** (#13) - Route optimization
- **Sales Director Kim** (#14) - Business growth modeling
- **Transit Manager Roy** (#16) - Transportation systems
- **Transport Chief Mike** (#20) - Public service management

---

## **📋 How to Use the Visual Asset Prompts**

### **Step-by-Step Process:**

1. **Open** `VISUAL_ASSETS_PROMPTS.md`
2. **Find** the NPC you want to generate (Section 4 for Barangay, Section 5 for City)
3. **Copy** the entire prompt for that NPC
4. **Paste** into Google Gemini or your AI image generator
5. **Generate** and iterate if needed
6. **Save** as PNG with transparent background
7. **Name** the file according to game code (see naming convention below)

### **File Naming Convention:**

```
Format: [role]-[name].png (all lowercase, hyphens between words)

Barangay NPCs (save to: public/assets/LEVEL1/):
- vendor-mang-pedro.png
- store-owner-aling-maria.png
- coach-miguel.png
- baker-tess.png
- student-leader-ana.png
- gardener-noel.png
- math-teacher-mrs-cruz.png
- shop-owner-danny.png
- parent-rosa.png
- banker-mr-santos.png

City NPCs (save to: public/assets/LEVEL2/):
- entrepreneur-carlos.png
- accountant-lisa.png
- logistics-manager-ben.png
- sales-director-kim.png
- urban-planner-gina.png
- transit-manager-roy.png
- architect-maya.png
- city-planner-tom.png
- engineer-sarah.png
- transport-chief-mike.png
```

**📋 See complete filename reference in: `NPC_FILENAME_REFERENCE.md`**

---

## **🎨 Technical Specifications (Quick Reference)**

### **🎬 Sprite Sheet Layout:**
```
Each character needs a 16-frame sprite sheet organized as:

┌─────────────────────────────────────────┐
│ [Front Idle] [Front W1] [Front W2] [Front W3] │  ← Row 1: Front facing
│ [Back Idle]  [Back W1]  [Back W2]  [Back W3]  │  ← Row 2: Back facing  
│ [Left Idle]  [Left W1]  [Left W2]  [Left W3]  │  ← Row 3: Left side
│ [Right Idle] [Right W1] [Right W2] [Right W3] │  ← Row 4: Right side
└─────────────────────────────────────────┘

W1, W2, W3 = Walking animation frames
Idle = Standing/neutral pose
```

### **Sprite Requirements:**
- **Format**: PNG with transparent background
- **Layout**: 16-frame sprite sheet (4x4 grid recommended)
- **Frame Size**: Each frame 64x64px minimum (full sheet: 256x256px+)
- **Style**: **CUTE CHIBI / KAWAII art style** (NOT pixel art!)
  - Large round head (50% of total height)
  - Small chibi body with stubby limbs
  - Big expressive anime-style eyes
  - Soft, rounded features
  - Bouncy, adorable movement
- **Animations**: 
  - 4 directions: Front, Back, Left, Right
  - 3 walking frames per direction (12 walking frames total) - bouncy chibi walk
  - 1 idle frame per direction (4 idle frames total)
- **Perspective**: Top-down view (bird's eye)
- **Details**: Clear silhouette, culturally authentic Filipino features (in chibi style)
- **Consistency**: All frames must match player character chibi proportions

### **Background Requirements:**
- **Format**: PNG or JPEG
- **Resolution**: 1920x1080 minimum (or higher)
- **Style**: Top-down/bird's eye view
- **Details**: Clear walkable paths, Filipino cultural elements

### **Color Schemes:**
**Barangay (Warm):**
- Primary: #F59E0B (Orange)
- Secondary: #FCD34D (Yellow)
- Mood: Community, warmth, friendly

**City (Cool):**
- Primary: #3B82F6 (Blue)
- Secondary: #60A5FA (Light Blue)  
- Mood: Professional, modern, ambitious

---

## **💡 Pro Tips for Asset Generation**

### **For Google Gemini:**

1. **Always Start with "CHIBI":**
   ```
   First: "Create a CUTE CHIBI Filipino market vendor, top-down view, large head, small body"
   Follow-up: "Make it more kawaii with bigger eyes and rounder features"
   ```

2. **Reference Chibi Examples:**
   ```
   "Like Pokémon characters - chibi proportions"
   "Similar to Animal Crossing character style"
   "Cute anime chibi with big head and tiny body"
   ```

3. **Request Variations:**
   ```
   "Generate 3 chibi variations of this character"
   "Try different clothing colors while keeping chibi proportions"
   ```

4. **Cultural Authenticity (Chibi Style):**
   ```
   "Add Filipino cultural details like barong tagalog in chibi style"
   "Reference Manila/Quezon City but make it super cute and chibi"
   ```

5. **Iterate for Kawaii Quality:**
   ```
   "Make it cuter with even bigger head and eyes"
   "Add more kawaii details - round everything"
   "Softer colors, more pastel, more adorable"
   ```

### **Quality Checklist:**

Before accepting a generated asset, verify:

**For Character Sprites (CHIBI STYLE):**
- [ ] **CHIBI PROPORTIONS**: Large head (50%+ of total height)
- [ ] **BIG EYES**: Anime-style expressive eyes (30-40% of face)
- [ ] **SMALL BODY**: Tiny chibi body with stubby limbs
- [ ] **ROUND FEATURES**: Soft, rounded, no sharp angles
- [ ] **16-frame sprite sheet** (not a single image!)
- [ ] All 4 directions included (front, back, left, right)
- [ ] 3 bouncy walking frames per direction showing chibi movement
- [ ] 1 idle frame per direction
- [ ] Frames are consistent in size and chibi style
- [ ] Animation looks smooth and bouncy when frames cycle
- [ ] Matches the prompt description
- [ ] Clear and visible at 64x64 pixel scale
- [ ] Culturally appropriate Filipino features (in chibi style)
- [ ] Consistent with player character chibi proportions
- [ ] Super cute and appealing to 10-16 year old audience
- [ ] Friendly/educational appearance (kawaii reduces math anxiety!)
- [ ] Transparent background

**For Backgrounds:**
- [ ] High resolution (1920x1080+)
- [ ] Clear walkable areas
- [ ] Culturally authentic Filipino elements
- [ ] Matches level theme (warm/cool colors)

---

## **🚀 Quick Start Recommendation**

### **If you're generating CHIBI assets NOW:**

**Start with these 8 ADORABLE essentials:**

1. **Chibi Player Character** (16-frame sprite sheet, 4 directions) - SUPER CUTE STUDENT!
2. **Barangay Background** (1 image - warm, friendly)
3. **Chibi Vendor Mang Pedro** - First adorable NPC students meet
4. **Chibi Math Teacher Mrs. Cruz** - Cute mentor figure
5. **City Background** (1 image - modern but still friendly)
6. **Chibi Entrepreneur Carlos** - Cute professional businessman
7. **Chibi Accountant Lisa** - Adorable professional role model
8. **Chibi Urban Planner Gina** - Kawaii city planner

**These 8 CHIBI assets** will give you a playable demo covering:
- Both levels (Barangay & City) in cute style
- Diverse chibi characters (all ages look equally adorable!)
- Educational variety (market, teaching, business, planning)
- Consistent kawaii aesthetic throughout

**🎨 Remember**: Every character must have:
- Large head (50% of height)
- Big sparkling eyes
- Tiny body with stubby limbs
- Bouncy cute movement
- 16 frames total (4 directions × 4 frames)

---

## **📊 Asset Generation Tracking**

Use this checklist to track your progress:

### **Backgrounds:**
- [ ] Barangay Background (Level 1)
- [ ] City Background (Level 2)
- [ ] Optional: Night versions

### **Player:**
- [ ] Student Front
- [ ] Student Back
- [ ] Student Left
- [ ] Student Right

### **Barangay NPCs:**
- [ ] Vendor Mang Pedro
- [ ] Store Owner Aling Maria
- [ ] Coach Miguel
- [ ] Baker Tess
- [ ] Student Leader Ana
- [ ] Gardener Noel
- [ ] Math Teacher Mrs. Cruz
- [ ] Shop Owner Danny
- [ ] Parent Rosa
- [ ] Banker Mr. Santos

### **City NPCs:**
- [ ] Entrepreneur Carlos
- [ ] Accountant Lisa
- [ ] Logistics Manager Ben
- [ ] Sales Director Kim
- [ ] Urban Planner Gina
- [ ] Transit Manager Roy
- [ ] Architect Maya
- [ ] City Planner Tom
- [ ] Engineer Sarah
- [ ] Transport Chief Mike

---

## **🎯 Success Criteria**

Your CHIBI visual assets are ready when:
1. ✅ **CHIBI PROPORTIONS**: All characters have large heads (50%+ height)
2. ✅ **BIG EYES**: Every character has anime-style expressive eyes
3. ✅ **KAWAII STYLE**: Super cute, round, bouncy, adorable aesthetic
4. ✅ All sprites have transparent backgrounds
5. ✅ Characters are clearly visible and distinguishable (even in chibi form)
6. ✅ Consistent chibi style across ALL assets (player + all NPCs)
7. ✅ Cultural elements are authentic and respectful (Filipino features in chibi style)
8. ✅ Characters look friendly, trustworthy, and non-threatening
9. ✅ Colors are vibrant, soft, and match level themes (warm/cool with kawaii palette)
10. ✅ Assets work well together creating a cohesive cute game environment

---

## **🔗 Related Documents**

- **Detailed Prompts**: `VISUAL_ASSETS_PROMPTS.md` (complete prompt library with full chibi specs)
- **Copy-Paste Guide**: `COPY_PASTE_NPC_GUIDE.md` (quick character detail swaps)
- **Filename Reference**: `NPC_FILENAME_REFERENCE.md` (all 20 filenames + code updates needed)
- **Game Code**: Check `BarangayMap.ts` and `CityMap.ts` for NPC usage
- **Mission Data**: See `getMissionData()` functions for character contexts

---

## **📞 Next Steps**

1. Review this document to understand CHIBI style requirements
2. Open `VISUAL_ASSETS_PROMPTS.md` for detailed chibi prompts
3. **Start with Phase 1** (Chibi Player + Backgrounds)
4. **Move to Phase 2** (High-priority chibi NPCs)
5. Track progress using the checklist above
6. Test assets in-game and iterate for maximum cuteness!

---

## **🎨 Why Chibi Style?**

**Educational Benefits:**
- ✅ **Less Intimidating**: Cute characters reduce math anxiety
- ✅ **More Engaging**: Students love kawaii aesthetics
- ✅ **Universal Appeal**: Works for all ages and genders
- ✅ **Clear Emotions**: Big eyes show feelings easily
- ✅ **Memorable**: Adorable characters stick in memory
- ✅ **Cultural Bridge**: Anime/chibi style is popular in Philippines

**Technical Benefits:**
- ✅ **Simple shapes**: Easier to animate
- ✅ **Clear silhouettes**: Visible at small sizes
- ✅ **Consistent sizing**: Everyone same proportions
- ✅ **Faster iteration**: Simplified features speed up generation

**Good luck with your ADORABLE asset generation! Ang cute! 🇵🇭✨💕**
