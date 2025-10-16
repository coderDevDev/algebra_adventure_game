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
            // Level 1: Barangay Math Challenges (1-10) - Basic to Intermediate Algebra
            "1": {
                question:
                    "During a 20% off sale, a shirt costs ₱240. What was its original price?",
                options: ["₱260", "₱288", "₱300", "₱320"],
                correctAnswer: 2,
                explanation:
                    "If the shirt is 20% off, it costs 80% of the original price. Let x = original price. Then 0.8x = ₱240. Dividing both sides by 0.8: x = ₱240 ÷ 0.8 = ₱300. This demonstrates using variables to solve real-world problems.",
                steps: [
                    "Let x = original price",
                    "20% off means 80% remains: 0.8x = 240",
                    "Divide both sides by 0.8: x = 240 ÷ 0.8",
                    "x = 300",
                ],
                formula: "0.8x = 240, so x = 240/0.8",
                hints: [
                    "Let x represent the unknown original price",
                    "20% off means you pay 80%, so 0.8x = 240",
                    "Solve for x by dividing both sides by 0.8",
                ],
            },
            "2": {
                question:
                    "Simplify: 3x + 5x - 2x",
                options: ["6x", "10x", "8x", "5x"],
                correctAnswer: 0,
                explanation:
                    "Combine like terms by adding and subtracting coefficients: 3x + 5x - 2x = (3 + 5 - 2)x = 6x. This is a fundamental skill in algebraic manipulation.",
                steps: [
                    "Identify like terms (all have variable x)",
                    "Combine coefficients: 3 + 5 - 2 = 6",
                    "Result: 6x",
                ],
                formula: "ax + bx + cx = (a + b + c)x",
                hints: [
                    "All terms have the same variable (x)",
                    "Just add/subtract the numbers in front",
                    "3 + 5 - 2 = ?",
                ],
            },
            "3": {
                question:
                    "You work H hours at ₱120/hour and earn ₱960 total. How many hours did you work?",
                options: ["6 hours", "7 hours", "8 hours", "9 hours"],
                correctAnswer: 2,
                explanation:
                    "Use equation: 120H = 960. Divide both sides by 120: H = 960 ÷ 120 = 8 hours. This demonstrates solving equations for unknown values in salary calculations.",
                steps: [
                    "Set up equation: 120H = 960",
                    "Divide both sides by 120",
                    "H = 960 ÷ 120",
                    "H = 8 hours",
                ],
                formula: "Rate × Hours = Total, so H = Total/Rate",
                hints: [
                    "Total pay = hourly rate × hours",
                    "Divide total by rate to find hours",
                    "960 ÷ 120 = ?",
                ],
            },
            "4": {
                question: "A delivery truck can carry max 500 kg. It has 180 kg loaded. Each box weighs 40 kg. How many more boxes can fit?",
                options: ["7 boxes", "8 boxes", "9 boxes", "10 boxes"],
                correctAnswer: 1,
                explanation:
                    "Set up inequality: 180 + 40x ≤ 500. Subtract 180: 40x ≤ 320. Divide by 40: x ≤ 8. Maximum is 8 boxes. Inequalities determine capacity constraints for safe transport.",
                steps: [
                    "Current load + new boxes ≤ max capacity",
                    "180 + 40x ≤ 500",
                    "40x ≤ 320",
                    "x ≤ 8 boxes",
                ],
                formula: "Current + (Weight per box × boxes) ≤ Max",
                hints: [
                    "Use inequality for weight limit constraint",
                    "Subtract current weight from max capacity",
                    "Divide by weight per box",
                ],
            },
            "5": {
                question:
                    "Two investments total ₱50,000. Investment A returns 5%, B returns 8%. Total return is ₱3,400. How much in A?",
                options: ["₱20,000", "₱25,000", "₱30,000", "₱35,000"],
                correctAnswer: 0,
                explanation:
                    "Let A and B be amounts. System: A + B = 50,000 and 0.05A + 0.08B = 3,400. From first: B = 50,000 - A. Substitute: 0.05A + 0.08(50,000 - A) = 3,400, giving 0.05A + 4,000 - 0.08A = 3,400, so -0.03A = -600, thus A = 20,000. Systems optimize investment allocation.",
                steps: [
                    "A + B = 50,000 and 0.05A + 0.08B = 3,400",
                    "B = 50,000 - A",
                    "0.05A + 0.08(50,000 - A) = 3,400",
                    "-0.03A = -600",
                    "A = ₱20,000",
                ],
                formula: "A + B = 50000, 0.05A + 0.08B = 3400",
                hints: [
                    "Two equations: total amount and total return",
                    "Substitute one equation into the other",
                    "Solve for one variable first",
                ],
            },
            "6": {
                question:
                    "A rectangular garden has area x² + 7x + 12 m². Factor to find possible dimensions.",
                options: ["(x + 3) by (x + 4)", "(x + 2) by (x + 6)", "(x + 1) by (x + 12)", "(x - 3) by (x - 4)"],
                correctAnswer: 0,
                explanation:
                    "Factor x² + 7x + 12: find two numbers that multiply to 12 and add to 7. Those are 3 and 4, giving (x + 3)(x + 4). These represent possible length and width. Factoring helps design spaces with specific areas.",
                steps: [
                    "Area = x² + 7x + 12",
                    "Find factors of 12 that add to 7: 3 and 4",
                    "Factor: (x + 3)(x + 4)",
                    "Dimensions: (x + 3) meters by (x + 4) meters",
                ],
                formula: "x² + (a+b)x + ab = (x + a)(x + b)",
                hints: [
                    "Area = length × width for rectangles",
                    "Find two numbers: product = 12, sum = 7",
                    "Factors represent the dimensions",
                ],
            },
            "7": {
                question:
                    "A basketball's height is h = -5t² + 10t + 2 meters. At what time does it reach maximum height?",
                options: ["0.5 seconds", "1 second", "1.5 seconds", "2 seconds"],
                correctAnswer: 1,
                explanation:
                    "For quadratic h = at² + bt + c, maximum at t = -b/(2a). Here a = -5, b = 10, so t = -10/(2×-5) = -10/-10 = 1 second. Athletes and coaches use quadratics to analyze shot trajectories and optimize performance.",
                steps: [
                    "Identify: a = -5, b = 10, c = 2",
                    "Use vertex formula: t = -b/(2a)",
                    "t = -10/(2×-5) = -10/-10",
                    "t = 1 second",
                ],
                formula: "t = -b/(2a) for h = at² + bt + c",
                hints: [
                    "Parabola's vertex gives maximum height",
                    "Use t = -b/(2a) for the time",
                    "a = -5, b = 10",
                ],
            },
            "8": {
                question: "Stock price function: P(d) = 2d + 50 pesos. What's the price after 7 days?",
                options: ["₱56", "₱60", "₱64", "₱70"],
                correctAnswer: 2,
                explanation:
                    "Evaluate P(7): substitute d = 7 into P(d) = 2d + 50, giving P(7) = 2(7) + 50 = 14 + 50 = ₱64. Functions help track and predict stock prices, temperatures, and other changing values over time.",
                steps: [
                    "Function: P(d) = 2d + 50",
                    "Find P(7): substitute d = 7",
                    "P(7) = 2(7) + 50",
                    "P(7) = 14 + 50 = ₱64",
                ],
                formula: "P(d) = 2d + 50",
                hints: [
                    "Replace d with 7 in the function",
                    "Multiply 2 × 7 first",
                    "Add 50 to the result",
                ],
            },
            "9": {
                question:
                    "A recipe for 4 people needs 3 cups of flour. How much flour is needed for 10 people?",
                options: ["6 cups", "6.5 cups", "7 cups", "7.5 cups"],
                correctAnswer: 3,
                explanation:
                    "Set up proportion: 3/4 = x/10. Cross-multiply: 4x = 30. Divide by 4: x = 7.5 cups. Proportions and ratios are essential for scaling recipes and solving similar problems.",
                steps: [
                    "Set up proportion: 3/4 = x/10",
                    "Cross-multiply: 4 × x = 3 × 10",
                    "4x = 30",
                    "x = 7.5 cups",
                ],
                formula: "3/4 = x/10",
                hints: [
                    "Use a proportion to relate the quantities",
                    "Cross-multiplication solves proportions",
                    "If 4 people need 3 cups, what do 10 people need?",
                ],
            },
            "10": {
                question:
                    "Project budget: ₱100,000 for materials at ₱5,000/day and labor at ₱3,000/day. Project needs 8 material-days and 12 labor-days. Total cost?",
                options: ["₱76,000", "₱80,000", "₱84,000", "₱88,000"],
                correctAnswer: 0,
                explanation:
                    "Calculate each cost: Materials = 8 days × ₱5,000/day = ₱40,000. Labor = 12 days × ₱3,000/day = ₱36,000. Total = ₱40,000 + ₱36,000 = ₱76,000. Multi-step problems combine multiple equations for project management.",
                steps: [
                    "Material cost = 8 × ₱5,000 = ₱40,000",
                    "Labor cost = 12 × ₱3,000 = ₱36,000",
                    "Total = ₱40,000 + ₱36,000",
                    "Total = ₱76,000",
                ],
                formula: "Total = (days₁ × rate₁) + (days₂ × rate₂)",
                hints: [
                    "Calculate material cost separately",
                    "Calculate labor cost separately",
                    "Add both costs together",
                ],
            },

            // Level 2: City Math Challenges (11-20) - Advanced Algebra
            "11": {
                question:
                    "A city population grows exponentially at 3% per year. If current population is 50,000, what will it be in 2 years?",
                options: ["53,000", "53,045", "56,000", "56,180"],
                correctAnswer: 1,
                explanation:
                    "Use exponential growth formula: P(t) = P₀(1 + r)^t = 50,000(1.03)² = 50,000(1.0609) = 53,045. Exponential functions model population, investments, and decay.",
                steps: [
                    "Formula: P(t) = P₀(1 + r)^t",
                    "P₀ = 50,000, r = 0.03, t = 2",
                    "P(2) = 50,000(1.03)²",
                    "P(2) = 50,000 × 1.0609 = 53,045",
                ],
                formula: "P(t) = P₀(1 + r)^t",
                hints: [
                    "Growth rate 3% means multiply by 1.03 each year",
                    "Apply the growth twice (squared)",
                    "Don't just add 3% twice - that's compound growth!",
                ],
            },
            "12": {
                question:
                    "If log₁₀(x) = 3, what is x?",
                options: ["30", "100", "1,000", "10,000"],
                correctAnswer: 2,
                explanation:
                    "Converting from logarithmic to exponential form: log₁₀(x) = 3 means 10³ = x, so x = 1,000. Logarithms are the inverse of exponentials and used in pH, decibels, and Richter scale.",
                steps: [
                    "log₁₀(x) = 3 means 'what power of 10 gives x?'",
                    "Convert to exponential: 10³ = x",
                    "Calculate: 10³ = 10 × 10 × 10 = 1,000",
                ],
                formula: "log_b(x) = y ↔ b^y = x",
                hints: [
                    "Log is asking: 10 to what power equals x?",
                    "If the answer is 3, then 10³ = x",
                    "10³ = 1,000",
                ],
            },
            "13": {
                question:
                    "An event organizer sells tickets. Revenue R = -2p² + 80p where p is price. What price maximizes revenue?",
                options: ["₱15", "₱20", "₱25", "₱30"],
                correctAnswer: 1,
                explanation:
                    "For quadratic R = -2p² + 80p, maximum occurs at p = -b/(2a) = -80/(2×-2) = -80/-4 = 20. At p = ₱20, maximum revenue is -2(20)² + 80(20) = ₱800. This demonstrates revenue optimization using quadratic vertex formula.",
                steps: [
                    "Quadratic: R = -2p² + 80p (a = -2, b = 80)",
                    "Maximum at vertex: p = -b/(2a)",
                    "p = -80/(2×-2) = -80/-4 = 20",
                    "Optimal price: ₱20",
                ],
                formula: "p = -b/(2a) for R = ap² + bp + c",
                hints: [
                    "Use vertex formula for parabola maximum",
                    "Coefficient a is negative, so parabola opens down",
                    "Maximum occurs at p = -b/(2a)",
                ],
            },
            "14": {
                question:
                    "Two workers complete a job in 6 hours together. Worker A alone takes 10 hours. How long for Worker B alone?",
                options: ["12 hours", "15 hours", "18 hours", "20 hours"],
                correctAnswer: 1,
                explanation:
                    "Work rates add: 1/A + 1/B = 1/Together. So 1/10 + 1/B = 1/6. Solve: 1/B = 1/6 - 1/10 = (10-6)/60 = 4/60 = 1/15. Therefore B takes 15 hours alone. Rational equations solve work rate problems in project management.",
                steps: [
                    "Let B = hours for Worker B alone",
                    "Rate equation: 1/10 + 1/B = 1/6",
                    "1/B = 1/6 - 1/10",
                    "1/B = (10 - 6)/(60) = 4/60 = 1/15",
                    "B = 15 hours",
                ],
                formula: "1/A + 1/B = 1/Together",
                hints: [
                    "Work rates are reciprocals of time",
                    "Add the individual rates to get combined rate",
                    "Find common denominator",
                ],
            },
            "15": {
                question:
                    "A vehicle depreciates ₱8,000/year starting at ₱120,000. What's its value after 5 years?",
                options: ["₱80,000", "₱72,000", "₱88,000", "₱76,000"],
                correctAnswer: 0,
                explanation:
                    "This is an arithmetic sequence with a₁ = 120,000 and d = -8,000. After 5 years: Value = 120,000 + 5(-8,000) = 120,000 - 40,000 = 80,000. Arithmetic sequences model depreciation for budget planning.",
                steps: [
                    "Initial value: ₱120,000",
                    "Depreciation per year: ₱8,000",
                    "After 5 years: 5 × ₱8,000 = ₱40,000 lost",
                    "Current value: ₱120,000 - ₱40,000 = ₱80,000",
                ],
                formula: "Value = Initial + (years × depreciation)",
                hints: [
                    "Depreciation means value decreases each year",
                    "Multiply yearly depreciation by number of years",
                    "Subtract total depreciation from initial value",
                ],
            },
            "16": {
                question:
                    "Parking: ₱40 for first 2 hours, then ₱30/hour. Cost for 5 hours?",
                options: ["₱110", "₱120", "₱130", "₱190"],
                correctAnswer: 2,
                explanation:
                    "Piecewise function: First 2 hours = ₱40 flat. Remaining 3 hours = 3 × ₱30 = ₱90. Total = ₱40 + ₱90 = ₱130. Piecewise functions model scenarios with different rules for different ranges, like tiered pricing.",
                steps: [
                    "First 2 hours: ₱40 flat rate",
                    "Hours 3, 4, 5: 3 × ₱30 = ₱90",
                    "Total cost: ₱40 + ₱90 = ₱130",
                ],
                formula: "f(x) = {40 if x≤2; 40+30(x-2) if x>2}",
                hints: [
                    "Piecewise: different rates for different ranges",
                    "First 2 hours use flat rate",
                    "Additional hours charged per hour",
                ],
            },
            "17": {
                question:
                    "City budget matrix: [Education Health Transport] = [40, 30, 30]% totaling ₱500M. Find Education allocation.",
                options: ["₱150M", "₱175M", "₱200M", "₱225M"],
                correctAnswer: 2,
                explanation:
                    "Matrix multiplication: Education gets 40% of ₱500M. Calculate: 0.40 × 500 = ₱200M. Matrices organize multi-department budget allocation efficiently.",
                steps: [
                    "Total budget: ₱500M",
                    "Education percentage: 40%",
                    "Calculate: 40% × ₱500M",
                    "0.40 × 500 = ₱200M",
                ],
                formula: "Allocation = Percentage × Total",
                hints: [
                    "Convert percentage to decimal",
                    "Multiply by total budget",
                    "40% = 0.40",
                ],
            },
            "18": {
                question:
                    "A surveyor measures building height. From 30m away, angle of elevation is 40°. Find height. (tan 40° ≈ 0.84)",
                options: ["20.2 m", "22.8 m", "25.2 m", "28.0 m"],
                correctAnswer: 2,
                explanation:
                    "Use tangent ratio: tan(θ) = opposite/adjacent = height/distance. So height = distance × tan(θ) = 30 × 0.84 = 25.2m. Trigonometry is essential for surveying and construction.",
                steps: [
                    "Given: distance = 30m, angle = 40°",
                    "Use tangent: tan(40°) = height/30",
                    "height = 30 × tan(40°)",
                    "height = 30 × 0.84 = 25.2m",
                ],
                formula: "tan(θ) = opposite/adjacent",
                hints: [
                    "Tangent relates opposite side to adjacent side",
                    "Height is opposite, distance is adjacent",
                    "Multiply distance by tan(angle)",
                ],
            },
            "19": {
                question:
                    "City disease rates per 1000: Area A=15, B=22, C=18, D=25, E=20. Find mean rate for public health planning.",
                options: ["18 per 1000", "20 per 1000", "22 per 1000", "25 per 1000"],
                correctAnswer: 1,
                explanation:
                    "Mean = (15 + 22 + 18 + 25 + 20) ÷ 5 = 100 ÷ 5 = 20 per 1000. The mean helps identify which areas need more health resources. Statistics guide public health policy.",
                steps: [
                    "Add all disease rates: 15 + 22 + 18 + 25 + 20",
                    "Sum = 100",
                    "Divide by number of areas: 100 ÷ 5",
                    "Mean = 20 per 1000 residents",
                ],
                formula: "Mean = Σx/n",
                hints: [
                    "Add all the rates together",
                    "Count how many areas there are",
                    "Divide total by count",
                ],
            },
            "20": {
                question:
                    "Smart city planning: Budget equation 2E + 3T = 1200 and E + T = 500 (E=Environmental, T=Tech). Find E.",
                options: ["₱200M", "₱250M", "₱300M", "₱350M"],
                correctAnswer: 2,
                explanation:
                    "System: 2E + 3T = 1200 and E + T = 500. Multiply second by 3: 3E + 3T = 1500. Subtract first equation: (3E + 3T) - (2E + 3T) = 1500 - 1200, giving E = 300. Then T = 500 - 300 = 200. Comprehensive planning uses multiple equations to optimize city resources.",
                steps: [
                    "System: 2E + 3T = 1200, E + T = 500",
                    "Multiply second by 3: 3E + 3T = 1500",
                    "Subtract first: E = 1500 - 1200 = 300",
                    "Environmental budget: ₱300M",
                ],
                formula: "2E + 3T = 1200, E + T = 500",
                hints: [
                    "Use elimination method",
                    "Multiply to align coefficients",
                    "Subtract to eliminate T variable",
                ],
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
