# 🎯 NPC Filename Reference Guide

## **Complete list of filenames for all 20 chibi NPCs**

---

## **📁 File Structure:**

```
FIONA/
└── public/
    └── assets/
        ├── LEVEL1/          ← Barangay NPCs (Missions 1-10)
        │   ├── vendor-mang-pedro.png
        │   ├── store-owner-aling-maria.png
        │   └── ...
        └── LEVEL2/          ← City NPCs (Missions 11-20)
            ├── entrepreneur-carlos.png
            ├── accountant-lisa.png
            └── ...
```

---

## **🏘️ LEVEL 1: BARANGAY NPCs (Missions 1-10)**

| Mission | NPC Name in Code | Filename | Full Path |
|---------|------------------|----------|-----------|
| 1 | `Vendor Mang Pedro` | `vendor-mang-pedro.png` | `assets/LEVEL1/vendor-mang-pedro.png` |
| 2 | `Store Owner Aling Maria` | `store-owner-aling-maria.png` | `assets/LEVEL1/store-owner-aling-maria.png` |
| 3 | `Coach Miguel` | `coach-miguel.png` | `assets/LEVEL1/coach-miguel.png` |
| 4 | `Baker Tess` | `baker-tess.png` | `assets/LEVEL1/baker-tess.png` |
| 5 | `Student Leader Ana` | `student-leader-ana.png` | `assets/LEVEL1/student-leader-ana.png` |
| 6 | `Gardener Noel` | `gardener-noel.png` | `assets/LEVEL1/gardener-noel.png` |
| 7 | `Math Teacher Mrs. Cruz` | `math-teacher-mrs-cruz.png` | `assets/LEVEL1/math-teacher-mrs-cruz.png` |
| 8 | `Shop Owner Danny` | `shop-owner-danny.png` | `assets/LEVEL1/shop-owner-danny.png` |
| 9 | `Parent Rosa` | `parent-rosa.png` | `assets/LEVEL1/parent-rosa.png` |
| 10 | `Banker Mr. Santos` | `banker-mr-santos.png` | `assets/LEVEL1/banker-mr-santos.png` |

---

## **🏙️ LEVEL 2: CITY NPCs (Missions 11-20)**

| Mission | NPC Name in Code | Filename | Full Path |
|---------|------------------|----------|-----------|
| 11 | `Entrepreneur Carlos` | `entrepreneur-carlos.png` | `assets/LEVEL2/entrepreneur-carlos.png` |
| 12 | `Accountant Lisa` | `accountant-lisa.png` | `assets/LEVEL2/accountant-lisa.png` |
| 13 | `Logistics Manager Ben` | `logistics-manager-ben.png` | `assets/LEVEL2/logistics-manager-ben.png` |
| 14 | `Sales Director Kim` | `sales-director-kim.png` | `assets/LEVEL2/sales-director-kim.png` |
| 15 | `Urban Planner Gina` | `urban-planner-gina.png` | `assets/LEVEL2/urban-planner-gina.png` |
| 16 | `Transit Manager Roy` | `transit-manager-roy.png` | `assets/LEVEL2/transit-manager-roy.png` |
| 17 | `Architect Maya` | `architect-maya.png` | `assets/LEVEL2/architect-maya.png` |
| 18 | `City Planner Tom` | `city-planner-tom.png` | `assets/LEVEL2/city-planner-tom.png` |
| 19 | `Engineer Sarah` | `engineer-sarah.png` | `assets/LEVEL2/engineer-sarah.png` |
| 20 | `Transport Chief Mike` | `transport-chief-mike.png` | `assets/LEVEL2/transport-chief-mike.png` |

---

## **📝 Naming Convention:**

**Format:** `role-name.png`
- All lowercase
- Hyphens between words
- No special characters
- Keep descriptive (role + name)

**Examples:**
- `Vendor Mang Pedro` → `vendor-mang-pedro.png`
- `Math Teacher Mrs. Cruz` → `math-teacher-mrs-cruz.png`
- `Store Owner Aling Maria` → `store-owner-aling-maria.png`

---

## **🔧 CODE UPDATE REQUIRED:**

You need to update the `npcImageMap` in both game files to match the new NPCs.

### **1. Update BarangayMap.ts** (around line 1498)

Replace the old `npcImageMap` with:

```typescript
const npcImageMap = {
    "Vendor Mang Pedro": "vendor-mang-pedro",
    "Store Owner Aling Maria": "store-owner-aling-maria",
    "Coach Miguel": "coach-miguel",
    "Baker Tess": "baker-tess",
    "Student Leader Ana": "student-leader-ana",
    "Gardener Noel": "gardener-noel",
    "Math Teacher Mrs. Cruz": "math-teacher-mrs-cruz",
    "Shop Owner Danny": "shop-owner-danny",
    "Parent Rosa": "parent-rosa",
    "Banker Mr. Santos": "banker-mr-santos",
};
```

### **2. Update CityMap.ts** (around line 727)

Replace the old `cityNPCImageMap` with:

```typescript
const cityNPCImageMap = {
    "Entrepreneur Carlos": "entrepreneur-carlos",
    "Accountant Lisa": "accountant-lisa",
    "Logistics Manager Ben": "logistics-manager-ben",
    "Sales Director Kim": "sales-director-kim",
    "Urban Planner Gina": "urban-planner-gina",
    "Transit Manager Roy": "transit-manager-roy",
    "Architect Maya": "architect-maya",
    "City Planner Tom": "city-planner-tom",
    "Engineer Sarah": "engineer-sarah",
    "Transport Chief Mike": "transport-chief-mike",
};
```

---

## **✅ Checklist:**

### **After Generating Each NPC:**

1. **Save the sprite sheet** with the correct filename from the table above
2. **Check file format**: PNG with transparent background
3. **Check file size**: Should be 256x256px minimum (16 frames at 64x64px each)
4. **Place in correct folder**:
   - Barangay NPCs (1-10) → `public/assets/LEVEL1/`
   - City NPCs (11-20) → `public/assets/LEVEL2/`
5. **Verify filename**: All lowercase, hyphens, matches table exactly

### **After All NPCs Are Generated:**

1. **Update BarangayMap.ts** with new `npcImageMap` (see above)
2. **Update CityMap.ts** with new `cityNPCImageMap` (see above)
3. **Test in game** - Visit each mission location to verify NPCs appear
4. **Check console** for any "missing image" errors

---

## **🚀 Quick Copy-Paste:**

### **Barangay NPCs - Save As:**
```
vendor-mang-pedro.png
store-owner-aling-maria.png
coach-miguel.png
baker-tess.png
student-leader-ana.png
gardener-noel.png
math-teacher-mrs-cruz.png
shop-owner-danny.png
parent-rosa.png
banker-mr-santos.png
```

### **City NPCs - Save As:**
```
entrepreneur-carlos.png
accountant-lisa.png
logistics-manager-ben.png
sales-director-kim.png
urban-planner-gina.png
transit-manager-roy.png
architect-maya.png
city-planner-tom.png
engineer-sarah.png
transport-chief-mike.png
```

---

## **🎨 Generation Workflow:**

1. **Open** `COPY_PASTE_NPC_GUIDE.md`
2. **Copy** NPC 1 template from `VISUAL_ASSETS_PROMPTS.md`
3. **Replace** character details for the specific NPC
4. **Generate** in Google Gemini
5. **Save** with correct filename from this reference
6. **Move** to appropriate folder (LEVEL1 or LEVEL2)
7. **Repeat** for all 20 NPCs
8. **Update** both game files with new npcImageMap code
9. **Test** in game!

---

## **⚠️ Common Issues:**

**Issue:** NPC doesn't appear in game
- **Check:** Filename matches exactly (case-sensitive on some systems)
- **Check:** File is in correct folder (LEVEL1 vs LEVEL2)
- **Check:** npcImageMap is updated in game file
- **Check:** No typos in NPC name

**Issue:** Console error "texture not found"
- **Check:** Filename in npcImageMap matches actual file (without .png)
- **Check:** Path in game code matches folder structure
- **Check:** File actually exists in public/assets/LEVELx/

**Issue:** NPC appears but is wrong sprite
- **Check:** NPC name in missionLocations matches key in npcImageMap
- **Check:** Generated correct character (double-check prompt)

---

## **📊 Progress Tracking:**

Use this to track your NPC generation:

### **Barangay NPCs:**
- [ ] Vendor Mang Pedro (Mission 1)
- [ ] Store Owner Aling Maria (Mission 2)
- [ ] Coach Miguel (Mission 3)
- [ ] Baker Tess (Mission 4)
- [ ] Student Leader Ana (Mission 5)
- [ ] Gardener Noel (Mission 6)
- [ ] Math Teacher Mrs. Cruz (Mission 7)
- [ ] Shop Owner Danny (Mission 8)
- [ ] Parent Rosa (Mission 9)
- [ ] Banker Mr. Santos (Mission 10)

### **City NPCs:**
- [ ] Entrepreneur Carlos (Mission 11)
- [ ] Accountant Lisa (Mission 12)
- [ ] Logistics Manager Ben (Mission 13)
- [ ] Sales Director Kim (Mission 14)
- [ ] Urban Planner Gina (Mission 15)
- [ ] Transit Manager Roy (Mission 16)
- [ ] Architect Maya (Mission 17)
- [ ] City Planner Tom (Mission 18)
- [ ] Engineer Sarah (Mission 19)
- [ ] Transport Chief Mike (Mission 20)

### **Code Updates:**
- [ ] Updated npcImageMap in BarangayMap.ts
- [ ] Updated cityNPCImageMap in CityMap.ts
- [ ] Tested all Barangay NPCs in game
- [ ] Tested all City NPCs in game

---

**All NPCs ready for chibi generation! 🎨✨**
