# 🚀 Quick Integration Guide

## **3-Step Integration Process**

---

## **STEP 1: Install Dependencies**

```powershell
npm install
```

This will install all required packages including Next.js, React, and Tailwind CSS.

---

## **STEP 2: Update App.tsx**

Add these lines to `src/App.tsx`:

### **A. Add Imports (top of file)**
```tsx
import { AchievementCelebration } from "./components/AchievementCelebration";
import { EnhancedQuizSystem } from "./components/EnhancedQuizSystem";
```

### **B. Add State Variables (in App function)**
```tsx
const [showCelebration, setShowCelebration] = useState(false);
const [celebrationData, setCelebrationData] = useState({
    badge: "",
    coins: 0,
    points: 0,
    timeBonus: 0
});
```

### **C. Replace Quiz Component (in return/render)**
```tsx
// Find this:
{showQuiz && currentQuiz && (
    <QuizSystem
        question={currentQuiz}
        onAnswer={handleQuizAnswer}
        onClose={() => setShowQuiz(false)}
        missionId={currentMission?.id}
    />
)}

// Replace with:
{showQuiz && currentQuiz && (
    <EnhancedQuizSystem
        question={currentQuiz}
        onAnswer={handleQuizAnswer}
        onClose={() => setShowQuiz(false)}
        missionId={currentMission?.id}
        level={gameInfo.level}
    />
)}
```

### **D. Add Celebration Component (before closing div)**
```tsx
{/* Add this near the end of return(), before closing div */}
{showCelebration && (
    <AchievementCelebration
        badge={celebrationData.badge}
        coins={celebrationData.coins}
        points={celebrationData.points}
        timeBonus={celebrationData.timeBonus}
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
    />
)}
```

### **E. Trigger Celebration (in handleQuizAnswer)**
```tsx
// Inside handleQuizAnswer function, after mission completion:
if (isCorrect && result.updated) {
    const mission = gameStateManager.current.getProgress();
    const latestBadge = mission?.badges[mission.badges.length - 1];
    
    setCelebrationData({
        badge: latestBadge || "Achievement Unlocked",
        coins: rewardCoins,
        points: result.points + 100,
        timeBonus: result.timeBonus || 0
    });
    
    // Small delay so mission complete notification shows first
    setTimeout(() => {
        setShowCelebration(true);
    }, 2500);
}
```

---

## **STEP 3: Test**

```powershell
npm run dev
```

Visit http://localhost:8080 and:
1. Create a character
2. Start a mission
3. Answer the quiz
4. Watch the celebration! 🎉

---

## **Using New Colors in Your Components**

```tsx
// Level 1 (Barangay) theme
<div className="bg-level1-primary">Orange theme</div>

// Level 2 (City) theme
<div className="bg-level2-primary">Blue theme</div>

// Math colors
<button className="bg-math-blue">Blue Button</button>
<button className="bg-math-purple">Purple Button</button>

// Semantic colors
<div className="text-success">Correct!</div>
<div className="text-error">Wrong!</div>
```

---

## **Using New Fonts**

```tsx
// Math equations and numbers
<code className="font-math">x² + 5x = 12</code>

// Playful headings
<h1 className="font-playful">Achievement Unlocked!</h1>

// Body text (default)
<p className="font-body">Problem description...</p>
```

---

## **Using Animations**

```tsx
// Slide in from top
<div className="animate-slide-down">...</div>

// Celebrate effect
<div className="animate-celebrate">🏆</div>

// Confetti
<div className="animate-confetti">🎉</div>

// Soft pulse
<div className="animate-pulse-soft">Tap to continue...</div>
```

---

## **Adding Hints & Solutions to Quizzes**

Update your quiz questions in `App.tsx`:

```tsx
const quizzes = {
    "1": {
        question: "If 3 pens cost ₱45, how much for 7 pens?",
        options: ["₱95", "₱105", "₱100", "₱110"],
        correctAnswer: 1,
        explanation: "Unit pricing helps compare values",
        
        // NEW: Add these fields
        steps: [
            "Find price per pen: ₱45 ÷ 3 = ₱15",
            "Multiply by 7 pens: ₱15 × 7 = ₱105"
        ],
        formula: "Total Cost = Unit Price × Quantity",
        hints: [
            "First find the cost of one pen",
            "Divide ₱45 by 3 to get unit price",
            "Then multiply unit price by 7"
        ]
    },
    // ... rest of quizzes
};
```

---

## **Troubleshooting**

### **Issue: Colors not showing**
```powershell
# Clear cache and rebuild
rm -rf .next
npm run build
npm run dev
```

### **Issue: Fonts not loading**
Check `src/pages/_document.tsx` has the Google Fonts link.

### **Issue: TypeScript errors**
```powershell
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## **That's It! 🎉**

Your game now has:
- ✅ Beautiful color themes
- ✅ Modern typography
- ✅ Smooth animations
- ✅ Achievement celebrations
- ✅ Enhanced quiz with hints
- ✅ Step-by-step solutions

**Enjoy your enhanced Algebra Adventure!** 🚀📐
