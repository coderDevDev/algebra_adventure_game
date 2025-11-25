import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, "background");

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets");

        // Add error handling for image loading
        this.load.on("filecomplete", (key: string) => {
            console.log(`Asset loaded: ${key}`);
        });

        this.load.on("loaderror", (file: any) => {
            console.error(`Failed to load asset: ${file.key} - ${file.url}`);
        });

        this.load.image("logo", "logo.png");
        this.load.image("star", "star.png");

        // CIVIKA game assets
        this.load.image("background", "bg.png");

        // Load barangay background image (optional) - try different paths
        console.log(
            "Attempting to load barangay-bg from: barangay-background.png"
        );
        this.load.image("barangay-bg", "barangay-background.png");

        // Also try loading it with a different key as backup
        console.log(
            "Attempting to load barangay-bg-backup from: assets/barangay-background.png"
        );
        this.load.image("barangay-bg-backup", "assets/barangay-background.png");

        // Try alternative paths
        console.log(
            "Attempting to load barangay-bg-alt from: /assets/barangay-background.png"
        );
        this.load.image("barangay-bg-alt", "/assets/barangay-background.png");

        // Try the same path as bg.png which works
        console.log(
            "Attempting to load barangay-bg-root from: barangay-background.png"
        );
        this.load.image("barangay-bg-root", "barangay-background.png");

        // Load city background for Level 2
        console.log(
            "Attempting to load city-bg-root from: city-background.png"
        );
        this.load.image("city-bg-root", "city-background.png");

        // Load province background for Level 3
        console.log(
            "Attempting to load province-bg-root from: province-background.png"
        );
        this.load.image("province-bg-root", "province-background.png");

        // Load region background for Level 4
        console.log(
            "Attempting to load region-bg-root from: region-background.png"
        );
        this.load.image("region-bg-root", "region-background.png");

        // Load national background for Level 5
        console.log(
            "Attempting to load national-bg-root from: national-background.png"
        );
        this.load.image("national-bg-root", "national-background.png");

        // Load student sprite assets
        this.loadStudentSprites();
    }

    loadStudentSprites() {
        // Load student sprites for different directions
        this.load.setPath("assets/student-sprites");
        console.log("Loading student sprites from: assets/student-sprites");

        // Front sprites
        this.load.image(
            "student-front-1",
            "front/front-1-removebg-preview.png"
        );
        this.load.image(
            "student-front-2",
            "front/front-2-removebg-preview.png"
        );
        this.load.image(
            "student-front-3",
            "front/front-3-removebg-preview.png"
        );
        this.load.image(
            "student-front-4",
            "front/front-4-removebg-preview.png"
        );

        // Back sprites
        this.load.image("student-back-1", "back/back1-removebg-preview.png");
        this.load.image("student-back-2", "back/back2-removebg-preview.png");
        this.load.image("student-back-3", "back/back3-removebg-preview.png");
        this.load.image("student-back-4", "back/back4-removebg-preview.png");

        // Left sprites
        this.load.image("student-left-1", "left/left1-removebg-preview.png");
        this.load.image("student-left-2", "left/left2-removebg-preview.png");
        this.load.image("student-left-3", "left/left3-removebg-preview.png");
        this.load.image("student-left-4", "left/left4-removebg-preview.png");

        // Right sprites
        this.load.image("student-right-1", "right/1.png");
        this.load.image("student-right-2", "right/2.png");
        this.load.image("student-right-3", "right/3.png");
        this.load.image("student-right-4", "right/4.png");

        // Load NPC images from LEVEL1 folder
        this.loadNPCImages();

        // Load Level 2 city officials from LEVEL2 folder
        this.loadLevel2NPCImages();

        // Load Level 3 province officials from LEVEL3 folder
        this.loadLevel3NPCImages();

        // Load Level 4 region officials from LEVEL4 folder
        this.loadLevel4NPCImages();

        // Load Level 5 national officials from LEVEL5 folder
        this.loadLevel5NPCImages();

        // Create placeholder sprites for NPCs (keep simple for now)
        this.createPlaceholderSprites();
    }

    loadNPCImages() {
        console.log("Loading NPC images from LEVEL1 folder...");

        // Load all NPC images from LEVEL1 folder with correct path
        this.load.image(
            "barangay-captain",
            "assets/LEVEL1/barangay-captain.png"
        );
        this.load.image(
            "barangay-health-worker",
            "assets/LEVEL1/barangay-health-worker.png"
        );
        this.load.image(
            "barangay-secretary",
            "assets/LEVEL1/barangay-secretary.png"
        );
        this.load.image("barangay-tanod", "assets/LEVEL1/barangay-tanod.png");
        this.load.image(
            "comelec-volunteer",
            "assets/LEVEL1/comelec-volunteer.png"
        );
        this.load.image(
            "construction-foreman",
            "assets/LEVEL1/construction-foreman.png"
        );
        this.load.image(
            "elderly-resident",
            "assets/LEVEL1/elderly-resident.png"
        );
        this.load.image(
            "high-school-student",
            "assets/LEVEL1/high-school-student.png"
        );
        this.load.image("librarian", "assets/LEVEL1/librarian.png");
        this.load.image(
            "mediation-officer",
            "assets/LEVEL1/mediation-officer.png"
        );

        // Add debugging for image loading
        this.load.on("filecomplete", (key: string) => {
            if (
                key.includes("barangay") ||
                key.includes("comelec") ||
                key.includes("construction") ||
                key.includes("elderly") ||
                key.includes("high-school") ||
                key.includes("librarian") ||
                key.includes("mediation")
            ) {
                console.log(`NPC image loaded: ${key}`);
            }
        });

        this.load.on("loaderror", (file: any) => {
            console.error(
                `Failed to load NPC image: ${file.key} from ${file.url}`
            );
        });

        console.log("NPC images loading started...");
    }

    loadLevel2NPCImages() {
        console.log("Loading Level 2 city NPC images from LEVEL2 folder...");

        // Load all Level 2 NPC images from LEVEL2 folder with correct path
        this.load.image(
            "entrepreneur-carlos",
            "assets/LEVEL2/entrepreneur-carlos.png"
        );
        this.load.image("accountant-lisa", "assets/LEVEL2/accountant-lisa.png");
        this.load.image(
            "logistics-manager-ben",
            "assets/LEVEL2/logistics-manager-ben.png"
        );
        this.load.image(
            "sales-director-kim",
            "assets/LEVEL2/sales-director-kim.png"
        );
        this.load.image(
            "urban-planner-gina",
            "assets/LEVEL2/urban-planner-gina.png"
        );
        this.load.image(
            "transit-manager-roy",
            "assets/LEVEL2/transit-manager-roy.png"
        );
        this.load.image("architect-maya", "assets/LEVEL2/architect-maya.png");
        this.load.image(
            "city-planner-tom",
            "assets/LEVEL2/city-planner-tom.png"
        );
        this.load.image("engineer-sarah", "assets/LEVEL2/engineer-sarah.png");
        this.load.image(
            "transport-chief-mike",
            "assets/LEVEL2/transport-chief-mike.png"
        );

        // Add debugging for Level 2 image loading
        this.load.on("filecomplete", (key: string) => {
            if (
                key.includes("entrepreneur") ||
                key.includes("accountant") ||
                key.includes("logistics") ||
                key.includes("sales-director") ||
                key.includes("urban-planner") ||
                key.includes("transit-manager") ||
                key.includes("architect") ||
                key.includes("city-planner") ||
                key.includes("engineer") ||
                key.includes("transport-chief")
            ) {
                console.log(`Level 2 NPC image loaded: ${key}`);
            }
        });

        console.log("Level 2 NPC images loading started...");
    }

 loadLevel3NPCImages() {
    console.log("Loading Level 3 province NPC images from LEVEL3 folder...");

    // Define the NPC images
    const npcImages = [
        "provincial-budget-director",
        "provincial-economist",
        "provincial-engineer",
        "financial-analyst",
        "policy-coordinator",
        "operations-director",
        "land-use-planner",
        "resource-manager",
        "investment-analyst",
        "strategic-planner"
    ];

    // Check which images are already loaded
    const missingImages = npcImages.filter(img => !this.textures.exists(img));

    if (missingImages.length > 0) {
        console.log("Loading missing NPC images:", missingImages);
        
        // Add load complete handler
        this.load.once('complete', () => {
            console.log('All Level 3 NPC images loaded successfully');
            // Verify which textures were loaded
            npcImages.forEach(key => {
                console.log(`${key} texture exists:`, this.textures.exists(key));
            });
        });

        // Add file load error handler
        this.load.on('loaderror', (file: Phaser.Loader.File) => {
            console.error('Error loading file:', file.key, file.src);
        });

        // Load missing images
        missingImages.forEach(key => {
            console.log(`Loading image: ${key}`);
            this.load.image(key, `assets/LEVEL3/${key}.png`);
        });

        // Start the loader
        this.load.start();
    } else {
        console.log('All Level 3 NPC images are already loaded');
    }
}

  loadLevel4NPCImages() {
    console.log("Loading Level 4 region NPC images from LEVEL4 folder...");

    // Load all Level 4 NPC images - Regional directors
    this.load.image(
        "regional-math-director",
        "assets/LEVEL4/regional-development-council-director.png"
    );
    this.load.image(
        "regional-analyst",
        "assets/LEVEL4/neda-regional-director.png"
    );
    this.load.image(
        "regional-coordinator",
        "assets/LEVEL4/deped-regional-director.png"
    );
    this.load.image(
        "regional-strategist",
        "assets/LEVEL4/dost-regional-director.png"
    );
    this.load.image(
        "regional-planner",
        "assets/LEVEL4/dti-regional-director.png"
    );
    this.load.image(
        "regional-economist",
        "assets/LEVEL4/da-regional-director.png"
    );
    this.load.image(
        "regional-researcher",
        "assets/LEVEL4/doh-regional-director.png"
    );
    this.load.image(
        "regional-systems-expert",
        "assets/LEVEL4/dpwh-regional-director.png"
    );
    this.load.image(
        "regional-data-scientist",
        "assets/LEVEL4/dswd-regional-director.png"
    );
    this.load.image(
        "regional-policy-advisor",
        "assets/LEVEL4/dilg-regional-director.png"
    );
}
    loadLevel5NPCImages() {
        console.log("Loading Level 5 national NPC images from LEVEL5 folder...");

        // Load all Level 5 NPC images - National officials
        this.load.image(
            "deped-undersecretary",
            "assets/LEVEL5/deped-undersecretary.png"
        );
        this.load.image(
            "dost-secretary",
            "assets/LEVEL5/dost-secretary.png"
        );
        this.load.image(
            "ched-commissioner",
            "assets/LEVEL5/ched-commissioner.png"
        );
        this.load.image(
            "neda-director-general",
            "assets/LEVEL5/neda-director-general.png"
        );
        this.load.image(
            "national-scientist",
            "assets/LEVEL5/national-scientist.png"
        );
        this.load.image(
            "pagasa-administrator",
            "assets/LEVEL5/pagasa-administrator.png"
        );
        this.load.image(
            "psa-administrator",
            "assets/LEVEL5/psa-administrator.png"
        );
        this.load.image(
            "senate-education-committee-chair",
            "assets/LEVEL5/senate-education-committee-chair.png"
        );
        this.load.image(
            "dbm-secretary",
            "assets/LEVEL5/dbm-secretary.png"
        );
        this.load.image(
            "deped-secretary",
            "assets/LEVEL5/deped-secretary.png"
        );

        console.log("Level 5 NPC images loading started...");
    }

    createPlaceholderSprites() {
        // Create a simple colored rectangle for NPC sprite
        const npcGraphics = this.add.graphics();
        npcGraphics.fillStyle(0x4169e1);
        npcGraphics.fillRect(0, 0, 24, 24);
        npcGraphics.generateTexture("npc", 24, 24);
        npcGraphics.destroy();

        // Create a simple colored rectangle for player sprite fallback
        const playerGraphics = this.add.graphics();
        playerGraphics.fillStyle(0x00ff00); // Green color
        playerGraphics.fillRect(0, 0, 32, 32);
        playerGraphics.generateTexture("player", 32, 32);
        playerGraphics.destroy();
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        console.log("Preloader create() called - all assets should be loaded");
        console.log(
            "Student front-1 texture exists:",
            this.textures.exists("student-front-1")
        );
        console.log(
            "Player fallback texture exists:",
            this.textures.exists("player")
        );
        console.log(
            "Barangay background texture exists:",
            this.textures.exists("barangay-bg")
        );
        console.log(
            "Barangay background backup texture exists:",
            this.textures.exists("barangay-bg-backup")
        );
        console.log(
            "City background texture exists:",
            this.textures.exists("city-bg-root")
        );

        // Check Level 2 city official textures
        console.log("=== LEVEL 2 CITY OFFICIALS ===");
        console.log("City Councilor:", this.textures.exists("city-councilor"));
        console.log("City Treasurer:", this.textures.exists("city-treasurer"));
        console.log("City Engineer:", this.textures.exists("city-engineer"));
        console.log(
            "Business Permit Officer:",
            this.textures.exists("business-permit-officer")
        );
        console.log("City Planner:", this.textures.exists("city-planner"));
        console.log(
            "Environmental Officer:",
            this.textures.exists("environmental-officer")
        );
        console.log(
            "Public Safety Officer:",
            this.textures.exists("public-safety-officer")
        );
        console.log(
            "Tourism Officer:",
            this.textures.exists("tourism-officer")
        );
        console.log("Health Officer:", this.textures.exists("health-officer"));
        console.log("City Mayor:", this.textures.exists("city-mayor"));
        console.log("===============================");

        // List all available textures for debugging
        console.log("All available textures:", Object.keys(this.textures.list));

        //  Don't start MainMenu automatically - React will handle the UI
        //  Just emit ready event so React knows assets are loaded
        this.events.emit("preloader-complete");
    }
}

