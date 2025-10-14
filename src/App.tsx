import { useRef, useState, useEffect } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import { MainMenu } from "./components/MainMenu";
import { CharacterCreation } from "./components/CharacterCreation";
import { QuizSystem } from "./components/QuizSystem";
import { EnhancedQuizSystem } from "./components/EnhancedQuizSystem";
import { AchievementCelebration } from "./components/AchievementCelebration";
import { MissionSystem } from "./components/MissionSystem";
import { VirtualJoystick } from "./components/VirtualJoystick";
import { MobileInteractionButton } from "./components/MobileInteractionButton";
import { GameDebugPanel } from "./components/GameDebugPanel";
import { Settings } from "./components/Settings";
import { Extras } from "./components/Extras";
import { Credits } from "./components/Credits";
import { Leaderboard } from "./components/Leaderboard";
import { Shop } from "./components/Shop";
import { DailyChallenges } from "./components/DailyChallenges";
import { SecretQuests } from "./components/SecretQuests";
import { CollisionEditor } from "./components/CollisionEditor";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { LandscapePrompt } from "./components/LandscapePrompt";
import {
    GameNotification,
    NotificationData,
} from "./components/GameNotification";
import { EventBus } from "./game/EventBus";
import { GameStateManager } from "./utils/GameStateManager";
import { GameProgress } from "./utils/GameValidation";
import { audioManager } from "./utils/AudioManager";
import LeaderboardService from "./services/LeaderboardService";
import ShopService from "./services/ShopService";
import SecretQuestService from "./services/SecretQuestService";

function App() {
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const gameStateManager = useRef(GameStateManager.getInstance());
    const [gameInfo, setGameInfo] = useState({
        currentScene: "MainMenu",
        playerName: "",
        badges: 0,
        coins: 0,
        totalScore: 0,
        accuracy: "0%",
        level: 1,
    });
    const [showPauseMenu, setShowPauseMenu] = useState(false);
    const [showInventory, setShowInventory] = useState(false);
    const [showQuestLog, setShowQuestLog] = useState(false);
    const [showMainMenu, setShowMainMenu] = useState(true);
    const [showCharacterCreation, setShowCharacterCreation] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showMission, setShowMission] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState<any>(null);
    const [currentMission, setCurrentMission] = useState<any>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [joystickDirection, setJoystickDirection] = useState({ x: 0, y: 0 });
    const [notification, setNotification] = useState<NotificationData | null>(
        null
    );
    const [showNotification, setShowNotification] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showExtras, setShowExtras] = useState(false);
    const [showCredits, setShowCredits] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showShop, setShowShop] = useState(false);
    const [showDailyChallenges, setShowDailyChallenges] = useState(false);
    const [showSecretQuests, setShowSecretQuests] = useState(false);
    const [showCollisionEditor, setShowCollisionEditor] = useState(false);
    const [currentMapForEditor, setCurrentMapForEditor] = useState<
        "BarangayMap" | "CityMap"
    >("BarangayMap");
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationData, setCelebrationData] = useState({
        badge: "",
        coins: 0,
        points: 0,
        timeBonus: 0,
    });
    const leaderboardService = useRef(LeaderboardService.getInstance());
    const shopService = useRef(ShopService.getInstance());
    const secretQuestService = useRef(SecretQuestService.getInstance());

    const currentScene = (scene: Phaser.Scene) => {
        console.log("Current scene:", scene.scene.key);
        setGameInfo((prev) => ({
            ...prev,
            currentScene: scene.scene.key,
        }));

        // Track current map for collision editor
        if (
            scene.scene.key === "BarangayMap" ||
            scene.scene.key === "CityMap"
        ) {
            setCurrentMapForEditor(
                scene.scene.key as "BarangayMap" | "CityMap"
            );
        }

        // Update game data from Phaser registry
        if (scene.game && scene.game.registry) {
            const playerName = scene.game.registry.get("playerName") || "";
            const badges = scene.game.registry.get("badges") || [];
            const coins = scene.game.registry.get("coins") || 0;

            setGameInfo((prev) => ({
                ...prev,
                playerName,
                badges: badges.length,
                coins,
            }));
        }

        // Listen for preloader complete event
        if (scene.scene.key === "Preloader") {
            scene.events.on("preloader-complete", () => {
                // Ensure MainMenu is shown when preloader completes
                setShowMainMenu(true);
            });
        }
    };

    // Handle keyboard events for UI
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowPauseMenu(!showPauseMenu);
            } else if (event.key === "i" || event.key === "I") {
                setShowInventory(!showInventory);
            } else if (event.key === "q" || event.key === "Q") {
                setShowQuestLog(!showQuestLog);
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [showPauseMenu, showInventory, showQuestLog]);

    // Initialize audio manager
    useEffect(() => {
        const initAudio = async () => {
            try {
                await audioManager.initialize();
                audioManager.playLevelMusic("MainMenu");
            } catch (error) {
                console.warn("Audio initialization failed:", error);
            }
        };

        // Initialize audio on first user interaction
        const handleFirstInteraction = () => {
            initAudio();
            document.removeEventListener("click", handleFirstInteraction);
            document.removeEventListener("keydown", handleFirstInteraction);
        };

        document.addEventListener("click", handleFirstInteraction);
        document.addEventListener("keydown", handleFirstInteraction);

        return () => {
            document.removeEventListener("click", handleFirstInteraction);
            document.removeEventListener("keydown", handleFirstInteraction);
        };
    }, []);

    // Game flow handlers
    const handleStartGame = () => {
        audioManager.playEffect("button-click");
        // Don't start level music here - wait until character is created and scene starts
        setShowMainMenu(false);
        setShowCharacterCreation(true);
    };

    const handleLoadGame = () => {
        audioManager.playEffect("button-click");
        const savedProgress = localStorage.getItem("civika-game-progress");
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                const playerName = progress.playerName || "Citizen";
                handleCharacterCreated(playerName, "default");
            } catch (error) {
                console.error("Failed to load game:", error);
                alert("Failed to load saved game. Please start a new game.");
            }
        } else {
            alert("No saved game found! Start a new game first.");
        }
    };

    const handleShowSettings = () => {
        audioManager.playEffect("menu-open");
        setShowSettings(true);
    };

    const handleShowExtras = () => {
        audioManager.playEffect("menu-open");
        setShowExtras(true);
    };

    const handleShowCredits = () => {
        audioManager.playEffect("menu-open");
        setShowCredits(true);
    };

    const handleShowLeaderboard = () => {
        audioManager.playEffect("menu-open");
        setShowLeaderboard(true);
    };

    const handleExit = () => {
        audioManager.playEffect("button-click");
        // Exit functionality is handled in MainMenu component
    };

    const handleCharacterCreated = (name: string, color: string) => {
        console.log("Character created:", name, color);
        setShowCharacterCreation(false);

        // Stop any current music to ensure clean transition
        audioManager.stopMusic();

        // Initialize game state with validation
        const progress = gameStateManager.current.initializeGame(name);
        updateGameInfoFromProgress(progress);

        // Show welcome notification for new players
        if (progress.completedMissions.length === 0) {
            setTimeout(() => {
                showGameNotification({
                    type: "info",
                    title: `Welcome to Algebra Adventure, ${name}! 👋`,
                    message: `Welcome to the barangay! You're about to embark on an exciting math journey to become a problem-solving expert. Look for NPCs with "!" symbols to start math challenges and learn real-world algebra. Good luck!`,
                    icon: "🎓",
                    actions: [
                        {
                            label: "Start My Math Journey!",
                            action: closeNotification,
                            style: "primary",
                        },
                    ],
                });
            }, 2000); // Show after game world loads
        }

        // Wait for Phaser game to be ready, then start the appropriate scene based on level
        let retryCount = 0;
        const maxRetries = 50; // 5 seconds max

        const startGameWorld = () => {
            if (phaserRef.current?.game) {
                console.log("Phaser game found, setting registry...");
                phaserRef.current.game.registry.set("playerName", name);
                phaserRef.current.game.registry.set("playerColor", color);

                // Sync game state with Phaser registry
                syncGameStateWithPhaser(progress);

                // Check available scenes
                const availableScenes =
                    phaserRef.current.game.scene.getScenes();
                console.log(
                    "Available scenes:",
                    availableScenes.map((s) => s.scene.key)
                );

                // Determine which scene to start based on player level
                const startScene =
                    progress.level >= 2 ? "CityMap" : "BarangayMap";
                console.log(
                    `Starting ${startScene} scene for Level ${progress.level}...`
                );

                // Play level-specific music
                audioManager.crossfadeToLevel(
                    startScene as "BarangayMap" | "CityMap"
                );

                phaserRef.current.game.scene.start(startScene);
                console.log(`${startScene} scene started successfully`);

                // Show Level 2 welcome message if player is returning to city
                if (
                    progress.level >= 2 &&
                    progress.completedMissions.length >= 10
                ) {
                    setTimeout(() => {
                        showGameNotification({
                            type: "info",
                            title: `Welcome to the City, ${name}! 🏙️`,
                            message: `Congratulations! You've mastered basic math and are now ready for advanced challenges! The city awaits with complex business, urban planning, and financial math problems. Show your intermediate algebra skills!`,
                            icon: "🏢",
                            actions: [
                                {
                                    label: "Start City Challenges!",
                                    action: closeNotification,
                                    style: "primary",
                                },
                            ],
                        });
                    }, 3000); // Show after scene loads
                }
            } else if (retryCount < maxRetries) {
                retryCount++;
                console.log(
                    `Phaser game still not ready, retrying in 100ms... (${retryCount}/${maxRetries})`
                );
                setTimeout(startGameWorld, 100);
            } else {
                console.log("Failed to start game scene after maximum retries");
            }
        };

        // Start the game world with retry logic
        startGameWorld();
    };

    const handleQuizAnswer = (isCorrect: boolean) => {
        if (currentMission && currentQuiz) {
            try {
                const missionId = parseInt(currentMission.id);
                const selectedAnswer = isCorrect
                    ? currentQuiz.correctAnswer
                    : (currentQuiz.correctAnswer + 1) %
                      currentQuiz.options.length;

                // Submit answer through game state manager
                const { result, updated } =
                    gameStateManager.current.submitQuizAnswer(
                        missionId,
                        selectedAnswer,
                        currentQuiz.correctAnswer
                    );

                console.log("Quiz submission result:", { result, updated });

                // Update UI with new progress
                const progress = gameStateManager.current.getProgress();
                if (progress) {
                    updateGameInfoFromProgress(progress);
                    syncGameStateWithPhaser(progress);

                    // Update NPC indicators in real-time for active scene
                    if (phaserRef.current?.game) {
                        const activeScenes =
                            phaserRef.current.game.scene.getScenes(true);
                        activeScenes.forEach((scene: any) => {
                            if (
                                scene.updateNPCIndicators &&
                                (scene.scene.key === "BarangayMap" ||
                                    scene.scene.key === "CityMap")
                            ) {
                                scene.updateNPCIndicators();
                            }
                        });
                    }
                }

                // Record speed challenge if answer is correct
                if (isCorrect && result.timeSpent) {
                    gameStateManager.current.recordSpeedChallenge(
                        result.timeSpent
                    );

                    // Check for speed achievements
                    const speedAchievements =
                        gameStateManager.current.checkSpeedAchievements();
                    if (speedAchievements.length > 0) {
                        console.log(
                            "Speed achievements earned:",
                            speedAchievements
                        );
                    }

                    // Update daily challenge progress for speed
                    if (result.timeSpent <= 10) {
                        shopService.current.updateChallengeProgress(
                            "excellent quiz",
                            1
                        );
                    }
                }

                // Show result feedback with notifications
                if (updated) {
                    console.log(`Mission ${missionId} completed successfully!`);
                    const progress = gameStateManager.current.getProgress();
                    if (progress) {
                        const mission = currentMission;
                        // Define reward coins for both Level 1 and Level 2 missions
                        const allRewardCoins = [
                            // Level 1 (missions 1-10)
                            20, 15, 25, 30, 35, 25, 40, 45, 35, 50,
                            // Level 2 (missions 11-20)
                            40, 45, 50, 55, 60, 50, 65, 70, 60, 80,
                        ];
                        const rewardCoins = allRewardCoins[missionId - 1] || 0;
                        const leveledUp = progress.level > gameInfo.level;

                        if (leveledUp) {
                            // Play level up sound effect
                            audioManager.playEffect("level-up");

                            // Show level up notification and transition to new scene
                            setTimeout(() => {
                                showGameNotification({
                                    type: "success",
                                    title: "LEVEL UP! 🌟",
                                    message: `Amazing! You've reached Level ${
                                        progress.level
                                    }! ${
                                        progress.level === 2
                                            ? "You've mastered basic algebra and are now ready for intermediate challenges! Welcome to the city with advanced math problems!"
                                            : "You've completed all math challenges with excellent accuracy and are ready for the next level. Great job, math champion!"
                                    }`,
                                    icon: "🎓",
                                    actions: [
                                        {
                                            label:
                                                progress.level === 2
                                                    ? "Enter City Math Zone!"
                                                    : "Continue!",
                                            action: () => {
                                                closeNotification();
                                                // Transition to appropriate scene based on new level
                                                if (
                                                    phaserRef.current?.game &&
                                                    progress.level === 2
                                                ) {
                                                    console.log(
                                                        "Transitioning to CityMap for Level 2..."
                                                    );
                                                    audioManager.crossfadeToLevel(
                                                        "CityMap"
                                                    );
                                                    phaserRef.current.game.scene.start(
                                                        "CityMap"
                                                    );
                                                }
                                            },
                                            style: "primary",
                                        },
                                    ],
                                });
                            }, 2000); // Show after mission completion notification
                        }

                        // Play mission completion sounds
                        audioManager.playEffect("mission-complete");
                        audioManager.playEffect("badge-earned");
                        audioManager.playEffect("coin-collect");

                        // Submit score to leaderboard
                        leaderboardService.current.submitScore(progress);

                        // Update daily challenge progress for missions
                        shopService.current.updateChallengeProgress(
                            "missions",
                            1
                        );

                        showGameNotification({
                            type: "success",
                            title: "Math Challenge Completed! 🎉",
                            message: `Excellent work! You've solved "${
                                mission?.title
                            }" and earned the "${
                                progress.badges[progress.badges.length - 1]
                            }" achievement! You received ${rewardCoins} coins and ${
                                result.points + 100
                            } points!`,
                            icon: "🏆",
                            actions: [
                                {
                                    label: "Continue Learning",
                                    action: closeNotification,
                                    style: "primary",
                                },
                            ],
                        });

                        // Show achievement celebration with confetti
                        setTimeout(() => {
                            setCelebrationData({
                                badge:
                                    progress.badges[
                                        progress.badges.length - 1
                                    ] || "Achievement Unlocked",
                                coins: rewardCoins,
                                points: result.points + 100,
                                timeBonus: result.timeBonus || 0,
                            });
                            setShowCelebration(true);
                        }, 1500);
                    }
                } else if (!result.isCorrect) {
                    console.log(
                        `Quiz failed for mission ${missionId}. Try again!`
                    );

                    // Play quiz wrong sound effect
                    audioManager.playEffect("quiz-wrong");

                    showGameNotification({
                        type: "warning",
                        title: "Incorrect Answer",
                        message: `Oops! That wasn't the correct answer. Don't worry, you can try again! Review the problem and apply the right math concepts. Keep practicing!`,
                        icon: "📚",
                        actions: [
                            {
                                label: "Try Again",
                                action: closeNotification,
                                style: "secondary",
                            },
                        ],
                    });
                } else {
                    // Correct answer but mission not completed (shouldn't happen in current logic)
                    audioManager.playEffect("quiz-correct");
                }
            } catch (error) {
                console.error("Error handling quiz answer:", error);
            }
        }

        setShowQuiz(false);
        setCurrentQuiz(null);
    };

    const handleMissionStart = () => {
        if (currentMission) {
            const missionId = parseInt(currentMission.id);

            // Check if mission is accessible
            if (!gameStateManager.current.canAccessMission(missionId)) {
                console.warn(`Mission ${missionId} is not accessible yet`);
                return;
            }

            // Check if mission is already completed
            if (gameStateManager.current.isMissionCompleted(missionId)) {
                console.log(`Mission ${missionId} is already completed`);
                setShowMission(false);
                return;
            }

            // Start quiz tracking
            gameStateManager.current.startQuiz(missionId);

            setShowMission(false);
            setShowQuiz(true);
            setCurrentQuiz(getQuizForMission(currentMission.id));

            // Play quiz start music
            audioManager.crossfadeToLevel("Quiz");
        }
    };

    const getQuizForMission = (missionId: string) => {
        const quizzes = {
            // Level 1: Barangay Math Challenges (1-10)
            "1": {
                question:
                    "Mang Pedro sells 1kg of rice for ₱45. If Aling Maria buys 3.5kg, how much should she pay?",
                options: ["₱140.50", "₱157.50", "₱150.00", "₱135.00"],
                correctAnswer: 1,
                explanation:
                    "Multiply the price per kg by the amount: ₱45 × 3.5 = ₱157.50. This is a basic arithmetic operation used in everyday market transactions.",
                steps: [
                    "Identify the unit price: ₱45 per kg",
                    "Identify the quantity: 3.5 kg",
                    "Multiply: ₱45 × 3.5 = ₱157.50",
                ],
                formula: "Total Cost = Unit Price × Quantity",
                hints: [
                    "Think about multiplication",
                    "Remember: Price per kg × Number of kg",
                    "₱45 × 3.5 = ?",
                ],
            },
            "2": {
                question:
                    "During a 20% off sale, a shirt costs ₱240. What was its original price?",
                options: ["₱288", "₱300", "₱260", "₱320"],
                correctAnswer: 1,
                explanation:
                    "If the shirt is 20% off, then ₱240 represents 80% of the original price. Original price = ₱240 ÷ 0.80 = ₱300. Understanding percentages helps with sales and discounts.",
                steps: [
                    "20% off means you pay 80% (100% - 20%)",
                    "₱240 = 80% of original price",
                    "Original price = ₱240 ÷ 0.80 = ₱300",
                ],
                formula: "Original Price = Sale Price ÷ (1 - Discount%)",
                hints: [
                    "Work backwards from the sale price",
                    "If 80% = ₱240, what is 100%?",
                    "Divide ₱240 by 0.80",
                ],
            },
            "3": {
                question:
                    "The basketball court is 28m × 15m. Calculate the perimeter for the fence needed.",
                options: ["86 meters", "43 meters", "420 meters", "72 meters"],
                correctAnswer: 0,
                explanation:
                    "Perimeter = 2(length + width) = 2(28 + 15) = 2(43) = 86 meters. This formula is essential for community planning and construction projects.",
                steps: [
                    "Write the formula: P = 2(l + w)",
                    "Add length and width: 28 + 15 = 43",
                    "Multiply by 2: 2 × 43 = 86 meters",
                ],
                formula: "Perimeter = 2(Length + Width)",
                hints: [
                    "Remember the perimeter formula for rectangles",
                    "Add the length and width first",
                    "Then multiply by 2",
                ],
            },
            "4": {
                question: "If 1kg = 2.2lbs, convert 5kg of sugar to pounds.",
                options: ["7.2 lbs", "11 lbs", "10 lbs", "2.27 lbs"],
                correctAnswer: 1,
                explanation:
                    "To convert kg to lbs, multiply by 2.2: 5 × 2.2 = 11 lbs. Unit conversion is important for international trade and cooking recipes.",
            },
            "5": {
                question:
                    "Your weekly allowance is ₱500. You spent ₱150 on food, ₱75 on transport. How much did you save?",
                options: ["₱225", "₱275", "₱325", "₱350"],
                correctAnswer: 1,
                explanation:
                    "Savings = Total - Food - Transport = ₱500 - ₱150 - ₱75 = ₱275. Budgeting skills help manage personal finances effectively.",
            },
            "6": {
                question:
                    "A circular garden has a radius of 7m. Calculate the area for planting (use π ≈ 22/7).",
                options: ["154 m²", "44 m²", "22 m²", "308 m²"],
                correctAnswer: 0,
                explanation:
                    "Area = πr² = (22/7) × 7² = (22/7) × 49 = 154 m². Understanding circular area helps with garden planning and landscaping.",
            },
            "7": {
                question:
                    "Find the next number in the pattern: 2, 5, 10, 17, __",
                options: ["24", "26", "28", "30"],
                correctAnswer: 1,
                explanation:
                    "The differences between consecutive numbers are 3, 5, 7, 9. The next difference is 9, so 17 + 9 = 26. Pattern recognition develops logical thinking.",
            },
            "8": {
                question: "If 3 pens cost ₱45, how much would 7 pens cost?",
                options: ["₱95", "₱105", "₱100", "₱110"],
                correctAnswer: 1,
                explanation:
                    "Price per pen = ₱45 ÷ 3 = ₱15. For 7 pens: ₱15 × 7 = ₱105. Unit pricing helps compare product values and make smart purchases.",
            },
            "9": {
                question:
                    "A family's monthly income is ₱25,000. They spend 30% on food, 20% on bills. How much do they save?",
                options: ["₱10,000", "₱12,500", "₱15,000", "₱7,500"],
                correctAnswer: 1,
                explanation:
                    "Food = 30% × ₱25,000 = ₱7,500. Bills = 20% × ₱25,000 = ₱5,000. Savings = ₱25,000 - ₱7,500 - ₱5,000 = ₱12,500. Understanding percentages helps with family budgeting.",
            },
            "10": {
                question:
                    "If you save ₱50 daily, how many weeks to save ₱3,500?",
                options: ["8 weeks", "10 weeks", "12 weeks", "7 weeks"],
                correctAnswer: 1,
                explanation:
                    "Days needed = ₱3,500 ÷ ₱50 = 70 days. Weeks = 70 ÷ 7 = 10 weeks. Planning savings goals helps achieve financial objectives.",
            },

            // Level 2: City Math Challenges (11-20) - Intermediate Algebra
            "11": {
                question:
                    "You buy items for ₱100 and sell them for 150% of cost. What's your profit per item?",
                options: ["₱40", "₱50", "₱60", "₱150"],
                correctAnswer: 1,
                explanation:
                    "Selling price = ₱100 × 1.5 = ₱150. Profit = ₱150 - ₱100 = ₱50. Understanding markup helps with business pricing strategies.",
            },
            "12": {
                question:
                    "With monthly expenses of ₱50,000, what revenue is needed for 20% profit?",
                options: ["₱55,000", "₱60,000", "₱62,500", "₱70,000"],
                correctAnswer: 2,
                explanation:
                    "If profit is 20% of revenue, then expenses are 80% of revenue. Revenue = ₱50,000 ÷ 0.80 = ₱62,500. Financial planning requires understanding profit margins.",
            },
            "13": {
                question:
                    "A delivery route covers 5 stops. If each segment is 3km, what's the total minimum distance?",
                options: ["12 km", "15 km", "18 km", "10 km"],
                correctAnswer: 0,
                explanation:
                    "For 5 stops, there are 4 segments between them. Total distance = 4 × 3km = 12km. Route optimization saves time and fuel costs.",
            },
            "14": {
                question:
                    "If sales increase 15% monthly and current sales are ₱100,000, what will they be in 2 months?",
                options: ["₱115,000", "₱130,000", "₱132,250", "₱150,000"],
                correctAnswer: 2,
                explanation:
                    "Month 1: ₱100,000 × 1.15 = ₱115,000. Month 2: ₱115,000 × 1.15 = ₱132,250. Compound growth is key to understanding business projections.",
            },
            "15": {
                question:
                    "A rectangular park is 80m × 50m. How many 10m × 10m garden plots can fit inside?",
                options: ["30 plots", "40 plots", "50 plots", "35 plots"],
                correctAnswer: 1,
                explanation:
                    "Park area = 80m × 50m = 4,000m². Plot area = 10m × 10m = 100m². Number of plots = 4,000 ÷ 100 = 40 plots. Area division is essential for urban planning.",
            },
            "16": {
                question:
                    "A bus travels 60km in 1.5 hours. What's its average speed?",
                options: ["30 km/h", "40 km/h", "45 km/h", "50 km/h"],
                correctAnswer: 1,
                explanation:
                    "Speed = Distance ÷ Time = 60km ÷ 1.5 hours = 40 km/h. Understanding speed calculations helps with transportation scheduling.",
            },
            "17": {
                question:
                    "A building height restriction is 15m. If each floor is 3m, what's the maximum number of floors?",
                options: ["4 floors", "5 floors", "6 floors", "7 floors"],
                correctAnswer: 1,
                explanation:
                    "Maximum floors = 15m ÷ 3m per floor = 5 floors. Zoning laws use division to determine building specifications.",
            },
            "18": {
                question:
                    "A city has 200,000 residents. If 35% are students, how many students are there?",
                options: ["60,000", "65,000", "70,000", "75,000"],
                correctAnswer: 2,
                explanation:
                    "Number of students = 200,000 × 0.35 = 70,000. Demographics help cities plan educational facilities.",
            },
            "19": {
                question:
                    "If 1 bag of cement covers 4m² and you need to cover a 20m × 8m area, how many bags are needed?",
                options: ["30 bags", "35 bags", "40 bags", "45 bags"],
                correctAnswer: 2,
                explanation:
                    "Total area = 20m × 8m = 160m². Bags needed = 160m² ÷ 4m² per bag = 40 bags. Construction planning requires accurate material calculations.",
            },
            "20": {
                question:
                    "A taxi charges ₱40 base fare plus ₱15 per km. What's the fare for a 12km trip?",
                options: ["₱180", "₱200", "₱220", "₱240"],
                correctAnswer: 2,
                explanation:
                    "Fare = Base + (Rate × Distance) = ₱40 + (₱15 × 12) = ₱40 + ₱180 = ₱220. Linear equations model many real-world pricing systems.",
            },
        };

        return (
            quizzes[missionId as keyof typeof quizzes] || {
                question: "If x + 5 = 12, what is the value of x?",
                options: ["5", "7", "17", "12"],
                correctAnswer: 1,
                explanation:
                    "Subtract 5 from both sides: x = 12 - 5 = 7. This is a basic algebraic equation solving technique.",
            }
        );
    };

    // Helper function to update UI from game progress
    const updateGameInfoFromProgress = (progress: GameProgress) => {
        const stats = gameStateManager.current.getPlayerStats();
        setGameInfo((prev) => ({
            ...prev,
            playerName: progress.playerName,
            badges: progress.badges.length,
            coins: progress.coins,
            totalScore: progress.totalScore,
            accuracy: stats?.accuracy || "0%",
            level: progress.level,
        }));
    };

    // Helper function to sync game state with Phaser registry
    const syncGameStateWithPhaser = (progress: GameProgress) => {
        if (phaserRef.current?.game) {
            phaserRef.current.game.registry.set(
                "playerName",
                progress.playerName
            );
            phaserRef.current.game.registry.set("coins", progress.coins);
            phaserRef.current.game.registry.set("badges", progress.badges);
            phaserRef.current.game.registry.set(
                "completedMissions",
                progress.completedMissions
            );
            phaserRef.current.game.registry.set(
                "totalScore",
                progress.totalScore
            );
            phaserRef.current.game.registry.set("level", progress.level);
        }
    };

    // Helper function to show notifications
    const showGameNotification = (notificationData: NotificationData) => {
        setNotification(notificationData);
        setShowNotification(true);
    };

    // Helper function to close notifications
    const closeNotification = () => {
        setShowNotification(false);
        setTimeout(() => setNotification(null), 300); // Delay to allow animation
    };

    // Subscribe to game state changes
    useEffect(() => {
        const unsubscribe = gameStateManager.current.subscribe((progress) => {
            updateGameInfoFromProgress(progress);
        });

        return unsubscribe;
    }, []);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            const mobile =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                ) ||
                window.innerWidth <= 768 ||
                "ontouchstart" in window;
            setIsMobile(mobile);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Set up interval to update game data periodically and validate state
    useEffect(() => {
        const interval = setInterval(() => {
            // Validate game state periodically
            if (!gameStateManager.current.validateCurrentState()) {
                console.warn(
                    "Game state validation failed - potential tampering detected"
                );
            }

            // Update playtime tracking
            gameStateManager.current.updatePlaytime(1 / 60); // 1 minute every 60 seconds

            // Sync with Phaser registry if needed
            const progress = gameStateManager.current.getProgress();
            if (progress && phaserRef.current?.game?.registry) {
                // Check if Phaser registry is out of sync
                const phaserCoins =
                    phaserRef.current.game.registry.get("coins") || 0;
                if (phaserCoins !== progress.coins) {
                    syncGameStateWithPhaser(progress);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Send joystick input to Phaser game
    useEffect(() => {
        if (phaserRef.current?.game && isMobile) {
            // Send joystick direction to Phaser game
            phaserRef.current.game.registry.set(
                "joystickDirection",
                joystickDirection
            );
        }
    }, [joystickDirection, isMobile]);

    // Listen for mission and notification events from Phaser
    useEffect(() => {
        const handleShowMission = (data: any) => {
            console.log("Mission event received:", data);
            setCurrentMission(data.mission);
            setShowMission(true);
        };

        const handleGameNotification = (data: NotificationData) => {
            console.log("Notification event received:", data);
            showGameNotification(data);
        };

        const handleOpenQuestLog = () => {
            console.log("Quest Log open event received");
            setShowQuestLog(true);
            // Close any open notification when quest log opens
            closeNotification();
        };

        const handleDailyChallengeUpdate = (data: any) => {
            console.log("Daily challenge update:", data);
            shopService.current.updateChallengeProgress(data.type, data.amount);
        };

        // Listen for events using EventBus
        EventBus.on("show-mission", handleShowMission);
        EventBus.on("show-notification", handleGameNotification);
        EventBus.on("open-quest-log", handleOpenQuestLog);
        EventBus.on("update-daily-challenge", handleDailyChallengeUpdate);

        return () => {
            EventBus.off("show-mission", handleShowMission);
            EventBus.off("show-notification", handleGameNotification);
            EventBus.off("open-quest-log", handleOpenQuestLog);
            EventBus.off("update-daily-challenge", handleDailyChallengeUpdate);
        };
    }, []);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-sky-300 via-blue-200 to-green-300">
            {/* Landscape Orientation Overlay - Blocks game until rotated */}
            <LandscapePrompt />

            {/* React UI Components */}
            {showMainMenu && (
                <MainMenu
                    onStartGame={handleStartGame}
                    onLoadGame={handleLoadGame}
                    onShowSettings={handleShowSettings}
                    onShowExtras={handleShowExtras}
                    onShowCredits={handleShowCredits}
                    onShowLeaderboard={handleShowLeaderboard}
                    onExit={handleExit}
                />
            )}
            {showCharacterCreation && (
                <div>
                    <div className="fixed top-4 left-4 bg-red-500 text-white p-2 rounded z-50">
                        Character Creation Active:{" "}
                        {showCharacterCreation.toString()}
                    </div>
                    <CharacterCreation
                        onCharacterCreated={handleCharacterCreated}
                    />
                </div>
            )}
            {showQuiz && currentQuiz && (
                <EnhancedQuizSystem
                    question={currentQuiz}
                    onAnswer={handleQuizAnswer}
                    onClose={() => setShowQuiz(false)}
                    missionId={currentMission?.id}
                    level={gameInfo.level}
                />
            )}
            {showMission && currentMission && (
                <MissionSystem
                    mission={currentMission}
                    onStartQuiz={handleMissionStart}
                    onClose={() => setShowMission(false)}
                />
            )}

            {/* Phaser Game Canvas - Show when in game world */}
            {!showMainMenu && !showCharacterCreation && (
                <div className="w-full h-full flex items-center justify-center">
                    <div
                        id="game-container"
                        className="relative w-full h-full max-w-full max-h-full"
                    >
                        <PhaserGame
                            ref={phaserRef}
                            currentActiveScene={currentScene}
                        />
                    </div>
                </div>
            )}

            {/* Mobile Controls - React Overlay */}
            {isMobile &&
                !showMainMenu &&
                !showCharacterCreation &&
                !showQuiz &&
                !showMission && (
                    <>
                        <VirtualJoystick
                            onMove={(direction) =>
                                setJoystickDirection(direction)
                            }
                            onStop={() => setJoystickDirection({ x: 0, y: 0 })}
                            isVisible={true}
                        />
                        <MobileInteractionButton
                            onInteract={() => {
                                // Trigger interaction in Phaser game
                                if (phaserRef.current?.game) {
                                    phaserRef.current.game.events.emit(
                                        "mobile-interact"
                                    );
                                }
                            }}
                            isVisible={true}
                        />
                    </>
                )}

            {/* React Overlay UI - Positioned above Phaser canvas */}
            {!showMainMenu &&
                !showCharacterCreation &&
                !showQuiz &&
                !showMission && (
                    <div
                        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
                        style={{ zIndex: 10 }}
                    >
                        {/* HUD - Top Left - Clean & Simple */}
                        <div className="absolute top-2 left-2 pointer-events-auto">
                            <div className="flex flex-col space-y-1">
                                <div className="flex space-x-1">
                                    {/* Player Name */}
                                    <div className="text-xs font-semibold text-gray-700 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-center shadow-soft border border-gray-200">
                                        👤{" "}
                                        {gameInfo.playerName || "Math Explorer"}
                                    </div>

                                    {/* Level */}
                                    <div className="text-xs font-semibold text-orange-600 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-center shadow-soft border border-orange-200">
                                        ⭐ L{gameInfo.level}
                                    </div>
                                </div>

                                {/* Player Title */}
                                {secretQuestService.current.getCurrentTitle() && (
                                    <div className="text-xs font-semibold text-purple-600 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-center shadow-soft border border-purple-200">
                                        👑{" "}
                                        {secretQuestService.current.getCurrentTitle()}
                                    </div>
                                )}

                                <div className="flex space-x-1">
                                    {/* Badges */}
                                    <div className="text-xs font-semibold text-amber-600 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-center shadow-soft border border-amber-200">
                                        🏆 {gameInfo.badges}/20
                                    </div>

                                    {/* Coins */}
                                    <div className="text-xs font-semibold text-yellow-600 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-center shadow-soft border border-yellow-200">
                                        💰 {gameInfo.coins}
                                    </div>

                                    {/* Score */}
                                    <div className="text-xs font-semibold text-blue-600 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-center shadow-soft border border-blue-200">
                                        📊 {gameInfo.totalScore}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions - Top Right - Clean */}
                        <div className="absolute top-2 right-2 pointer-events-auto">
                            <div className="flex space-x-1">
                                <button
                                    onClick={() =>
                                        setShowQuestLog(!showQuestLog)
                                    }
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 shadow-soft text-xs font-medium"
                                >
                                    <span>📋</span>
                                    <span className="hidden sm:inline ml-1">
                                        Quest
                                    </span>
                                </button>
                                <button
                                    onClick={() => setShowShop(!showShop)}
                                    className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 shadow-soft text-xs font-medium"
                                >
                                    <span>🏪</span>
                                    <span className="hidden sm:inline ml-1">
                                        Shop
                                    </span>
                                </button>
                                <button
                                    onClick={() =>
                                        setShowDailyChallenges(
                                            !showDailyChallenges
                                        )
                                    }
                                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 shadow-soft text-xs font-medium"
                                >
                                    <span>📅</span>
                                    <span className="hidden sm:inline ml-1">
                                        Daily
                                    </span>
                                </button>
                                <button
                                    onClick={() =>
                                        setShowSecretQuests(!showSecretQuests)
                                    }
                                    className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 shadow-soft text-xs font-medium"
                                >
                                    <span>🔐</span>
                                    <span className="hidden sm:inline ml-1">
                                        Secrets
                                    </span>
                                </button>
                                <button
                                    onClick={() =>
                                        setShowPauseMenu(!showPauseMenu)
                                    }
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 shadow-soft text-xs font-medium"
                                >
                                    <span>⏸️</span>
                                    <span className="hidden sm:inline ml-1">
                                        Menu
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Pause Menu Overlay */}
                        {showPauseMenu && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-4">
                                <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                                    <button
                                        onClick={() => setShowPauseMenu(false)}
                                        className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-soft transition-all duration-200 hover:scale-110 z-20"
                                    >
                                        ✕
                                    </button>

                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                        Game Menu
                                    </h2>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() =>
                                                setShowPauseMenu(false)
                                            }
                                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                        >
                                            ▶️ Resume Game
                                        </button>
                                        <button
                                            onClick={() =>
                                                setShowQuestLog(true)
                                            }
                                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                        >
                                            📋 Quest Log
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowPauseMenu(false);
                                                setShowInventory(true);
                                            }}
                                            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                        >
                                            🎒 Inventory
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowPauseMenu(false);
                                                setShowShop(true);
                                            }}
                                            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                        >
                                            🏪 Shop
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowPauseMenu(false);
                                                setShowDailyChallenges(true);
                                            }}
                                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                        >
                                            📅 Daily Challenges
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowPauseMenu(false);
                                                setShowSecretQuests(true);
                                            }}
                                            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                        >
                                            🔐 Secret Quests
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowPauseMenu(false);
                                                setShowLeaderboard(true);
                                            }}
                                            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                        >
                                            🏆 Leaderboard
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowPauseMenu(false);
                                                setShowCollisionEditor(true);
                                            }}
                                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                        >
                                            🎨 Collision Editor
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Switch between BarangayMap and CityMap
                                                const targetScene =
                                                    gameInfo.currentScene ===
                                                    "BarangayMap"
                                                        ? "CityMap"
                                                        : "BarangayMap";
                                                const scene =
                                                    phaserRef.current?.scene;
                                                if (scene) {
                                                    scene.scene.stop(
                                                        gameInfo.currentScene
                                                    );
                                                    scene.scene.start(
                                                        targetScene
                                                    );
                                                    setShowPauseMenu(false);
                                                }
                                            }}
                                            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                        >
                                            🗺️{" "}
                                            {gameInfo.currentScene ===
                                            "BarangayMap"
                                                ? "Go to City Map"
                                                : gameInfo.currentScene ===
                                                  "CityMap"
                                                ? "Go to Barangay Map"
                                                : "Switch Map"}
                                        </button>
                                        <button
                                            onClick={() =>
                                                window.location.reload()
                                            }
                                            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                                        >
                                            🔄 Restart Game
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quest Log Overlay */}
                        {showQuestLog && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-4">
                                <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
                                        <button
                                            onClick={() =>
                                                setShowQuestLog(false)
                                            }
                                            className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-soft transition-all duration-200 hover:scale-110 z-20"
                                        >
                                            ✕
                                        </button>

                                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                            📋 Quest Log
                                        </h2>
                                        <div className="space-y-4">
                                            <div className="rounded-xl p-4 border-2 border-blue-200 bg-blue-50">
                                                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center space-x-2">
                                                    <span>🎯</span>
                                                    <span>Main Objective</span>
                                                </h3>
                                                <p className="text-gray-700">
                                                    {gameInfo.level === 1
                                                        ? "Complete 10 barangay math challenges to unlock city-level intermediate algebra problems and become a math expert!"
                                                        : gameInfo.level === 2
                                                        ? "Complete 10 city math challenges to master intermediate algebra and unlock advanced topics!"
                                                        : "You've mastered all algebra challenges! Continue practicing to maintain your math excellence."}
                                                </p>
                                            </div>
                                            <div className="rounded-xl p-4 border-2 border-green-200 bg-green-50">
                                                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center space-x-2">
                                                    <span>📊</span>
                                                    <span>Progress</span>
                                                </h3>
                                                <p className="text-gray-700 mb-3">
                                                    {gameInfo.level === 1
                                                        ? "Basic Math Achievements"
                                                        : "Intermediate Achievements"}{" "}
                                                    Earned:{" "}
                                                    <span className="font-bold text-green-600">
                                                        {gameInfo.level === 1
                                                            ? Math.min(
                                                                  gameInfo.badges,
                                                                  10
                                                              )
                                                            : Math.max(
                                                                  0,
                                                                  gameInfo.badges -
                                                                      10
                                                              )}
                                                    </span>
                                                    /10
                                                </p>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${
                                                                gameInfo.level ===
                                                                1
                                                                    ? (Math.min(
                                                                          gameInfo.badges,
                                                                          10
                                                                      ) /
                                                                          10) *
                                                                      100
                                                                    : (Math.max(
                                                                          0,
                                                                          gameInfo.badges -
                                                                              10
                                                                      ) /
                                                                          10) *
                                                                      100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="text-center mt-2 text-sm text-gray-600">
                                                    {gameInfo.level === 1
                                                        ? Math.round(
                                                              (Math.min(
                                                                  gameInfo.badges,
                                                                  10
                                                              ) /
                                                                  10) *
                                                                  100
                                                          )
                                                        : Math.round(
                                                              (Math.max(
                                                                  0,
                                                                  gameInfo.badges -
                                                                      10
                                                              ) /
                                                                  10) *
                                                                  100
                                                          )}
                                                    % Complete
                                                </div>
                                            </div>
                                            <div className="rounded-xl p-4 border-2 border-purple-200 bg-purple-50">
                                                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center space-x-2">
                                                    <span>🏛️</span>
                                                    <span>Current Level</span>
                                                </h3>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-700 font-semibold">
                                                            {gameInfo.level ===
                                                            1
                                                                ? "Barangay Math Zone"
                                                                : "City Math Zone"}
                                                        </span>
                                                        <span className="text-amber-800 font-bold">
                                                            Level{" "}
                                                            {gameInfo.level}
                                                        </span>
                                                    </div>
                                                    <div className="text-amber-600 text-xs sm:text-sm">
                                                        {gameInfo.level === 1
                                                            ? "Learning basic algebra through real-world market and community problems"
                                                            : "Mastering intermediate algebra with business and urban planning challenges"}
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs sm:text-sm">
                                                        <span className="text-gray-700">
                                                            Accuracy:
                                                        </span>
                                                        <span className="font-bold text-green-600">
                                                            {gameInfo.accuracy}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs sm:text-sm">
                                                        <span className="text-gray-700">
                                                            Total Score:
                                                        </span>
                                                        <span className="font-bold text-blue-600">
                                                            {
                                                                gameInfo.totalScore
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        )}

                        {/* Inventory Overlay */}
                        {showInventory && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-4">
                                <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
                                        <button
                                            onClick={() =>
                                                setShowInventory(false)
                                            }
                                            className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-soft transition-all duration-200 hover:scale-110 z-20"
                                        >
                                            ✕
                                        </button>

                                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                            🎒 Inventory
                                        </h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="rounded-xl p-4 border-2 border-yellow-200 bg-yellow-50 text-center">
                                                <div className="text-3xl mb-2">
                                                    💰
                                                </div>
                                                <div className="text-gray-800 font-bold text-xl">
                                                    {gameInfo.coins}
                                                </div>
                                                <div className="text-sm text-gray-600 font-medium">
                                                    Gold Coins
                                                </div>
                                            </div>
                                            <div className="rounded-xl p-4 border-2 border-amber-200 bg-amber-50 text-center">
                                                <div className="text-3xl mb-2">
                                                    🏆
                                                </div>
                                                <div className="text-gray-800 font-bold text-xl">
                                                    {gameInfo.badges}
                                                </div>
                                                <div className="text-sm text-gray-600 font-medium">
                                                    {gameInfo.level === 1
                                                        ? "Math Achievements"
                                                        : "Total Achievements"}
                                                </div>
                                            </div>
                                            <div className="rounded-xl p-4 border-2 border-purple-200 bg-purple-50 text-center">
                                                <div className="text-3xl mb-2">
                                                    📜
                                                </div>
                                                <div className="text-gray-800 font-bold text-xl">
                                                    0
                                                </div>
                                                <div className="text-sm text-gray-600 font-medium">
                                                    Quest Items
                                                </div>
                                            </div>
                                            <div className="rounded-xl p-4 border-2 border-blue-200 bg-blue-50 text-center">
                                                <div className="text-3xl mb-2">
                                                    ⭐
                                                </div>
                                                <div className="text-gray-800 font-bold text-xl">
                                                    {gameInfo.totalScore}
                                                </div>
                                                <div className="text-sm text-gray-600 font-medium">
                                                    Experience Points
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 p-4 rounded-xl border-2 border-gray-200 bg-gray-50">
                                            <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                                                📈 Character Stats
                                            </h3>
                                            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                                                <div className="text-center">
                                                    <div className="text-gray-700 font-semibold">
                                                        Level
                                                    </div>
                                                    <div className="text-gray-800 font-bold">
                                                        {gameInfo.level}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-gray-700 font-semibold">
                                                        Math Rank
                                                    </div>
                                                    <div className="text-gray-800 font-bold">
                                                        {gameInfo.level === 1
                                                            ? gameInfo.badges >=
                                                              10
                                                                ? "Math Expert"
                                                                : gameInfo.badges >=
                                                                  5
                                                                ? "Problem Solver"
                                                                : "Beginner"
                                                            : gameInfo.badges >=
                                                              20
                                                            ? "Algebra Master"
                                                            : gameInfo.badges >=
                                                              15
                                                            ? "Math Scholar"
                                                            : "Math Student"}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-gray-700 font-semibold">
                                                        Difficulty Level
                                                    </div>
                                                    <div className="text-gray-800 font-bold">
                                                        {gameInfo.level === 1
                                                            ? "Basic"
                                                            : "Intermediate"}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-gray-700 font-semibold">
                                                        Quiz Accuracy
                                                    </div>
                                                    <div className="text-gray-800 font-bold">
                                                        {gameInfo.accuracy}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            {/* Game Notification Modal */}
            <GameNotification
                notification={notification}
                onClose={closeNotification}
                isVisible={showNotification}
            />

            {/* Settings Modal */}
            <Settings
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowSettings(false);
                }}
                isVisible={showSettings}
            />

            {/* Extras Modal */}
            <Extras
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowExtras(false);
                }}
                isVisible={showExtras}
            />

            {/* Credits Modal */}
            <Credits
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowCredits(false);
                }}
                isVisible={showCredits}
            />

            {/* Leaderboard Modal */}
            <Leaderboard
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowLeaderboard(false);
                }}
                isVisible={showLeaderboard}
            />

            {/* Shop Modal */}
            <Shop
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowShop(false);
                }}
                isVisible={showShop}
            />

            {/* Daily Challenges Modal */}
            <DailyChallenges
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowDailyChallenges(false);
                }}
                isVisible={showDailyChallenges}
            />

            {/* Secret Quests Modal */}
            <SecretQuests
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowSecretQuests(false);
                }}
                isVisible={showSecretQuests}
            />

            {/* Collision Editor Modal */}
            <CollisionEditor
                onClose={() => {
                    audioManager.playEffect("menu-close");
                    setShowCollisionEditor(false);
                }}
                isVisible={showCollisionEditor}
                mapName={currentMapForEditor}
                backgroundImage={
                    currentMapForEditor === "BarangayMap"
                        ? "/barangay-background.png"
                        : "/assets/city-background.png"
                }
            />

            {/* Achievement Celebration */}
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

            {/* Debug Panel for Development */}
            <GameDebugPanel />

            {/* PWA Install Prompt */}
            <PWAInstallPrompt />
        </div>
    );
}

export default App;
