import React, { useState } from "react";

interface MainMenuProps {
    onStartGame: () => void;
    onLoadGame?: () => void;
    onShowSettings?: () => void;
    onShowExtras?: () => void;
    onShowCredits?: () => void;
    onShowLeaderboard?: () => void;
    onExit?: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
    onStartGame,
    onLoadGame,
    onShowSettings,
    onShowExtras,
    onShowCredits,
    onShowLeaderboard,
    onExit,
}) => {
    const [showSubMenu, setShowSubMenu] = useState<string | null>(null);

    const handleLoadGame = () => {
        // Check if there's saved progress
        const savedProgress = localStorage.getItem("civika-game-progress");
        if (savedProgress) {
            onLoadGame?.();
        } else {
            alert("No saved game found! Start a new game first.");
        }
    };

    const handleExit = () => {
        if (
            window.confirm("Are you sure you want to exit Algebra Adventure?")
        ) {
            onExit?.();
            // For web, we can close the tab/window or redirect
            window.close();
        }
    };
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 flex items-center justify-center p-4">
            {/* Main content - Clean and simple */}
            <div className="w-full max-w-md mx-auto">
                {/* Simple White Card Container */}
                <div className="bg-white rounded-3xl shadow-soft p-8 space-y-6">
                    {/* Header with Logo */}
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-soft">
                                <img
                                    src="/logo.png"
                                    alt="Algebra Adventure"
                                    className="w-12 h-12 object-contain"
                                />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Algebra Adventure
                        </h1>
                    </div>

                    {/* Menu Buttons - Clean simple buttons */}
                    <div className="space-y-3">
                        {/* New Game Button */}
                        <button
                            onClick={onStartGame}
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                        >
                            🆕 New Game
                        </button>

                        {/* Continue Button */}
                        {/* <button
                            onClick={handleLoadGame}
                            className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                        >
                            💾 Continue
                        </button> */}

                        {/* Settings */}
                        <button
                            onClick={() => onShowSettings?.()}
                            className="w-full bg-gray-600 text-white py-3 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                        >
                            ⚙️ Settings
                        </button>

                        {/* Leaderboard */}
                        <button
                            onClick={() => onShowLeaderboard?.()}
                            className="w-full bg-amber-500 text-white py-3 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                        >
                            🏆 Leaderboard
                        </button>

                        {/* Extras */}
                        {/* <button
                            onClick={() => onShowExtras?.()}
                            className="w-full bg-green-500 text-white py-3 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                        >
                            🎨 Extras
                        </button> */}

                        {/* Credits */}
                        {/* <button
                            onClick={() => onShowCredits?.()}
                            className="w-full bg-purple-500 text-white py-3 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                        >
                            👥 Credits
                        </button> */}

                        {/* Exit */}
                        <button
                            onClick={handleExit}
                            className="w-full bg-red-500 text-white py-3 rounded-xl font-medium shadow-soft hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                        >
                            🚪 Exit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

