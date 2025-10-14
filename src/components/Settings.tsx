import React, { useState, useEffect } from "react";

interface SettingsProps {
    onClose: () => void;
    isVisible: boolean;
}

interface GameSettings {
    masterVolume: number;
    musicVolume: number;
    effectsVolume: number;
    enableMusic: boolean;
    enableEffects: boolean;
    fullscreen: boolean;
    language: string;
    difficulty: string;
    showTutorials: boolean;
}

const defaultSettings: GameSettings = {
    masterVolume: 0.7,
    musicVolume: 0.8,
    effectsVolume: 0.9,
    enableMusic: true,
    enableEffects: true,
    fullscreen: false,
    language: "en",
    difficulty: "normal",
    showTutorials: true,
};

export const Settings: React.FC<SettingsProps> = ({ onClose, isVisible }) => {
    const [settings, setSettings] = useState<GameSettings>(defaultSettings);
    const [activeTab, setActiveTab] = useState<
        "audio" | "graphics" | "gameplay"
    >("audio");

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem("civika-settings");
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings({ ...defaultSettings, ...parsed });
            } catch (error) {
                console.error("Failed to load settings:", error);
            }
        }

        // Listen for fullscreen changes to keep settings in sync
        const handleFullscreenChange = () => {
            const isFullscreen = !!document.fullscreenElement;
            setSettings((prev) => ({ ...prev, fullscreen: isFullscreen }));
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener(
            "webkitfullscreenchange",
            handleFullscreenChange
        );
        document.addEventListener(
            "mozfullscreenchange",
            handleFullscreenChange
        );
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
            document.removeEventListener(
                "webkitfullscreenchange",
                handleFullscreenChange
            );
            document.removeEventListener(
                "mozfullscreenchange",
                handleFullscreenChange
            );
            document.removeEventListener(
                "MSFullscreenChange",
                handleFullscreenChange
            );
        };
    }, []);

    // Save settings to localStorage whenever settings change
    useEffect(() => {
        localStorage.setItem("civika-settings", JSON.stringify(settings));

        // Apply settings immediately
        applySettings(settings);
    }, [settings]);

    const applySettings = (newSettings: GameSettings) => {
        // Apply audio settings
        if (window.gameAudioManager) {
            window.gameAudioManager.setMasterVolume(newSettings.masterVolume);
            window.gameAudioManager.setMusicVolume(newSettings.musicVolume);
            window.gameAudioManager.setEffectsVolume(newSettings.effectsVolume);
            window.gameAudioManager.setMusicEnabled(newSettings.enableMusic);
            window.gameAudioManager.setEffectsEnabled(
                newSettings.enableEffects
            );
        }

        // Apply graphics settings with proper fullscreen checks
        if (newSettings.fullscreen && !document.fullscreenElement) {
            // Enter fullscreen only if not already in fullscreen
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch((error) => {
                    console.warn("Failed to enter fullscreen:", error);
                });
            }
        } else if (!newSettings.fullscreen && document.fullscreenElement) {
            // Exit fullscreen only if currently in fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen().catch((error) => {
                    console.warn("Failed to exit fullscreen:", error);
                });
            }
        }

        // Emit settings change event for other components
        window.dispatchEvent(
            new CustomEvent("civika-settings-changed", {
                detail: newSettings,
            })
        );
    };

    const updateSetting = <K extends keyof GameSettings>(
        key: K,
        value: GameSettings[K]
    ) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const resetToDefaults = () => {
        if (window.confirm("Reset all settings to default values?")) {
            setSettings(defaultSettings);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-50 p-4">
            <div className="bg-white rounded-3xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 relative">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-soft transition-all duration-200 hover:scale-110 z-20"
                    >
                        ✕
                    </button>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            ⚙️ Settings
                        </h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-center mb-6 space-x-2">
                        {[
                            { id: "audio", label: "🔊 Audio", icon: "🎵" },
                            {
                                id: "graphics",
                                label: "🖥️ Graphics",
                                icon: "🎨",
                            },
                            {
                                id: "gameplay",
                                label: "🎮 Gameplay",
                                icon: "⚙️",
                            },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? "bg-gray-800 text-white shadow-soft"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                <span className="hidden sm:inline">
                                    {tab.label.split(" ")[1]}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Settings Content */}
                    <div className="space-y-4">
                        {/* Audio Settings */}
                        {activeTab === "audio" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
                                    🎵 Audio Settings
                                </h3>

                                {/* Master Volume */}
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-700 font-medium">
                                        Master Volume:
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={settings.masterVolume}
                                            onChange={(e) =>
                                                updateSetting(
                                                    "masterVolume",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            className="w-32"
                                        />
                                        <span className="w-12 text-gray-700 font-bold">
                                            {Math.round(
                                                settings.masterVolume * 100
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Music Volume */}
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-700 font-semibold">
                                        Music Volume:
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={settings.musicVolume}
                                            onChange={(e) =>
                                                updateSetting(
                                                    "musicVolume",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            className="w-32"
                                            disabled={!settings.enableMusic}
                                        />
                                        <span className="w-12 text-gray-700 font-bold">
                                            {Math.round(
                                                settings.musicVolume * 100
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Effects Volume */}
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-700 font-semibold">
                                        Sound Effects:
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={settings.effectsVolume}
                                            onChange={(e) =>
                                                updateSetting(
                                                    "effectsVolume",
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            className="w-32"
                                            disabled={!settings.enableEffects}
                                        />
                                        <span className="w-12 text-gray-700 font-bold">
                                            {Math.round(
                                                settings.effectsVolume * 100
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Enable Music */}
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-700 font-semibold">
                                        Enable Music:
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.enableMusic}
                                            onChange={(e) =>
                                                updateSetting(
                                                    "enableMusic",
                                                    e.target.checked
                                                )
                                            }
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                        />
                                        <span className="text-gray-700">
                                            {settings.enableMusic
                                                ? "On"
                                                : "Off"}
                                        </span>
                                    </label>
                                </div>

                                {/* Enable Effects */}
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-700 font-semibold">
                                        Enable Sound Effects:
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.enableEffects}
                                            onChange={(e) =>
                                                updateSetting(
                                                    "enableEffects",
                                                    e.target.checked
                                                )
                                            }
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                        />
                                        <span className="text-gray-700">
                                            {settings.enableEffects
                                                ? "On"
                                                : "Off"}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Graphics Settings */}
                        {activeTab === "graphics" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
                                    🎨 Graphics Settings
                                </h3>

                                {/* Fullscreen */}
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-700 font-semibold">
                                        Fullscreen Mode:
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.fullscreen}
                                            onChange={(e) =>
                                                updateSetting(
                                                    "fullscreen",
                                                    e.target.checked
                                                )
                                            }
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                        />
                                        <span className="text-gray-700">
                                            {settings.fullscreen ? "On" : "Off"}
                                        </span>
                                    </label>
                                </div>

                                <div className="text-blue-700 text-sm bg-blue-50 p-3 rounded-xl border border-blue-200">
                                    💡 <strong>Tip:</strong> Graphics settings
                                    are optimized for best performance across
                                    all devices.
                                </div>
                            </div>
                        )}

                        {/* Gameplay Settings */}
                        {activeTab === "gameplay" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
                                    ⚙️ Gameplay Settings
                                </h3>

                                {/* Language */}
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-700 font-semibold">
                                        Language:
                                    </label>
                                    <select
                                        value={settings.language}
                                        onChange={(e) =>
                                            updateSetting(
                                                "language",
                                                e.target.value
                                            )
                                        }
                                        className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700"
                                    >
                                        <option value="en">🇺🇸 English</option>
                                        <option value="fil">🇵🇭 Filipino</option>
                                        <option value="ceb">🇵🇭 Cebuano</option>
                                        <option value="ilo">🇵🇭 Ilocano</option>
                                    </select>
                                </div>

                                {/* Difficulty */}
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-700 font-semibold">
                                        Difficulty:
                                    </label>
                                    <select
                                        value={settings.difficulty}
                                        onChange={(e) =>
                                            updateSetting(
                                                "difficulty",
                                                e.target.value
                                            )
                                        }
                                        className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700"
                                    >
                                        <option value="easy">😊 Easy</option>
                                        <option value="normal">
                                            😐 Normal
                                        </option>
                                        <option value="hard">😤 Hard</option>
                                        <option value="expert">
                                            🤯 Expert
                                        </option>
                                    </select>
                                </div>

                                {/* Show Tutorials */}
                                <div className="flex justify-between items-center">
                                    <label className="text-gray-700 font-semibold">
                                        Show Tutorials:
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.showTutorials}
                                            onChange={(e) =>
                                                updateSetting(
                                                    "showTutorials",
                                                    e.target.checked
                                                )
                                            }
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                        />
                                        <span className="text-gray-700">
                                            {settings.showTutorials
                                                ? "On"
                                                : "Off"}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between mt-8 space-x-4">
                        <button
                            onClick={resetToDefaults}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-soft"
                        >
                            🔄 Reset to Defaults
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-soft"
                        >
                            ✅ Apply & Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Global audio manager type declaration
declare global {
    interface Window {
        gameAudioManager?: {
            setMasterVolume: (volume: number) => void;
            setMusicVolume: (volume: number) => void;
            setEffectsVolume: (volume: number) => void;
            setMusicEnabled: (enabled: boolean) => void;
            setEffectsEnabled: (enabled: boolean) => void;
        };
    }
}

