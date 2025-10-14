import React, { useEffect, useState } from "react";

interface AchievementCelebrationProps {
    badge: string;
    coins: number;
    points: number;
    timeBonus?: number;
    show: boolean;
    onComplete: () => void;
}

export const AchievementCelebration: React.FC<AchievementCelebrationProps> = ({
    badge,
    coins,
    points,
    timeBonus = 0,
    show,
    onComplete,
}) => {
    const [confettiPieces] = useState(() =>
        Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 0.5,
            color: [
                "bg-math-blue",
                "bg-math-purple",
                "bg-math-orange",
                "bg-math-green",
                "bg-level1-secondary",
                "bg-level2-secondary",
            ][Math.floor(Math.random() * 6)],
        }))
    );

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onComplete();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onComplete]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Confetti */}
            {confettiPieces.map((piece) => (
                <div
                    key={piece.id}
                    className={`absolute w-2 h-2 rounded-full ${piece.color} animate-confetti`}
                    style={{
                        left: `${piece.left}%`,
                        top: "-20px",
                        animationDelay: `${piece.delay}s`,
                    }}
                />
            ))}

            {/* Achievement Card */}
            <div className="animate-slide-down pointer-events-auto">
                <div className="bg-gradient-to-br from-math-orange via-level1-primary to-math-purple rounded-2xl p-1 shadow-2xl">
                    <div className="bg-white rounded-xl p-6 sm:p-8">
                        {/* Badge Icon with Celebration */}
                        <div className="text-center mb-4 animate-celebrate">
                            <div className="text-6xl sm:text-7xl mb-3">🏆</div>
                            <div className="text-2xl sm:text-3xl font-playful font-bold bg-gradient-to-r from-math-orange to-math-purple bg-clip-text text-transparent">
                                Achievement Unlocked!
                            </div>
                        </div>

                        {/* Badge Name */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-level1-light to-level2-light rounded-full px-6 py-3 shadow-soft">
                                <span className="text-xl sm:text-2xl">✨</span>
                                <span className="text-lg sm:text-xl font-heading font-bold text-gray-800">
                                    {badge}
                                </span>
                                <span className="text-xl sm:text-2xl">✨</span>
                            </div>
                        </div>

                        {/* Rewards */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg p-4 text-center border-2 border-amber-300">
                                <div className="text-3xl mb-1">💰</div>
                                <div className="text-2xl font-bold text-amber-800">
                                    +{coins}
                                </div>
                                <div className="text-sm text-amber-600 font-semibold">
                                    Coins
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 text-center border-2 border-blue-300">
                                <div className="text-3xl mb-1">⭐</div>
                                <div className="text-2xl font-bold text-blue-800">
                                    +{points + timeBonus}
                                </div>
                                <div className="text-sm text-blue-600 font-semibold">
                                    Points
                                </div>
                            </div>
                        </div>

                        {/* Time Bonus Badge */}
                        {timeBonus > 0 && (
                            <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-lg p-3 text-center">
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="text-2xl">⚡</span>
                                    <span className="text-lg font-bold text-green-700">
                                        Speed Bonus: +{timeBonus} pts!
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Continue Message */}
                        <div className="mt-6 text-center text-sm text-gray-500 animate-pulse-soft">
                            Tap anywhere to continue...
                        </div>
                    </div>
                </div>
            </div>

            {/* Tap to dismiss overlay */}
            <div
                className="absolute inset-0 bg-black/20"
                onClick={onComplete}
            />
        </div>
    );
};
