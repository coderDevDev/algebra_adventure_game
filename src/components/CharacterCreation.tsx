import React, { useState } from "react";

interface CharacterCreationProps {
    onCharacterCreated: (name: string, color: string) => void;
}

const colorOptions = [
    { name: "Green", value: "#00ff00", bg: "bg-green-500" },
    { name: "Blue", value: "#0066ff", bg: "bg-blue-500" },
    { name: "Red", value: "#ff0000", bg: "bg-red-500" },
    { name: "Yellow", value: "#ffff00", bg: "bg-yellow-500" },
    { name: "Purple", value: "#9900ff", bg: "bg-purple-500" },
    { name: "Orange", value: "#ff6600", bg: "bg-orange-500" },
];

export const CharacterCreation: React.FC<CharacterCreationProps> = ({
    onCharacterCreated,
}) => {
    const [playerName, setPlayerName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#00ff00");

    // Function to convert hex color to hue rotation for CSS filter
    const getHueRotation = (hexColor: string) => {
        const colorMap: { [key: string]: number } = {
            "#00ff00": 0, // Green - no rotation
            "#0066ff": 240, // Blue
            "#ff0000": 0, // Red - no rotation
            "#ffff00": 60, // Yellow
            "#9900ff": 270, // Purple
            "#ff6600": 30, // Orange
        };
        return colorMap[hexColor] || 0;
    };

    const handleSubmit = () => {
        if (playerName.trim()) {
            onCharacterCreated(playerName.trim(), selectedColor);
        }
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 flex items-center justify-center z-50 overflow-y-auto p-4">
            {/* Main content */}
            <div className="w-full max-w-md mx-auto">
                {/* Character Creation Container - Clean Design */}
                <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
                        {/* Title - Simple */}
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">
                                Create Your Character
                            </h1>
                        </div>
                        {/* <p className="text-lg sm:text-xl text-amber-700 mb-6 sm:mb-8 text-center font-medium game-element-border rounded-md py-2 px-4">
                            🏰 Customize your civic hero 🏰
                        </p> */}

                        {/* Character Preview */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="rounded-xl p-2 border-2 border-gray-200 bg-gray-50 shadow-soft">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden">
                                        <img
                                            src="/assets/student-sprites/front/front-1-removebg-preview.png"
                                            alt="Character Preview"
                                            className="w-full h-full object-cover"
                                            style={{
                                                filter: `hue-rotate(${getHueRotation(
                                                    selectedColor
                                                )}deg)`,
                                            }}
                                        />
                                    </div>
                                </div>
                                {/* Glow effect */}
                                <div
                                    className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg animate-ping opacity-20"
                                    style={{ backgroundColor: selectedColor }}
                                ></div>
                            </div>
                        </div>

                        {/* Name Input */}
                        <div className="mb-4">
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => {
                                    console.log(
                                        "Input changed:",
                                        e.target.value
                                    );
                                    setPlayerName(e.target.value);
                                }}
                                placeholder="Enter your name..."
                                className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-gray-800 bg-white shadow-soft"
                                maxLength={20}
                                autoFocus
                            />
                            {/* Debug display */}
                            {/* <div className="mt-1 text-xs text-amber-600 text-center">
                                Current value: "{playerName}" (Length:{" "}
                                {playerName.length})
                            </div> */}
                        </div>

                        {/* Color Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                                Choose your color:
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() =>
                                            setSelectedColor(color.value)
                                        }
                                        className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                                            selectedColor === color.value
                                                ? "border-blue-500 shadow-lg bg-blue-50 ring-2 ring-blue-200"
                                                : "border-gray-300 hover:border-blue-300 bg-white"
                                        }`}
                                    >
                                        <div
                                            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${color.bg} mx-auto mb-1 shadow-soft`}
                                        ></div>
                                        <div className="text-xs font-medium text-gray-700">
                                            {color.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                onClick={handleSubmit}
                                disabled={!playerName.trim()}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                            >
                                Create Character
                            </button>
                        </div>
                </div>
            </div>
        </div>
    );
};
