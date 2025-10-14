import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";

export class MissionSystem extends Scene {
    background: GameObjects.Rectangle;
    title: GameObjects.Text;
    description: GameObjects.Text;
    npcName: GameObjects.Text;
    startButton: GameObjects.Text;
    closeButton: GameObjects.Text;
    missionData: any;

    // Mission definitions - Algebra Adventure themed
    missions = {
        1: {
            name: "Introduction to Variables",
            npc: "Math Tutor Maya",
            description:
                "Learn to solve basic algebra problems using variables and simple equations.",
            reward: "Algebra Beginner Badge + 10 coins",
            task: "Solve linear equations with variables",
            quiz: {
                question:
                    "During a 20% off sale, a shirt costs ₱240. What was its original price?",
                options: ["₱260", "₱288", "₱300", "₱320"],
                correct: 2,
                explanation:  "If the shirt is 20% off, it costs 80% of the original price. So 0.8 × original = ₱240. Dividing both sides by 0.8: original = ₱240 ÷ 0.8 = ₱300."
            },
        },
        2: {
            name: "Expressions and Operations",
            npc: "Accountant Rico",
            description: "Master algebraic expressions and operations.",
            reward: "Expression Expert Badge + 15 coins",
            task: "Simplify algebraic expressions",
            quiz: {
                question: "Simplify: 3x + 5x - 2x",
                options: ["6x", "10x", "8x", "5x"],
                correct: 0,
                explanation: "Combine like terms: 3x + 5x - 2x = (3 + 5 - 2)x = 6x"
            },
        },
        3: {
            name: "Solving Equations",
            npc: "Teacher Ana",
            description: "Help residents solve everyday problems using equations.",
            reward: "Equation Solver Badge + 12 coins",
            task: "Solve one-step and two-step equations",
            quiz: {
                question: "Solve for x: 2x + 7 = 19",
                options: ["x = 6", "x = 12", "x = 13", "x = 26"],
                correct: 0,
                explanation: "Subtract 7 from both sides: 2x = 12. Then divide by 2: x = 6"
            },
        },
        4: {
            name: "Understanding Inequalities",
            npc: "Project Coordinator Ben",
            description: "Learn inequalities for resource planning.",
            reward: "Inequality Master Badge + 18 coins",
            task: "Solve inequality problems",
            quiz: {
                question:
                    "A taxi charges ₱40 base fare plus ₱15 per km. If you have ₱200, what's the maximum distance you can travel?",
                options: [
                    "Less than 10 km",
                    "Less than or equal to 10 km",
                    "More than 10 km",
                    "Exactly 15 km",
                ],
                correct: 1,
                explanation: "Set up: 40 + 15x ≤ 200. Solving: 15x ≤ 160, so x ≤ 10.67. Maximum is 10 km (can't pay for partial km)."
            },
        },
        5: {
            name: "Systems of Equations",
            npc: "Garden Coordinator Lisa",
            description:
                "Use systems of equations for optimization.",
            reward: "Systems Expert Badge + 20 coins",
            task: "Solve systems using substitution and elimination",
            quiz: {
                question:
                    "Two numbers add to 15. One number is 3 more than the other. What are the numbers?",
                options: [
                    "5 and 10",
                    "6 and 9",
                    "7 and 8",
                    "4 and 11",
                ],
                correct: 1,
                explanation: "Let x and y be the numbers. x + y = 15 and x = y + 3. Substituting: (y + 3) + y = 15, so 2y = 12, y = 6. Then x = 9."
            },
        },
        6: {
            name: "Factoring Fundamentals",
            npc: "Architect Mike",
            description:
                "Learn factoring techniques for design layouts.",
            reward: "Factoring Pro Badge + 25 coins",
            task: "Factor quadratic expressions",
            quiz: {
                question: "Factor: x² + 7x + 12",
                options: [
                    "(x + 3)(x + 4)",
                    "(x + 2)(x + 6)",
                    "(x + 1)(x + 12)",
                    "(x - 3)(x - 4)",
                ],
                correct: 0,
                explanation: "Find two numbers that multiply to 12 and add to 7: 3 and 4. So x² + 7x + 12 = (x + 3)(x + 4)"
            },
        },
        7: {
            name: "Quadratic Equations",
            npc: "Engineer Sarah",
            description:
                "Master quadratic equations for trajectory modeling.",
            reward: "Quadratic Master Badge + 22 coins",
            task: "Solve quadratic equations",
            quiz: {
                question:
                    "A ball is thrown upward with height h = -5t² + 20t + 1 (in meters). When does it reach maximum height?",
                options: [
                    "t = 1 second",
                    "t = 2 seconds",
                    "t = 3 seconds",
                    "t = 4 seconds",
                ],
                correct: 1,
                explanation: "Maximum occurs at vertex: t = -b/(2a) = -20/(2×-5) = -20/-10 = 2 seconds"
            },
        },
        8: {
            name: "Functions and Graphs",
            npc: "Data Analyst Carlos",
            description:
                "Understand functions and graphing for data analysis.",
            reward: "Function Expert Badge + 30 coins",
            task: "Plot and interpret functions",
            quiz: {
                question: "If f(x) = 3x - 5, what is f(4)?",
                options: ["7", "12", "17", "11"],
                correct: 0,
                explanation: "Substitute x = 4: f(4) = 3(4) - 5 = 12 - 5 = 7"
            },
        },
        9: {
            name: "Polynomials and Ratios",
            npc: "Scientist Dr. Emma",
            description: "Work with polynomials and ratios.",
            reward: "Polynomial Pro Badge + 28 coins",
            task: "Perform polynomial operations",
            quiz: {
                question:
                    "A recipe for 4 people needs 3 cups of flour. How much for 10 people?",
                options: [
                    "6 cups",
                    "6.5 cups",
                    "7 cups",
                    "7.5 cups",
                ],
                correct: 3,
                explanation: "Set up proportion: 3/4 = x/10. Cross-multiply: 4x = 30, so x = 7.5 cups"
            },
        },
        10: {
            name: "Advanced Problem Solving",
            npc: "Master Mathematician Prof. Jose",
            description:
                "Apply all algebra skills to complex problems.",
            reward: "Algebra Master Badge + 35 coins",
            task: "Solve multi-step word problems",
            quiz: {
                question:
                    "Two cars start 300 km apart, driving toward each other. Car A goes 80 km/h, Car B goes 70 km/h. When do they meet?",
                options: [
                    "1.5 hours",
                    "2 hours",
                    "2.5 hours",
                    "3 hours",
                ],
                correct: 1,
                explanation: "Combined speed: 80 + 70 = 150 km/h. Time = Distance/Speed = 300/150 = 2 hours"
            },
        },
    };

    constructor() {
        super("MissionSystem");
    }

    init(data: any) {
        this.missionData = data;
    }

    create() {
        // Pokémon-style background overlay
        this.background = this.add.rectangle(
            512,
            384,
            1024,
            768,
            0x000000,
            0.7
        );

        // Pokémon-style mission panel
        this.createPokemonMissionPanel();

        EventBus.emit("current-scene-ready", this);
    }

    createPokemonMissionPanel() {
        // Panel background with Pokémon styling
        const panel = this.add.rectangle(512, 384, 650, 550, 0x2e86ab);
        panel.setStrokeStyle(6, 0xffd700);
        panel.setDepth(100);

        // Panel shadow
        const shadow = this.add.rectangle(515, 387, 650, 550, 0x000000, 0.3);
        shadow.setDepth(99);

        // Title with Pokémon styling
        this.title = this.add
            .text(512, 200, this.missions[this.missionData.missionId].name, {
                fontFamily: "Arial Black",
                fontSize: 32,
                color: "#FFD700",
                stroke: "#FFFFFF",
                strokeThickness: 5,
                align: "center",
                shadow: {
                    offsetX: 3,
                    offsetY: 3,
                    color: "#000000",
                    blur: 6,
                    fill: true,
                },
            })
            .setOrigin(0.5)
            .setDepth(101);

        // NPC name with Pokémon styling
        this.npcName = this.add
            .text(
                512,
                250,
                `NPC: ${this.missions[this.missionData.missionId].npc}`,
                {
                    fontFamily: "Arial Black",
                    fontSize: 20,
                    color: "#4ECDC4",
                    stroke: "#000000",
                    strokeThickness: 3,
                    align: "center",
                }
            )
            .setOrigin(0.5)
            .setDepth(101);

        // Description with Pokémon styling
        this.description = this.add
            .text(
                512,
                320,
                this.missions[this.missionData.missionId].description,
                {
                    fontFamily: "Arial",
                    fontSize: 18,
                    color: "#FFFFFF",
                    stroke: "#000000",
                    strokeThickness: 2,
                    align: "center",
                    wordWrap: { width: 580 },
                }
            )
            .setOrigin(0.5)
            .setDepth(101);

        // Reward with Pokémon styling
        this.add
            .text(
                512,
                400,
                `Reward: ${this.missions[this.missionData.missionId].reward}`,
                {
                    fontFamily: "Arial Black",
                    fontSize: 18,
                    color: "#FF6B6B",
                    stroke: "#FFFFFF",
                    strokeThickness: 3,
                    align: "center",
                    shadow: {
                        offsetX: 2,
                        offsetY: 2,
                        color: "#000000",
                        blur: 4,
                        fill: true,
                    },
                }
            )
            .setOrigin(0.5)
            .setDepth(101);

        // Pokémon-style buttons
        this.createPokemonButtons();
    }

    createPokemonButtons() {
        // Start button with Pokémon styling
        const startBg = this.add.rectangle(512, 470, 200, 50, 0x26de81);
        startBg.setStrokeStyle(4, 0x2e86ab);
        startBg.setDepth(100);

        this.startButton = this.add
            .text(512, 470, "START MISSION", {
                fontFamily: "Arial Black",
                fontSize: 20,
                color: "#FFFFFF",
                stroke: "#2E86AB",
                strokeThickness: 3,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(101)
            .setInteractive()
            .on("pointerdown", () => this.startMission())
            .on("pointerover", () => {
                this.startButton.setColor("#FFD700");
                startBg.setFillStyle(0xff6b6b);
                startBg.setStrokeStyle(4, 0xffd700);
            })
            .on("pointerout", () => {
                this.startButton.setColor("#FFFFFF");
                startBg.setFillStyle(0x26de81);
                startBg.setStrokeStyle(4, 0x2e86ab);
            });

        // Close button with Pokémon styling
        const closeBg = this.add.rectangle(512, 530, 150, 40, 0xff6b6b);
        closeBg.setStrokeStyle(3, 0x2e86ab);
        closeBg.setDepth(100);

        this.closeButton = this.add
            .text(512, 530, "CLOSE", {
                fontFamily: "Arial Black",
                fontSize: 16,
                color: "#FFFFFF",
                stroke: "#2E86AB",
                strokeThickness: 2,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(101)
            .setInteractive()
            .on("pointerdown", () => this.closeMission())
            .on("pointerover", () => {
                this.closeButton.setColor("#FFD700");
                closeBg.setFillStyle(0x4ecdc4);
                closeBg.setStrokeStyle(3, 0xffd700);
            })
            .on("pointerout", () => {
                this.closeButton.setColor("#FFFFFF");
                closeBg.setFillStyle(0xff6b6b);
                closeBg.setStrokeStyle(3, 0x2e86ab);
            });
    }

    startMission() {
        // Simulate mission completion (in a real game, this would be more complex)
        this.simulateMissionCompletion();
    }

    simulateMissionCompletion() {
        // Show mission completion message
        this.add
            .text(512, 350, "Mission Completed!", {
                fontFamily: "Arial Black",
                fontSize: 24,
                color: "#00FF00",
                stroke: "#000000",
                strokeThickness: 2,
                align: "center",
            })
            .setOrigin(0.5);

        // Start quiz
        this.time.delayedCall(2000, () => {
            this.scene.launch("QuizSystem", {
                missionId: this.missionData.missionId,
                quiz: this.missions[this.missionData.missionId].quiz,
            });
        });
    }

    closeMission() {
        this.scene.stop();
    }
}
