import { GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";
import { GameStateManager } from "../../utils/GameStateManager";
import CollisionService from "../../services/CollisionService";

/**
 * NationalMap - Level 5 (Missions 41-50)
 *
 * 🎯 AUTO-LOADED: This scene automatically loads when the player completes
 * all 40 Regional missions (Levels 1-4). The transition happens automatically
 * after displaying a level-up celebration notification.
 *
 * Contains expert-level algebra challenges for top-tier players.
 */
export class NationalMap extends Scene {
    // 🎨 DEBUG MODE: Set to false to hide collision boundaries in production
    private readonly DEBUG_SHOW_COLLISIONS: boolean = false;

    // 🧪 TESTING MODE: Set to true to bypass mission prerequisites for testing
    private readonly DEBUG_BYPASS_PREREQUISITES: boolean = true;

    player: Phaser.Physics.Arcade.Sprite;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd: any;
    npcs: Phaser.Physics.Arcade.Group;
    ui: GameObjects.Container;
    interactionPrompt: GameObjects.Text;
    nearbyNPC: any = null;

    // Scene management
    tileSize: number = 32;
    mapWidth: number = 1000;
    mapHeight: number = 1000;
    lastDirection: string = "front";

    // Mobile controls
    virtualJoystick: any = null;
    isMobile: boolean = false;
    touchControls: any = null;

    // Background image reference
    backgroundImage: any = null;

    // Collision bodies
    collisionBodies: Phaser.Physics.Arcade.StaticGroup | null = null;

    // Mission indicators for real-time updates
    missionIndicators: Map<number, any> = new Map();

    // NPC glow effects for interaction feedback
    npcGlowEffects: Map<number, any> = new Map();

    // Location display above player head
    locationDisplay: GameObjects.Text | null = null;

    // Collectible items system
    collectibles: Phaser.Physics.Arcade.Group | null = null;
    collectibleItems: Map<string, any> = new Map();

    // Minimap/Radar system
    minimap: GameObjects.Container | null = null;
    minimapBackground: GameObjects.Graphics | null = null;
    minimapPlayerDot: GameObjects.Arc | null = null;
    minimapNPCDots: GameObjects.Arc[] = [];
    minimapCollectibleDots: GameObjects.Arc[] = [];

    // Level 5 National Mission locations
    missionLocations = [
        {
            x: 8,
            y: 6,
            name: "Radical Equations",
            npc: "DepEd Undersecretary",
            missionId: 41,
            percentX: 19,
            percentY: 46,
        },
        {
            x: 21,
            y: 46,
            name: "Complex Numbers",
            npc: "DOST Secretary",
            missionId: 42,
            percentX: 59,
            percentY: 23,
        },
        {
            x: 22,
            y: 10,
            name: "Polynomial Theorems",
            npc: "CHED Commissioner",
            missionId: 43,
            percentX: 81,
            percentY: 23,
        },
        {
            x: 10,
            y: 16,
            name: "Advanced Matrices",
            npc: "NEDA Director General",
            missionId: 44,
            percentX: 81,
            percentY: 46,
        },
        {
            x: 18,
            y: 14,
            name: "Conic Sections",
            npc: "National Scientist",
            missionId: 45,
            percentX: 79,
            percentY: 67,
        },
        {
            x: 5,
            y: 20,
            name: "Parametric Equations",
            npc: "PAGASA Administrator",
            missionId: 46,
            percentX: 60,
            percentY: 90,
        },
        {
            x: 20,
            y: 18,
            name: "Advanced Sequences",
            npc: "PSA Administrator",
            missionId: 47,
            percentX: 50,
            percentY: 78,
        },
        {
            x: 12,
            y: 22,
            name: "Binomial Theorem",
            npc: "Senate Education Committee Chair",
            missionId: 48,
            percentX: 19,
            percentY: 89,
        },
        {
            x: 25,
            y: 15,
            name: "Partial Fractions",
            npc: "DBM Secretary",
            missionId: 49,
            percentX: 27,
            percentY: 27,
        },
        {
            x: 16,
            y: 12,
            name: "Mathematical Proofs",
            npc: "DepEd Secretary",
            missionId: 50,
            percentX: 50,
            percentY: 56,
        },
    ];

    // Collectible items for National (Level 5) - Expert value items
    collectibleItemsData = [
        {
            id: "national-coin-1",
            type: "coin",
            name: "Gold Math Token",
            description: "A prestigious national algebra token",
            value: 15,
            points: 30,
            rarity: "common",
            percentX: 35,
            percentY: 37,
            icon: "💰",
        },
        {
            id: "national-coin-2",
            type: "coin",
            name: "Gold Math Token",
            description: "A prestigious national algebra token",
            value: 15,
            points: 30,
            rarity: "common",
            percentX: 35,
            percentY: 9,
            icon: "💰",
        },
        {
            id: "national-coin-3",
            type: "coin",
            name: "Gold Math Token",
            description: "A prestigious national algebra token",
            value: 15,
            points: 30,
            rarity: "common",
            percentX: 59,
            percentY: 4,
            icon: "💰",
        },
        {
            id: "national-badge-1",
            type: "badge",
            name: "National Excellence Badge",
            description: "A badge for national algebra excellence",
            value: 40,
            points: 80,
            rarity: "uncommon",
            percentX: 44,
            percentY: 4,
            icon: "🏅",
        },
        {
            id: "national-badge-2",
            type: "badge",
            name: "Expert Analysis Badge",
            description: "A badge for expert mathematical analysis",
            value: 40,
            points: 80,
            rarity: "uncommon",
            percentX: 5,
            percentY: 42,
            icon: "🏅",
        },
        {
            id: "national-treasure-1",
            type: "treasure",
            name: "Complex Numbers Crystal",
            description: "The legendary complex numbers crystal",
            value: 90,
            points: 180,
            rarity: "rare",
            percentX: 11,
            percentY: 67,
            icon: "💎",
        },
        {
            id: "national-powerup-1",
            type: "powerup",
            name: "Genius Boost",
            description: "Dramatically enhances problem-solving ability",
            value: 35,
            points: 70,
            rarity: "uncommon",
            percentX: 6,
            percentY: 94,
            icon: "⚡",
        },
        {
            id: "national-powerup-2",
            type: "powerup",
            name: "Genius Boost",
            description: "Dramatically enhances problem-solving ability",
            value: 35,
            points: 70,
            rarity: "uncommon",
            percentX: 30,
            percentY: 95,
            icon: "⚡",
        },
        {
            id: "national-gem-1",
            type: "treasure",
            name: "Radical Equations Gem",
            description: "Rare radical equations artifact",
            value: 80,
            points: 160,
            rarity: "rare",
            percentX: 41,
            percentY: 82,
            icon: "💠",
        },
        {
            id: "national-gem-2",
            type: "treasure",
            name: "National Algebra Medal",
            description: "Prestigious national algebra medal",
            value: 75,
            points: 150,
            rarity: "rare",
            percentX: 87,
            percentY: 82,
            icon: "🎖️",
        },
    ];

    constructor() {
        super("NationalMap");
    }

    create() {
        console.log("=== CREATING NATIONAL MAP (LEVEL 5) ===");

        // Create national background
        this.createNationalBackground();

        // Create player with collision
        this.createPlayer();

        // Create National NPCs
        this.createNationalNPCs();

        // Create UI
        this.createUI();

        // Create location display above player head
        this.createLocationDisplay();

        // Set unlimited camera bounds for open world
        this.cameras.main.setBounds(-Infinity, -Infinity, Infinity, Infinity);

        // Ensure camera follows player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);

        // Force camera to center on player initially
        this.cameras.main.centerOn(this.player.x, this.player.y);

        // Optimize for open world camera
        this.time.delayedCall(100, () => {
            this.cameras.main.startFollow(this.player);
            this.optimizeCameraForOpenWorld();
            console.log("National Map camera setup complete");
        });

        // Mobile device detection
        this.isMobile =
            this.sys.game.device.input.touch ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            ) ||
            window.innerWidth <= 768;
        console.log("Mobile device detected in National:", this.isMobile);

        // Set up input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys("W,S,A,D");

        // Set up interaction key
        this.input.keyboard.on("keydown-SPACE", () =>
            this.interactWithNearbyNPC()
        );

        // Create location display after player is created (with delay to ensure player exists)
        this.time.delayedCall(200, () => {
            if (this.player && !this.locationDisplay) {
                this.createLocationDisplay();
            }
        });

        // Create minimap after everything is loaded
        this.time.delayedCall(400, () => {
            this.createMinimap();
        });

        // Listen for mobile interaction events from React
        this.game.events.on("mobile-interact", () => {
            this.interactWithNearbyNPC();
        });

        // Add resize handler
        this.scale.on("resize", this.handleResize, this);
        this.scale.on("orientationchange", this.handleResize, this);

        EventBus.emit("current-scene-ready", this);
    }

    // Method to update NPC indicators in real-time
 updateNPCIndicators() {
    const gameStateManager = GameStateManager.getInstance();
    
    this.missionLocations.forEach((location) => {
        const indicator = this.missionIndicators.get(location.missionId);

        if (indicator) {
            // Calculate world coordinates using the same logic as in createNationalNPCsAfterLoad
            let worldX, worldY;
            if (location.percentX !== undefined && location.percentY !== undefined) {
                const coords = this.percentageToWorldCoordinates(
                    location.percentX,
                    location.percentY
                );
                worldX = coords.x;
                worldY = coords.y;
            } else {
                worldX = location.x * this.tileSize + this.tileSize / 2;
                worldY = location.y * this.tileSize + this.tileSize / 2;
            }

            let indicatorText = `Mission #${location.missionId}`;
            let indicatorColor = "#FFD700"; // Gold for available

            if (gameStateManager.isMissionCompleted(location.missionId)) {
                indicatorText = "✓";
                indicatorColor = "#32CD32"; // Lime green for completed
            } else if (!gameStateManager.canAccessMission(location.missionId)) {
                indicatorText = "🔒";
                indicatorColor = "#DC143C"; // Crimson red for locked
            }

            indicator.setText(indicatorText);
            indicator.setColor(indicatorColor);
            indicator.setPosition(worldX + 30, worldY - 100);  // Position adjusted
        }
    });

    console.log("National NPC indicators updated in real-time");
}

    optimizeCameraForOpenWorld() {
        if (this.player) {
            this.cameras.main.setBounds(
                -Infinity,
                -Infinity,
                Infinity,
                Infinity
            );
            this.cameras.main.setLerp(0.08, 0.08);
            this.cameras.main.setDeadzone(25, 25);
            console.log("National camera optimized for open world");
        }
    }

    createNationalBackground() {
        console.log("Creating national background...");
        console.log(
            "National background texture exists:",
            this.textures.exists("national-bg-root")
        );

        // If textures don't exist, load them directly
        if (!this.textures.exists("national-bg-root")) {
            console.log("National textures not loaded, loading them now...");
            this.load.image("national-bg-root", "national-background.png");
            this.load.start();

            this.load.once("complete", () => {
                console.log("National textures loaded, creating background...");
                this.createNationalBackgroundImage();
            });
        } else {
            // Wait a bit for textures to be fully loaded
            this.time.delayedCall(100, () => {
                this.createNationalBackgroundImage();
            });
        }
    }

    createNationalBackgroundImage() {
        console.log("Creating national background image after delay...");
        console.log(
            "National background root texture exists now:",
            this.textures.exists("national-bg-root")
        );

        // Create national background image as the main visual element
        if (this.textures.exists("national-bg-root")) {
            console.log("Using national background image...");
            console.log("Texture details:", this.textures.get("national-bg-root"));

            try {
                // Get Phaser game canvas dimensions for perfect coverage
                const gameWidth = this.scale.width;
                const gameHeight = this.scale.height;
                const gameCenterX = gameWidth / 2;
                const gameCenterY = gameHeight / 2;

                const bgImage = this.add.image(
                    gameCenterX,
                    gameCenterY,
                    "national-bg-root"
                );
                bgImage.setOrigin(0.5, 0.5);
                bgImage.setDepth(-2000); // Much further behind everything

                // Scale background to cover the entire Phaser game canvas
                const scaleToCoverWidth = gameWidth / bgImage.width;
                const scaleToCoverHeight = gameHeight / bgImage.height;

                // Use the larger scale to ensure the image covers the entire game canvas
                const scaleX = Math.max(scaleToCoverWidth, scaleToCoverHeight);
                const scaleY = scaleX; // Keep aspect ratio

                // Ensure minimum scale for very small screens
                const minScale = 0.1;
                const finalScaleX = Math.max(scaleX, minScale);
                const finalScaleY = Math.max(scaleY, minScale);

                console.log(
                    "National background scaling to cover entire Phaser game canvas:"
                );
                console.log(
                    "Game canvas dimensions:",
                    gameWidth,
                    "x",
                    gameHeight
                );
                console.log(
                    "Image dimensions:",
                    bgImage.width,
                    "x",
                    bgImage.height
                );
                console.log(
                    "Scale factors:",
                    scaleToCoverWidth,
                    scaleToCoverHeight
                );
                console.log("Final scale:", finalScaleX, finalScaleY);

                bgImage.setScale(finalScaleX, finalScaleY);

                // Position background to cover the entire Phaser game canvas
                bgImage.setPosition(gameWidth / 2, gameHeight / 2);

                // Store the background reference for future updates
                this.backgroundImage = bgImage;

                bgImage.setAlpha(1); // Fully visible
                bgImage.setVisible(true); // Explicitly set visible
                console.log("National background image created successfully");

                // Reposition player relative to background if player already exists
                if (this.player) {
                    this.repositionPlayerRelativeToBackground();
                }

                // Reposition NPCs relative to background if they already exist
                this.repositionNPCsRelativeToBackground();

                // Load collision data after background is ready
                this.time.delayedCall(200, () => {
                    this.loadCollisions();
                });

                // Create collectibles after background is ready
                this.time.delayedCall(300, () => {
                    this.createCollectibles();
                });
            } catch (error) {
                console.error("Error creating national background image:", error);
                // Fallback to gold background if image fails
                this.createFallbackNationalBackground();
            }
        } else {
            console.log("National background texture not found, using fallback");
            this.createFallbackNationalBackground();
        }
    }

    createFallbackNationalBackground() {
        // Create fallback national background with gold theme
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        const bg = this.add.rectangle(
            gameWidth / 2,
            gameHeight / 2,
            gameWidth * 2,
            gameHeight * 2,
            0xFFD700, // Gold for national theme
            1
        );
        bg.setDepth(-2000);

        // Add some national-like patterns
        const grid = this.add.graphics();
        grid.lineStyle(1, 0xFFA500, 0.3);

        // Draw a grid pattern to simulate national areas
        for (let x = 0; x < gameWidth * 2; x += 150) {
            grid.lineBetween(x, 0, x, gameHeight * 2);
        }
        for (let y = 0; y < gameHeight * 2; y += 150) {
            grid.lineBetween(0, y, gameWidth * 2, y);
        }
        grid.setDepth(-1000);

        console.log("Fallback national background created successfully");
    }

    createPlayer() {
        // Use the same player sprite as Level 1
        const playerTexture = this.textures.exists("student-front-1")
            ? "student-front-1"
            : "player";

        console.log("Creating player in National Map with texture:", playerTexture);

        // Calculate player position relative to background image
        let playerX, playerY;

        if (this.backgroundImage) {
            // Position at 30%, 50% of background image
            const coords = this.percentageToWorldCoordinates(30, 50);
            playerX = coords.x;
            playerY = coords.y;

            console.log(
                "National player spawning at (30%, 50%):",
                playerX,
                playerY
            );
        } else {
            // Fallback to original position if background not ready
            playerX = 16 * this.tileSize;
            playerY = 12 * this.tileSize;
            console.log(
                "Using fallback national player position:",
                playerX,
                playerY
            );
        }

        this.player = this.physics.add.sprite(playerX, playerY, playerTexture);

        // Remove world bounds collision for unlimited movement
        this.player.setCollideWorldBounds(false);
        this.player.setScale(0.2);

        console.log("National player created with unlimited movement");

        // Create player animations if not already created
        this.createPlayerAnimations();
    }

    createPlayerAnimations() {
        // Check if animations already exist (from Level 1)
        if (this.anims.exists("student-front-walk")) {
            console.log("Player animations already exist, skipping creation");
            return;
        }

        console.log("Creating player animations for National Map...");

        // Create the same animations as Level 1
        const requiredTextures = [
            "student-front-1",
            "student-front-2",
            "student-front-3",
            "student-front-4",
            "student-back-1",
            "student-back-2",
            "student-back-3",
            "student-back-4",
            "student-left-1",
            "student-left-2",
            "student-left-3",
            "student-left-4",
            "student-right-1",
            "student-right-2",
            "student-right-3",
            "student-right-4",
        ];

        for (const texture of requiredTextures) {
            if (!this.textures.exists(texture)) {
                console.error(
                    `Required texture ${texture} not found in National Map!`
                );
                return;
            }
        }

        // Create walking animations
        this.anims.create({
            key: "student-front-walk",
            frames: [
                { key: "student-front-1" },
                { key: "student-front-2" },
                { key: "student-front-3" },
                { key: "student-front-4" },
            ],
            frameRate: 8,
            repeat: -1,
        });

        this.anims.create({
            key: "student-back-walk",
            frames: [
                { key: "student-back-1" },
                { key: "student-back-2" },
                { key: "student-back-3" },
                { key: "student-back-4" },
            ],
            frameRate: 8,
            repeat: -1,
        });

        this.anims.create({
            key: "student-left-walk",
            frames: [
                { key: "student-left-1" },
                { key: "student-left-2" },
                { key: "student-left-3" },
                { key: "student-left-4" },
            ],
            frameRate: 8,
            repeat: -1,
        });

        this.anims.create({
            key: "student-right-walk",
            frames: [
                { key: "student-right-1" },
                { key: "student-right-2" },
                { key: "student-right-3" },
                { key: "student-right-4" },
            ],
            frameRate: 8,
            repeat: -1,
        });

        // Create idle animations
        this.anims.create({
            key: "student-front-idle",
            frames: [{ key: "student-front-1" }],
            frameRate: 1,
        });

        this.anims.create({
            key: "student-back-idle",
            frames: [{ key: "student-back-1" }],
            frameRate: 1,
        });

        this.anims.create({
            key: "student-left-idle",
            frames: [{ key: "student-left-1" }],
            frameRate: 1,
        });

        this.anims.create({
            key: "student-right-idle",
            frames: [{ key: "student-right-1" }],
            frameRate: 1,
        });

        console.log("National player animations created successfully!");
    }

    createNationalNPCs() {
        this.npcs = this.physics.add.group();

        console.log("Creating National NPCs for Level 5...");

        // Debug: List all available textures
        console.log(
            "Available textures in NationalMap:",
            Object.keys(this.textures.list)
        );

        // Map national official NPC names to their dedicated Level 5 image keys
      const nationalNPCImageMap = {
    // Map the actual NPC names from missionLocations to their corresponding image files
    "DepEd Undersecretary": "deped-undersecretary",
    "DOST Secretary": "dost-secretary",
    "CHED Commissioner": "ched-commissioner",
    "NEDA Director General": "neda-director-general",
    "National Scientist": "national-scientist",
    "PAGASA Administrator": "pagasa-administrator",
    "PSA Administrator": "psa-administrator",
    "Senate Education Committee Chair": "senate-education-committee-chair",
    "DBM Secretary": "dbm-secretary",
    "DepEd Secretary": "deped-secretary"
};
        // Check if Level 5 NPC images are loaded, if not load them directly
        const level5Images = Object.values(nationalNPCImageMap);
        const missingImages = level5Images.filter(
            (img) => !this.textures.exists(img)
        );

        if (missingImages.length > 0) {
            console.log(
                "Missing Level 5 national official images, loading them directly:",
                missingImages
            );
            missingImages.forEach((img) => {
                // Map the image key back to the file name
                const imageFileMap = {
                    "deped-undersecretary": "deped-undersecretary.png",
                    "dost-secretary": "dost-secretary.png",
                    "ched-commissioner": "ched-commissioner.png",
                    "neda-director-general": "neda-director-general.png",
                    "national-scientist": "national-scientist.png",
                    "pagasa-administrator": "pagasa-administrator.png",
                    "psa-administrator": "psa-administrator.png",
                    "senate-education-chair": "senate-education-chair.png",
                    "dbm-secretary": "dbm-secretary.png",
                    "deped-secretary": "deped-secretary.png",
                };
                this.load.image(img, `assets/LEVEL5/${imageFileMap[img]}`);
            });
            this.load.start();

            this.load.once("complete", () => {
                console.log(
                    "Level 5 national official images loaded, creating NPCs..."
                );
                this.createNationalNPCsAfterLoad(nationalNPCImageMap);
            });
            return;
        }

        this.createNationalNPCsAfterLoad(nationalNPCImageMap);
    }

    createNationalNPCsAfterLoad(npcImageMap: any) {
        this.missionLocations.forEach((location, index) => {
            // Use percentage coordinates if available, otherwise fallback to tile coordinates
            let worldX, worldY;

            if (
                location.percentX !== undefined &&
                location.percentY !== undefined
            ) {
                // Use background-relative percentage coordinates
                const coords = this.percentageToWorldCoordinates(
                    location.percentX,
                    location.percentY
                );
                worldX = coords.x;
                worldY = coords.y;
                console.log(
                    `National NPC ${location.npc} positioned at (${location.percentX}%, ${location.percentY}%) = (${worldX}, ${worldY})`
                );
            } else {
                // Fallback to tile-based coordinates
                worldX = location.x * this.tileSize + this.tileSize / 2;
                worldY = location.y * this.tileSize + this.tileSize / 2;
                console.log(
                    `National NPC ${location.npc} positioned at tile (${location.x}, ${location.y}) = (${worldX}, ${worldY})`
                );
            }

            // Get the specific NPC image for this national official
            const npcImageKey = npcImageMap[location.npc] || "student-front-1";

            console.log(
                `Creating National NPC: ${location.npc} with image: ${npcImageKey}`
            );
            console.log(
                `Level 5 texture exists for ${npcImageKey}:`,
                this.textures.exists(npcImageKey)
            );

            // Use fallback if texture doesn't exist
            const finalImageKey = this.textures.exists(npcImageKey)
                ? npcImageKey
                : "student-front-1";

            const npc = this.physics.add.sprite(worldX, worldY, finalImageKey);
            npc.setScale(0.3); // Same scale as player for consistent sizing
            npc.setInteractive();

            // Set up collision body for NPC
            npc.body.setSize(npc.width * 0.8, npc.height * 0.8);
            npc.body.setOffset(npc.width * 0.1, npc.height * 0.1);
            npc.body.setImmovable(true);
            npc.body.setGravity(0, 0);
            npc.body.setVelocity(0, 0);
            npc.body.setAngularVelocity(0);

            // Add NPC name with national styling
            const npcName = this.add
                .text(worldX, worldY - 35, location.npc, {
                    fontFamily: "Arial Black",
                    fontSize: 11,
                    color: "#FFD700", // Gold for national theme
                    stroke: "#8B4513", // Saddle brown stroke
                    strokeThickness: 2,
                    align: "center",
                    shadow: {
                        offsetX: 1,
                        offsetY: 1,
                        color: "#000080",
                        blur: 2,
                        fill: true,
                    },
                })
                .setOrigin(0.5)
                .setDepth(100);

            // Add mission indicator with validation-based styling
            const gameStateManager = GameStateManager.getInstance();
            let indicatorText = `Mission #${location.missionId}`;
            let indicatorColor = "#FFD700"; // Gold for available

            if (gameStateManager.isMissionCompleted(location.missionId)) {
                indicatorText = "✓";
                indicatorColor = "#32CD32"; // Lime green for completed
            } else if (!gameStateManager.canAccessMission(location.missionId)) {
                indicatorText = "🔒";
                indicatorColor = "#DC143C"; // Crimson red for locked
            }

            const missionIndicator = this.add
                .text(worldX + 25, worldY - 25, indicatorText, {
                    fontFamily: "Arial Black",
                    fontSize: 18,
                    color: indicatorColor,
                    stroke: "#000000",
                    strokeThickness: 3,
                    align: "center",
                    shadow: {
                        offsetX: 1,
                        offsetY: 1,
                        color: "#000000",
                        blur: 2,
                        fill: true,
                    },
                })
                .setOrigin(0.5)
                .setDepth(100);

            // Store reference for real-time updates
            this.missionIndicators.set(location.missionId, missionIndicator);

            // Add mission number beside NPC name
            const missionNumber = this.add
                .text(worldX - 35, worldY - 35, `#${location.missionId}`, {
                    fontFamily: "Arial Black",
                    fontSize: 12,
                    color: "#FFA500", // Orange for national theme
                    stroke: "#8B4513", // Saddle brown stroke
                    strokeThickness: 2,
                    align: "center",
                    backgroundColor: "#2F4F4F", // Dark slate gray
                    padding: { x: 4, y: 2 },
                })
                .setOrigin(0.5)
                .setDepth(100);

            // Add a national-themed glow effect around NPCs
            const glow = this.add.circle(worldX, worldY, 25, 0xFFD700, 0.15); // Gold glow
            glow.setDepth(-1);

            // Store mission data and original position on NPC
            npc.setData("missionData", location);
            npc.setData("originalPosition", { x: worldX, y: worldY });

            this.npcs.add(npc);
        });

        console.log(
            `Created ${this.missionLocations.length} National NPCs for Level 5 with dedicated national official sprites from LEVEL5 folder`
        );

        // Update indicators after all NPCs are created
        this.updateNPCIndicators();

        // Add collision between player and NPCs
        this.physics.add.collider(this.player, this.npcs, (player, npc) => {
            npc.body.setVelocity(0, 0);
            npc.body.setAngularVelocity(0);
            npc.body.setImmovable(true);
            player.body.setVelocity(0, 0);
            player.body.setAngularVelocity(0);
        });

        console.log("National NPC collision detection enabled");
    }

    createUI() {
        // Create interaction prompt positioned relative to player
        this.interactionPrompt = this.add
            .text(
                this.player.x + 80, // Right side of player
                this.player.y,
                this.isMobile ? "Tap to interact" : "Tap to interact",
                {
                    fontFamily: "Arial Black",
                    fontSize: 14,
                    color: "#FFA500", // Orange for national theme
                    stroke: "#8B4513", // Saddle brown stroke
                    strokeThickness: 3,
                    align: "center",
                    backgroundColor: "#2F4F4F", // Dark slate gray
                    padding: { x: 8, y: 4 },
                }
            )
            .setOrigin(0.5)
            .setDepth(1000)
            .setScrollFactor(1) // Follow camera with world
            .setVisible(false);
    }

    createLocationDisplay() {
        // Create location display above player head
        this.locationDisplay = this.add
            .text(
                this.player.x,
                this.player.y - 60, // Position above player head
                "Location: (0, 0)",
                {
                    fontFamily: "Arial Black",
                    fontSize: this.isMobile ? 12 : 14,
                    color: "#FFFFFF",
                    stroke: "#000000",
                    strokeThickness: 2,
                    align: "center",
                    backgroundColor: "rgba(255, 215, 0, 0.8)", // Gold for national theme
                    padding: { x: 8, y: 4 },
                    shadow: {
                        offsetX: 1,
                        offsetY: 1,
                        color: "#000000",
                        blur: 2,
                        fill: true,
                    },
                }
            )
            .setOrigin(0.5)
            .setDepth(500) // Above player but below UI elements
            .setScrollFactor(1) // Follow camera (moves with world)
            .setVisible(true);

        console.log("National location display created above player head");
    }

    repositionPlayerRelativeToBackground() {
        if (this.player && this.backgroundImage) {
            // Position player at 30%, 50% of background image
            const coords = this.percentageToWorldCoordinates(30, 50);
            this.player.setPosition(coords.x, coords.y);

            console.log(
                "National player repositioned to (30%, 50%):",
                coords.x,
                coords.y
            );
            console.log(
                "National background dimensions:",
                this.backgroundImage.displayWidth,
                this.backgroundImage.displayHeight
            );
        }
    }

    // Convert percentage coordinates to world coordinates relative to background image
    percentageToWorldCoordinates(percentX: number, percentY: number) {
        if (!this.backgroundImage) {
            // Fallback to tile-based coordinates
            return {
                x: (percentX / 100) * (this.mapWidth * this.tileSize),
                y: (percentY / 100) * (this.mapHeight * this.tileSize),
            };
        }

        const bgWidth = this.backgroundImage.displayWidth;
        const bgHeight = this.backgroundImage.displayHeight;
        const bgX = this.backgroundImage.x;
        const bgY = this.backgroundImage.y;

        // Calculate world coordinates from percentage
        const worldX = bgX + (percentX - 50) * (bgWidth / 100);
        const worldY = bgY + (percentY - 50) * (bgHeight / 100);

        return { x: worldX, y: worldY };
    }

    async loadCollisions() {
        // Safety check: ensure physics system is ready
        if (!this.physics || !this.physics.add) {
            console.log("Physics system not ready, retrying collision load...");
            this.time.delayedCall(100, () => {
                this.loadCollisions();
            });
            return;
        }

        const collisionService = CollisionService.getInstance();

        // Try localStorage first (for editor testing), then JSON file
        let collisionData = collisionService.loadCollisionData("NationalMap");

        if (!collisionData) {
            // Try loading from public folder JSON file
            collisionData = await collisionService.loadCollisionDataFromFile(
                "NationalMap"
            );
        }

        if (collisionData && this.backgroundImage) {
            console.log("✅ Loading collision data for NationalMap...");
            console.log(
                `Found ${collisionData.shapes.length} collision shapes`
            );

            this.collisionBodies = collisionService.createCollisions(
                this,
                collisionData,
                this.backgroundImage
            );

            // 🎨 VISUAL DEBUG: Draw colored outlines to see collision boundaries (only in debug mode)
            if (this.DEBUG_SHOW_COLLISIONS) {
                collisionData.shapes.forEach((shape) => {
                    if (shape.type === "rectangle") {
                        const box = shape as any;
                        const coords = this.percentageToWorldCoordinates(
                            box.percentX + box.percentWidth / 2,
                            box.percentY + box.percentHeight / 2
                        );
                        const width =
                            (box.percentWidth / 100) *
                            this.backgroundImage.displayWidth;
                        const height =
                            (box.percentHeight / 100) *
                            this.backgroundImage.displayHeight;

                        const debugRect = this.add.rectangle(
                            coords.x,
                            coords.y,
                            width,
                            height,
                            0xff0000,
                            0 // Transparent fill
                        );
                        debugRect.setStrokeStyle(3, 0xff0000); // Red outline
                        debugRect.setDepth(1000);

                        console.log(
                            `🎨 Visualized collision "${
                                box.name
                            }" at (${box.percentX.toFixed(
                                1
                            )}%, ${box.percentY.toFixed(1)}%)`
                        );
                    } else if (shape.type === "polygon") {
                        const poly = shape as any;
                        const graphics = this.add.graphics();
                        graphics.lineStyle(3, 0x0000ff); // Blue outline
                        graphics.setDepth(1000);

                        const firstPoint = poly.points[0];
                        const firstCoords = this.percentageToWorldCoordinates(
                            firstPoint.percentX,
                            firstPoint.percentY
                        );
                        graphics.beginPath();
                        graphics.moveTo(firstCoords.x, firstCoords.y);

                        for (let i = 1; i < poly.points.length; i++) {
                            const point = poly.points[i];
                            const coords = this.percentageToWorldCoordinates(
                                point.percentX,
                                point.percentY
                            );
                            graphics.lineTo(coords.x, coords.y);
                        }

                        graphics.closePath();
                        graphics.strokePath();

                        console.log(
                            `🎨 Visualized polygon "${poly.name}" with ${poly.points.length} points`
                        );
                    } else if (shape.type === "circle") {
                        const circle = shape as any;
                        const coords = this.percentageToWorldCoordinates(
                            circle.percentX,
                            circle.percentY
                        );
                        const radius =
                            (circle.percentRadius / 100) *
                            Math.min(
                                this.backgroundImage.displayWidth,
                                this.backgroundImage.displayHeight
                            );

                        const graphics = this.add.graphics();
                        graphics.lineStyle(3, 0x00ff00); // Green outline
                        graphics.setDepth(1000);
                        graphics.strokeCircle(coords.x, coords.y, radius);

                        console.log(
                            `🎨 Visualized circle "${
                                circle.name
                            }" at (${circle.percentX.toFixed(
                                1
                            )}%, ${circle.percentY.toFixed(1)}%)`
                        );
                    }
                });
            } else {
                console.log(
                    "🚫 Visual debug disabled - collision boundaries are invisible"
                );
            }

            // Add collision between player and collision bodies
            if (this.collisionBodies && this.player) {
                this.physics.add.collider(this.player, this.collisionBodies);
                console.log(
                    `✅ Player collision enabled with ${collisionData.shapes.length} collision shapes`
                );
            }
        } else {
            console.log("⚠️ No collision data found for NationalMap");
        }
    }

    repositionNPCsRelativeToBackground() {
        if (!this.npcs || !this.backgroundImage) return;

        this.npcs.children.entries.forEach((npc: any, index: number) => {
            const missionData = npc.getData("missionData");
            if (
                missionData &&
                missionData.percentX !== undefined &&
                missionData.percentY !== undefined
            ) {
                // Reposition NPC using percentage coordinates
                const coords = this.percentageToWorldCoordinates(
                    missionData.percentX,
                    missionData.percentY
                );
                npc.setPosition(coords.x, coords.y);

                // Update original position data
                npc.setData("originalPosition", { x: coords.x, y: coords.y });

                console.log(
                    `Repositioned National NPC ${missionData.npc} to (${missionData.percentX}%, ${missionData.percentY}%) = (${coords.x}, ${coords.y})`
                );
            }
        });
    }

    updateLocationDisplay() {
        if (this.locationDisplay && this.player) {
            // Calculate position relative to background image
            let relativeX = 0,
                relativeY = 0;
            let areaName = "National";

            if (this.backgroundImage) {
                // Calculate percentage position relative to background image
                const bgWidth = this.backgroundImage.displayWidth;
                const bgHeight = this.backgroundImage.displayHeight;
                const bgX = this.backgroundImage.x;
                const bgY = this.backgroundImage.y;

                // Calculate relative position within background image
                const playerRelativeX = this.player.x - (bgX - bgWidth / 2);
                const playerRelativeY = this.player.y - (bgY - bgHeight / 2);

                // Convert to percentage (0-100%)
                relativeX = Math.round((playerRelativeX / bgWidth) * 100);
                relativeY = Math.round((playerRelativeY / bgHeight) * 100);

                // Clamp values to 0-100%
                relativeX = Math.max(0, Math.min(100, relativeX));
                relativeY = Math.max(0, Math.min(100, relativeY));

                // Determine area based on percentage position (national districts)
                if (relativeX < 25 && relativeY < 25) {
                    areaName = "Government District";
                } else if (relativeX >= 75 && relativeY < 25) {
                    areaName = "Business District";
                } else if (relativeX < 25 && relativeY >= 75) {
                    areaName = "Residential District";
                } else if (relativeX >= 75 && relativeY >= 75) {
                    areaName = "Industrial District";
                } else if (
                    relativeX >= 37.5 &&
                    relativeX < 62.5 &&
                    relativeY >= 37.5 &&
                    relativeY < 62.5
                ) {
                    areaName = "National Center";
                } else if (
                    relativeX >= 25 &&
                    relativeX < 75 &&
                    relativeY < 25
                ) {
                    areaName = "Administrative Zone";
                } else if (
                    relativeX >= 25 &&
                    relativeX < 75 &&
                    relativeY >= 75
                ) {
                    areaName = "Service District";
                } else if (
                    relativeX < 25 &&
                    relativeY >= 25 &&
                    relativeY < 75
                ) {
                    areaName = "Cultural Quarter";
                } else if (
                    relativeX >= 75 &&
                    relativeY >= 25 &&
                    relativeY < 75
                ) {
                    areaName = "Commercial Zone";
                } else {
                    areaName = "National Area";
                }

                console.log(
                    `National player position: ${relativeX}%, ${relativeY}% - Area: ${areaName}`
                );
            } else {
                // Fallback to tile-based coordinates if background not available
                const mapX = Math.round(this.player.x / this.tileSize);
                const mapY = Math.round(this.player.y / this.tileSize);
                relativeX = mapX;
                relativeY = mapY;
            }

            // Update display text with percentage coordinates and area name
            const displayText = `${areaName}\n(${relativeX}%, ${relativeY}%)`;
            this.locationDisplay.setText(displayText);

            // Position above player head
            this.locationDisplay.setPosition(this.player.x, this.player.y - 60);

            // Update font size based on screen size
            const fontSize = this.isMobile ? 10 : 12;
            this.locationDisplay.setStyle({ fontSize });
        }
    }

    handleResize() {
        // Safety check: ensure camera is initialized
        if (!this.cameras || !this.cameras.main) {
            console.log("Camera not yet initialized, skipping resize");
            return;
        }

        console.log("National screen resized, updating camera and background...");
        this.optimizeCameraForOpenWorld();

        // Update background scaling for new screen size
        this.updateNationalBackgroundForOrientation();

        // Re-detect mobile device for new screen size
        this.isMobile =
            this.sys.game.device.input.touch ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            ) ||
            window.innerWidth <= 768;

        console.log("National mobile device detected after resize:", this.isMobile);
    }

    // Handle national background scaling for orientation changes
    updateNationalBackgroundForOrientation() {
        // Find the national background image and update its scale
        const children = this.children.list;
        for (let child of children) {
            if (child.texture && child.texture.key === "national-bg-root") {
                const gameWidth = this.scale.width;
                const gameHeight = this.scale.height;

                // Scale background to cover the entire Phaser game canvas
                const scaleToCoverWidth = gameWidth / child.width;
                const scaleToCoverHeight = gameHeight / child.height;

                // Use the larger scale to ensure the image covers the entire game canvas
                const scaleX = Math.max(scaleToCoverWidth, scaleToCoverHeight);
                const scaleY = scaleX; // Keep aspect ratio

                child.setScale(scaleX, scaleY);
                child.setPosition(gameWidth / 2, gameHeight / 2);

                console.log(
                    "National background rescaled to cover entire Phaser game canvas:"
                );
                console.log(
                    "Game canvas dimensions:",
                    gameWidth,
                    "x",
                    gameHeight
                );
                console.log(
                    "Image dimensions:",
                    child.width,
                    "x",
                    child.height
                );
                console.log(
                    "Scale factors:",
                    scaleToCoverWidth,
                    scaleToCoverHeight
                );
                console.log("Final scale:", scaleX, scaleY);
                break;
            }
        }
    }

    update() {
        if (!this.player) return;

        // Player movement - reduced speed for more natural walking
        const speed = 120; // Slower, more realistic walking speed (was 200)
        let isMoving = false;
        let currentDirection = "";
        let velocityX = 0;
        let velocityY = 0;

        // Handle keyboard input (desktop)
        if (!this.isMobile) {
            if (this.cursors.left.isDown || this.wasd.A.isDown) {
                velocityX = -speed;
                isMoving = true;
                currentDirection = "left";
                this.lastDirection = "left";
            } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
                velocityX = speed;
                isMoving = true;
                currentDirection = "right";
                this.lastDirection = "right";
            }

            if (this.cursors.up.isDown || this.wasd.W.isDown) {
                velocityY = -speed;
                isMoving = true;
                currentDirection = "back";
                this.lastDirection = "back";
            } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
                velocityY = speed;
                isMoving = true;
                currentDirection = "front";
                this.lastDirection = "front";
            }
        } else {
            // Handle React joystick input
            const joystickDirection = this.registry.get(
                "joystickDirection"
            ) || { x: 0, y: 0 };

            if (joystickDirection.x !== 0 || joystickDirection.y !== 0) {
                velocityX = joystickDirection.x * speed;
                velocityY = joystickDirection.y * speed;
                isMoving = true;

                if (Math.abs(velocityX) > Math.abs(velocityY)) {
                    currentDirection = velocityX > 0 ? "right" : "left";
                } else {
                    currentDirection = velocityY > 0 ? "front" : "back";
                }
                this.lastDirection = currentDirection;
            }
        }

        // Apply velocity with collision detection
        if (isMoving) {
            const newX = this.player.x + velocityX * 0.016;
            const newY = this.player.y + velocityY * 0.016;

            const isMovingAway = this.isPlayerMovingAwayFromNPCs(newX, newY);

            if (isMovingAway || this.canPlayerMoveTo(newX, newY)) {
                this.player.setVelocity(velocityX, velocityY);
            } else {
                this.player.setVelocity(0, 0);
            }
        } else {
            this.player.setVelocity(0, 0);
        }

        // Handle sprite direction and animations
        if (isMoving) {
            const spriteKey = `student-${currentDirection}-1`;
            if (this.textures.exists(spriteKey)) {
                this.player.setTexture(spriteKey);
            }

            if (this.anims && this.anims.exists) {
                const walkAnimKey = `student-${currentDirection}-walk`;
                if (this.anims.exists(walkAnimKey)) {
                    this.player.play(walkAnimKey, true);
                }
            }
        } else {
            this.player.setVelocity(0, 0);
            const idleSpriteKey = `student-${this.lastDirection}-1`;
            if (this.textures.exists(idleSpriteKey)) {
                this.player.setTexture(idleSpriteKey);
            }

            if (this.anims && this.anims.exists) {
                const idleAnimKey = `student-${this.lastDirection}-idle`;
                if (this.anims.exists(idleAnimKey)) {
                    this.player.play(idleAnimKey, true);
                }
            }
        }

        // Check for nearby NPCs
        this.checkForNearbyNPCs();

        // Update location display above player head
        this.updateLocationDisplay();

        // Update minimap
        this.updateMinimap();

        // Ensure NPCs stay in their original positions
        this.enforceNPCPositions();
    }

    // Helper methods (same as Level 1 with minor adjustments)
    isPlayerMovingAwayFromNPCs(newX: number, newY: number) {
        const currentDistance = this.getDistanceToNearestNPC();
        const newDistance = this.getDistanceToNearestNPC(newX, newY);
        return newDistance > currentDistance;
    }

    getDistanceToNearestNPC(x?: number, y?: number) {
        const playerX = x !== undefined ? x : this.player.x;
        const playerY = y !== undefined ? y : this.player.y;
        let nearestDistance = Infinity;

        for (let npc of this.npcs.children.entries) {
            const distance = Phaser.Math.Distance.Between(
                playerX,
                playerY,
                npc.x,
                npc.y
            );
            if (distance < nearestDistance) {
                nearestDistance = distance;
            }
        }
        return nearestDistance;
    }

    canPlayerMoveTo(x: number, y: number) {
        const playerWidth = this.player.width * this.player.scaleX;
        const playerHeight = this.player.height * this.player.scaleY;

        for (let npc of this.npcs.children.entries) {
            const npcWidth = npc.width * npc.scaleX;
            const npcHeight = npc.height * npc.scaleY;

            const playerLeft = x - playerWidth / 2;
            const playerRight = x + playerWidth / 2;
            const playerTop = y - playerHeight / 2;
            const playerBottom = y + playerHeight / 2;

            const npcLeft = npc.x - npcWidth / 2;
            const npcRight = npc.x + npcWidth / 2;
            const npcTop = npc.y - npcHeight / 2;
            const npcBottom = npc.y + npcHeight / 2;

            const padding = 0.5;
            if (
                playerLeft < npcRight + padding &&
                playerRight > npcLeft - padding &&
                playerTop < npcBottom + padding &&
                playerBottom > npcTop - padding
            ) {
                return false;
            }
        }
        return true;
    }

    checkForNearbyNPCs() {
        let nearestNPC = null;
        let nearestDistance = 100;

        this.npcs.children.entries.forEach((npc: any) => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                npc.x,
                npc.y
            );

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestNPC = npc;
            }
        });

        if (nearestNPC && nearestDistance < 80) {
            this.nearbyNPC = nearestNPC;

            // Update interaction prompt position to right side of player
            this.interactionPrompt.setPosition(
                this.player.x + 80, // Right side of player
                this.player.y
            );
            this.interactionPrompt.setVisible(true);
        } else {
            this.nearbyNPC = null;
            this.interactionPrompt.setVisible(false);
        }
    }

    enforceNPCPositions() {
        this.npcs.children.entries.forEach((npc: any) => {
            npc.body.setVelocity(0, 0);
            npc.body.setAngularVelocity(0);
            npc.body.setImmovable(true);

            const originalPosition = npc.getData("originalPosition");
            if (originalPosition) {
                const distance = Phaser.Math.Distance.Between(
                    npc.x,
                    npc.y,
                    originalPosition.x,
                    originalPosition.y
                );
                if (distance > 5) {
                    npc.setPosition(originalPosition.x, originalPosition.y);
                }
            }
        });
    }

    interactWithNearbyNPC() {
        if (this.nearbyNPC) {
            const missionData = this.nearbyNPC.getData("missionData");
            this.interactWithNPC(missionData);
        }
    }

    interactWithNPC(location: any) {
        const gameStateManager = GameStateManager.getInstance();

        // Check if mission is already completed
        if (gameStateManager.isMissionCompleted(location.missionId)) {
            EventBus.emit("show-notification", {
                type: "success",
                title: "Mission Already Completed! ✅",
                message: `${location.npc}: "Excellent work on this mission! You've earned your national excellence badge and contributed to national development. Keep up the outstanding leadership!"`,
                icon: "🏆",
                actions: [
                    {
                        label: "Continue National Service",
                        action: () => {},
                        style: "primary",
                    },
                ],
            });
            return;
        }

        // Check if mission is accessible (skip if debug mode is enabled)
        if (!this.DEBUG_BYPASS_PREREQUISITES && !gameStateManager.canAccessMission(location.missionId)) {
            const availableMissions = gameStateManager.getAvailableMissions();
            const availableList =
                availableMissions.length > 0
                    ? availableMissions.join(", ")
                    : "Complete all Level 1 missions first";

            EventBus.emit("show-notification", {
                type: "info",
                title: "National Mission Prerequisites Required 🏛️",
                message: `${location.npc}: "Welcome to national government! This expert-level mission requires exceptional experience. Available missions: ${availableList}. Master the fundamentals first, then return for national leadership challenges!"`,
                icon: "🏛️",
                actions: [
                    {
                        label: "Check Prerequisites",
                        action: () => {
                            // Emit event to open Quest Log
                            EventBus.emit("open-quest-log");
                        },
                        style: "secondary",
                    },
                ],
            });
            return;
        }

        // Emit event to React to show MissionSystem
        EventBus.emit("show-mission", {
            missionId: location.missionId,
            npcName: location.npc,
            missionName: location.name,
            mission: this.getNationalMissionData(location.missionId),
        });
    }

    getNationalMissionData(missionId: number) {
        const nationalMissions = {
            41: {
                id: "41",
                title: "Radical Equations & Expressions",
                description:
                    "Master radical equations and expressions for national scientific applications.",
                quizOverview:
                    "Solve radical equations, simplify radical expressions, and rationalize denominators. Apply to physics, engineering, and advanced mathematical modeling.",
                realLifeTrivia: [
                    "Physics: Calculate velocities and distances using radical formulas",
                    "Engineering: Design structures using radical stress calculations",
                    "Finance: Model compound growth rates with radical expressions",
                    "Science: Analyze experimental data with radical transformations",
                ],
                npc: "DepEd Undersecretary",
                location: "DepEd Central Office",
                reward: "120 coins + Radical Equations Master Badge",
            },
            42: {
                id: "42",
                title: "Complex Numbers & Operations",
                description:
                    "Master complex numbers and their operations for national engineering applications.",
                quizOverview:
                    "Work with complex numbers in rectangular and polar form. Perform operations, find powers and roots, and apply to electrical engineering and signal processing.",
                realLifeTrivia: [
                    "Electrical Engineering: Analyze AC circuits using complex impedance",
                    "Signal Processing: Transform signals using complex Fourier analysis",
                    "Quantum Physics: Model quantum states with complex wave functions",
                    "Aerospace: Calculate flight dynamics using complex number systems",
                ],
                npc: "DOST Secretary",
                location: "DOST Main Building",
                reward: "125 coins + Complex Numbers Expert Badge",
            },
            43: {
                id: "43",
                title: "Polynomial Theorems & Applications",
                description:
                    "Apply polynomial theorems including Remainder, Factor, and Rational Root theorems.",
                quizOverview:
                    "Master the Remainder Theorem, Factor Theorem, Rational Root Theorem, and Fundamental Theorem of Algebra. Apply to solve higher-degree polynomial equations.",
                realLifeTrivia: [
                    "Cryptography: Use polynomial algorithms for national security encryption",
                    "Computer Science: Optimize algorithms using polynomial complexity analysis",
                    "Economics: Model national GDP growth with polynomial regression",
                    "Physics: Describe motion trajectories using polynomial equations",
                ],
                npc: "CHED Commissioner",
                location: "CHED Central Office",
                reward: "130 coins + Polynomial Theorems Badge",
            },
            44: {
                id: "44",
                title: "Advanced Matrix Operations",
                description:
                    "Master advanced matrix operations including determinants, inverses, and eigenvalues.",
                quizOverview:
                    "Perform matrix multiplication, find determinants and inverses, solve systems using Cramer's rule, and understand eigenvalues and eigenvectors.",
                realLifeTrivia: [
                    "Computer Graphics: Transform 3D models using matrix operations",
                    "Machine Learning: Process data with matrix transformations",
                    "Economics: Model input-output relationships in national economy",
                    "Physics: Describe quantum states using matrix mechanics",
                ],
                npc: "NEDA Director General",
                location: "NEDA Building",
                reward: "135 coins + Matrix Operations Master Badge",
            },
            45: {
                id: "45",
                title: "Conic Sections & Applications",
                description:
                    "Master conic sections including parabolas, ellipses, and hyperbolas.",
                quizOverview:
                    "Analyze and graph conic sections, write equations in standard form, and apply to real-world scenarios in astronomy, architecture, and engineering.",
                realLifeTrivia: [
                    "Astronomy: Model planetary orbits using elliptical equations",
                    "Architecture: Design parabolic arches and domes for national monuments",
                    "Satellite Technology: Calculate hyperbolic trajectories for space missions",
                    "Optics: Design reflective surfaces using parabolic mirrors",
                ],
                npc: "National Scientist",
                location: "National Academy of Science",
                reward: "140 coins + Conic Sections Expert Badge",
            },
            46: {
                id: "46",
                title: "Parametric Equations & Curves",
                description:
                    "Master parametric equations to model motion and curves in national applications.",
                quizOverview:
                    "Work with parametric equations, eliminate parameters, and graph parametric curves. Apply to projectile motion, planetary orbits, and engineering design.",
                realLifeTrivia: [
                    "Aerospace: Model rocket trajectories using parametric equations",
                    "Animation: Create smooth motion paths for computer graphics",
                    "Robotics: Program robotic arm movements with parametric curves",
                    "Physics: Describe particle motion in electromagnetic fields",
                ],
                npc: "PAGASA Administrator",
                location: "PAGASA Science Garden",
                reward: "145 coins + Parametric Equations Badge",
            },
            47: {
                id: "47",
                title: "Advanced Sequences & Limits",
                description:
                    "Master advanced sequences, series, and limits for calculus preparation.",
                quizOverview:
                    "Work with arithmetic and geometric sequences, infinite series, convergence tests, and limits. Apply to financial modeling and scientific analysis.",
                realLifeTrivia: [
                    "Finance: Calculate present value of annuities using infinite series",
                    "Computer Science: Analyze algorithm efficiency with sequence limits",
                    "Physics: Model damped oscillations using convergent sequences",
                    "Economics: Predict long-term market trends with sequence analysis",
                ],
                npc: "PSA Administrator",
                location: "PSA Complex",
                reward: "150 coins + Sequences & Limits Master Badge",
            },
            48: {
                id: "48",
                title: "Binomial Theorem & Expansions",
                description:
                    "Master the Binomial Theorem and polynomial expansions for advanced applications.",
                quizOverview:
                    "Apply the Binomial Theorem to expand powers of binomials, calculate binomial coefficients, and use Pascal's Triangle. Apply to probability and combinatorics.",
                realLifeTrivia: [
                    "Probability: Calculate outcomes in national lottery systems",
                    "Statistics: Model binomial distributions for survey analysis",
                    "Computer Science: Optimize combinatorial algorithms",
                    "Genetics: Predict inheritance patterns using binomial probabilities",
                ],
                npc: "Senate Education Committee Chair",
                location: "Philippine Senate",
                reward: "155 coins + Binomial Theorem Expert Badge",
            },
            49: {
                id: "49",
                title: "Partial Fractions & Decomposition",
                description:
                    "Master partial fraction decomposition for integration and advanced algebra.",
                quizOverview:
                    "Decompose rational expressions into partial fractions, handle repeated and irreducible factors, and apply to calculus integration problems.",
                realLifeTrivia: [
                    "Engineering: Solve differential equations in control systems",
                    "Signal Processing: Analyze transfer functions in electrical circuits",
                    "Physics: Model damped harmonic motion with rational functions",
                    "Economics: Decompose complex economic models for analysis",
                ],
                npc: "DBM Secretary",
                location: "DBM Building",
                reward: "160 coins + Partial Fractions Master Badge",
            },
            50: {
                id: "50",
                title: "Mathematical Proofs & Logic",
                description:
                    "Master mathematical proofs and logical reasoning for advanced mathematics.",
                quizOverview:
                    "Learn proof techniques including direct proof, proof by contradiction, and mathematical induction. Apply logical reasoning to verify mathematical statements and theorems.",
                realLifeTrivia: [
                    "Computer Science: Verify algorithm correctness using formal proofs",
                    "Cryptography: Prove security of encryption systems mathematically",
                    "Mathematics: Establish foundations for advanced mathematical theories",
                    "Law: Apply logical reasoning in legal arguments and policy analysis",
                ],
                npc: "DepEd Secretary",
                location: "DepEd Main Office",
                reward: "165 coins + Mathematical Proofs Master Badge",
            },
        };

        return (
            nationalMissions[missionId as keyof typeof nationalMissions] || {
                id: missionId.toString(),
                title: "Advanced National Mission",
                description:
                    "A challenging mission to help improve national operations.",
                quizOverview:
                    "Complete this expert-level quiz to test your advanced algebra skills and help the nation.",
                realLifeTrivia: [
                    "Advanced math helps solve complex real-world problems",
                    "Nations rely on mathematical analysis for planning and decision-making",
                    "Strong algebra skills open doors to STEM careers",
                ],
                npc: "Philippine Government Official",
                location: "Government Center",
                reward: "40 coins",
            }
        );
    }

    createCollectibles() {
        console.log("=== CREATING NATIONAL COLLECTIBLE ITEMS ===");
        console.log(`Background ready: ${!!this.backgroundImage}`);
        console.log(`Player exists: ${!!this.player}`);
        console.log(
            `Total items to create: ${this.collectibleItemsData.length}`
        );

        this.collectibles = this.physics.add.group();
        const gameStateManager = GameStateManager.getInstance();

        this.collectibleItemsData.forEach((item) => {
            if (gameStateManager.isItemCollected(item.id)) {
                console.log(`Item ${item.id} already collected, skipping`);
                return;
            }

            const coords = this.percentageToWorldCoordinates(
                item.percentX,
                item.percentY
            );

            const collectible = this.add
                .text(coords.x, coords.y, item.icon, {
                    fontSize: "30px",
                    fontFamily: "Arial",
                })
                .setOrigin(0.5)
                .setScrollFactor(1);

            this.physics.add.existing(collectible);
            (collectible.body as Phaser.Physics.Arcade.Body).setSize(48, 48);
            (collectible.body as Phaser.Physics.Arcade.Body).setAllowGravity(
                false
            );

            collectible.setDepth(200);
            collectible.setVisible(true);
            collectible.setData("itemData", item);

            this.collectibles.add(collectible);
            this.collectibleItems.set(item.id, collectible);

            this.tweens.add({
                targets: collectible,
                y: coords.y - 15,
                duration: 1200,
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
            });

            const glowColor =
                item.rarity === "legendary"
                    ? 0xffd700
                    : item.rarity === "rare"
                    ? 0xff00ff
                    : item.rarity === "uncommon"
                    ? 0x00ffff
                    : 0xffffff;

            const glow = this.add.circle(
                coords.x,
                coords.y,
                30,
                glowColor,
                0.4
            );
            glow.setDepth(199);
            glow.setScrollFactor(1);

            this.tweens.add({
                targets: glow,
                alpha: { from: 0.3, to: 0.6 },
                scaleX: { from: 1, to: 1.3 },
                scaleY: { from: 1, to: 1.3 },
                duration: 1200,
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
            });

            console.log(
                `✓ Created national collectible ${item.id} at (${item.percentX}%, ${item.percentY}%)`
            );
        });

        if (this.collectibles && this.player) {
            this.physics.add.overlap(
                this.player,
                this.collectibles,
                this.collectItem,
                undefined,
                this
            );
        }

        console.log(`=== CITY COLLECTIBLES CREATION COMPLETE ===`);
        console.log(`Items created: ${this.collectibleItems.size}`);
    }

    collectItem(player: any, collectible: any) {
        const itemData = collectible.getData("itemData");
        if (!itemData) return;

        const gameStateManager = GameStateManager.getInstance();
        const collected = gameStateManager.collectItem(
            itemData.id,
            itemData.value,
            itemData.points
        );

        if (collected) {
            this.createCollectionParticles(
                collectible.x,
                collectible.y,
                itemData.rarity
            );
            this.playCollectionSound(itemData.rarity);

            this.tweens.add({
                targets: collectible,
                y: collectible.y - 80,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 600,
                ease: "Back.easeOut",
                onComplete: () => {
                    collectible.destroy();
                    this.collectibleItems.delete(itemData.id);
                },
            });

            this.showFloatingText(
                collectible.x,
                collectible.y,
                `+${itemData.value} 💰 +${itemData.points} ⭐`
            );

            this.checkCollectionAchievement();

            EventBus.emit("show-notification", {
                type: "success",
                title: `${itemData.name} Collected! ✨`,
                message: `You found a ${itemData.name}! +${itemData.value} coins, +${itemData.points} points`,
                icon: itemData.icon,
                actions: [
                    {
                        label: "Continue Exploring",
                        action: () => {},
                        style: "primary",
                    },
                ],
            });
        }
    }

    createCollectionParticles(x: number, y: number, rarity: string) {
        const particleColor =
            rarity === "legendary"
                ? 0xffd700
                : rarity === "rare"
                ? 0xff00ff
                : rarity === "uncommon"
                ? 0x00ffff
                : 0xffff00;

        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const distance = 30 + Math.random() * 20;
            const targetX = x + Math.cos(angle) * distance;
            const targetY = y + Math.sin(angle) * distance;

            const particle = this.add.circle(x, y, 3, particleColor, 1);
            particle.setDepth(300);

            this.tweens.add({
                targets: particle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scale: 0,
                duration: 500 + Math.random() * 300,
                ease: "Power2",
                onComplete: () => particle.destroy(),
            });
        }

        for (let i = 0; i < 5; i++) {
            const star = this.add.text(x, y, "⭐", { fontSize: "24px" });
            star.setOrigin(0.5);
            star.setDepth(300);

            const angle = (Math.PI * 2 * i) / 5;
            const targetX = x + Math.cos(angle) * 40;
            const targetY = y + Math.sin(angle) * 40;

            this.tweens.add({
                targets: star,
                x: targetX,
                y: targetY,
                alpha: 0,
                rotation: Math.PI * 2,
                scale: { from: 1, to: 0.5 },
                duration: 600,
                ease: "Power2",
                onComplete: () => star.destroy(),
            });
        }
    }

    playCollectionSound(rarity: string) {
        const soundFrequency =
            rarity === "legendary"
                ? [440, 554, 659, 880]
                : rarity === "rare"
                ? [392, 494, 587]
                : rarity === "uncommon"
                ? [349, 440, 523]
                : [330, 392, 440];

        if (
            typeof AudioContext !== "undefined" ||
            typeof (window as any).webkitAudioContext !== "undefined"
        ) {
            try {
                const AudioContextClass =
                    AudioContext || (window as any).webkitAudioContext;
                const audioContext = new AudioContextClass();

                soundFrequency.forEach((freq, index) => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.frequency.value = freq;
                    oscillator.type = "sine";

                    const startTime = audioContext.currentTime + index * 0.1;
                    const duration = 0.15;

                    gainNode.gain.setValueAtTime(0.3, startTime);
                    gainNode.gain.exponentialRampToValueAtTime(
                        0.01,
                        startTime + duration
                    );

                    oscillator.start(startTime);
                    oscillator.stop(startTime + duration);
                });
            } catch (error) {
                console.log("Audio playback not available:", error);
            }
        }
    }

    showFloatingText(x: number, y: number, text: string) {
        const floatingText = this.add.text(x, y, text, {
            fontFamily: "Arial Black",
            fontSize: "24px",
            color: "#FFD700",
            stroke: "#000000",
            strokeThickness: 4,
        });
        floatingText.setOrigin(0.5);
        floatingText.setDepth(300);

        this.tweens.add({
            targets: floatingText,
            y: y - 60,
            alpha: 0,
            duration: 1000,
            ease: "Power2",
            onComplete: () => floatingText.destroy(),
        });
    }

    checkCollectionAchievement() {
        const gameStateManager = GameStateManager.getInstance();
        const totalItems = this.collectibleItemsData.length;

        const allCityItemsCollected = this.collectibleItemsData.every((item) =>
            gameStateManager.isItemCollected(item.id)
        );

        if (allCityItemsCollected) {
            EventBus.emit("show-notification", {
                type: "success",
                title: "🏆 City Master Collector! 🏆",
                message: `Incredible! You've collected all ${totalItems} items in the City! You've earned the "Municipal Treasure Hunter" badge and a bonus of 100 coins + 200 points!`,
                icon: "🎖️",
                actions: [
                    {
                        label: "Amazing!",
                        action: () => {},
                        style: "primary",
                    },
                ],
            });

            gameStateManager.addCoins(100, "City Master Collector Achievement");
            const progress = gameStateManager.getProgress();
            if (progress) {
                progress.totalScore += 200;
                gameStateManager.updatePlaytime(0);
            }

            console.log("🏆 City Master Collector Achievement unlocked!");
        }
    }

    createMinimap() {
        const minimapSize = this.isMobile ? 100 : 150;
        const minimapX = this.isMobile ? 70 : 90;
        const minimapY = this.cameras.main.height - (this.isMobile ? 120 : 170);

        this.minimap = this.add.container(minimapX, minimapY);
        this.minimap.setScrollFactor(0);
        this.minimap.setDepth(1500);

        const minimapBg = this.add.graphics();
        minimapBg.fillStyle(0x000000, 0.6);
        minimapBg.fillRoundedRect(0, 0, minimapSize, minimapSize, 8);
        minimapBg.lineStyle(2, 0xFFD700, 1); // National gold border
        minimapBg.strokeRoundedRect(0, 0, minimapSize, minimapSize, 8);
        this.minimap.add(minimapBg);

        const minimapTitle = this.add.text(minimapSize / 2, -15, "CITY MAP", {
            fontFamily: "Arial Black",
            fontSize: "11px",
            color: "#87CEEB",
            stroke: "#000000",
            strokeThickness: 2,
        });
        minimapTitle.setOrigin(0.5);
        this.minimap.add(minimapTitle);

        this.minimapPlayerDot = this.add.circle(
            minimapSize / 2,
            minimapSize / 2,
            4,
            0x00ff00,
            1
        );
        this.minimap.add(this.minimapPlayerDot);

        this.missionLocations.forEach((location) => {
            const npcX = (location.percentX / 100) * minimapSize;
            const npcY = (location.percentY / 100) * minimapSize;

            const npcDot = this.add.circle(npcX, npcY, 2, 0x4169e1, 0.8);
            this.minimap.add(npcDot);
            this.minimapNPCDots.push(npcDot);
        });

        this.collectibleItemsData.forEach((item) => {
            const itemX = (item.percentX / 100) * minimapSize;
            const itemY = (item.percentY / 100) * minimapSize;

            const dotColor =
                item.rarity === "legendary"
                    ? 0xffd700
                    : item.rarity === "rare"
                    ? 0xff00ff
                    : item.rarity === "uncommon"
                    ? 0x00ffff
                    : 0xffff00;

            const collectibleDot = this.add.circle(
                itemX,
                itemY,
                2,
                dotColor,
                1
            );
            collectibleDot.setData("itemId", item.id);
            this.minimap.add(collectibleDot);
            this.minimapCollectibleDots.push(collectibleDot);

            this.tweens.add({
                targets: collectibleDot,
                alpha: { from: 0.5, to: 1 },
                scale: { from: 0.8, to: 1.2 },
                duration: 800,
                ease: "Sine.easeInOut",
                yoyo: true,
                repeat: -1,
            });
        });

        console.log("National minimap created with collectible locations");
    }

    updateMinimap() {
        if (
            !this.minimap ||
            !this.minimapPlayerDot ||
            !this.player ||
            !this.backgroundImage
        )
            return;

        const minimapSize = this.isMobile ? 100 : 150;
        const bgWidth = this.backgroundImage.displayWidth;
        const bgHeight = this.backgroundImage.displayHeight;
        const bgX = this.backgroundImage.x;
        const bgY = this.backgroundImage.y;

        const playerRelativeX = this.player.x - (bgX - bgWidth / 2);
        const playerRelativeY = this.player.y - (bgY - bgHeight / 2);

        const percentX = Math.max(
            0,
            Math.min(100, (playerRelativeX / bgWidth) * 100)
        );
        const percentY = Math.max(
            0,
            Math.min(100, (playerRelativeY / bgHeight) * 100)
        );

        this.minimapPlayerDot.setPosition(
            (percentX / 100) * minimapSize,
            (percentY / 100) * minimapSize
        );

        const gameStateManager = GameStateManager.getInstance();
        this.minimapCollectibleDots.forEach((dot) => {
            const itemId = dot.getData("itemId");
            if (itemId && gameStateManager.isItemCollected(itemId)) {
                dot.setVisible(false);
            }
        });
    }
}
