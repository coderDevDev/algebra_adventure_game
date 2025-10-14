/**
 * Daily Challenges Component for CIVIKA
 * Displays daily challenges and tracks progress
 */

import React, { useState, useEffect } from "react";
import ShopService from "../services/ShopService";
import { DailyChallenge } from "../types/shop";

interface DailyChallengesProps {
    onClose: () => void;
    isVisible: boolean;
}

export const DailyChallenges: React.FC<DailyChallengesProps> = ({
    onClose,
    isVisible,
}) => {
    const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
    const shopService = ShopService.getInstance();

    useEffect(() => {
        if (isVisible) {
            loadChallenges();
        }
    }, [isVisible]);

    const loadChallenges = () => {
        const dailyChallenges = shopService.getDailyChallenges();
        setChallenges(dailyChallenges);
    };

    const getTimeRemaining = (expiresAt: string): string => {
        const now = new Date();
        const expires = new Date(expiresAt);
        const diff = expires.getTime() - now.getTime();

        if (diff <= 0) return "Expired";

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    };

    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto p-4 z-50">
            <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-2xl mx-4 max-h-[95vh] overflow-hidden flex flex-col">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-soft transition-all duration-200 hover:scale-110 z-20"
                    >
                        ✕
                    </button>

                    {/* Header */}
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                        📅 Daily Challenges
                    </h2>

                    {/* Challenges List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                        {challenges.map((challenge) => {
                            const progressPercent =
                                (challenge.progress / challenge.requirement) *
                                100;

                            return (
                                <div
                                    key={challenge.id}
                                    className={`rounded-xl border-2 border-gray-200 bg-gray-50 p-4 ${
                                        challenge.completed
                                            ? "bg-green-100 border-green-300"
                                            : ""
                                    }`}
                                >
                                    {/* Challenge Header */}
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                                                <span>
                                                    {challenge.completed
                                                        ? "✅"
                                                        : "🎯"}
                                                </span>
                                                <span>{challenge.title}</span>
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {challenge.description}
                                            </p>
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            ⏰{" "}
                                            {getTimeRemaining(
                                                challenge.expiresAt
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-3">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>
                                                Progress: {challenge.progress}/
                                                {challenge.requirement}
                                            </span>
                                            <span>
                                                {Math.round(progressPercent)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className={`h-full rounded-full transition-all duration-300 ${
                                                    challenge.completed
                                                        ? "bg-gradient-to-r from-green-500 to-green-600"
                                                        : "bg-gradient-to-r from-blue-500 to-blue-600"
                                                }`}
                                                style={{
                                                    width: `${Math.min(
                                                        progressPercent,
                                                        100
                                                    )}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Rewards */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3 text-sm">
                                            <div className="flex items-center space-x-1">
                                                <span>💰</span>
                                                <span className="font-bold text-amber-800">
                                                    +{challenge.coinReward}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <span>⭐</span>
                                                <span className="font-bold text-blue-800">
                                                    +{challenge.pointsReward}
                                                </span>
                                            </div>
                                        </div>
                                        {challenge.completed && (
                                            <div className="text-green-700 font-bold text-sm">
                                                COMPLETED ✅
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 p-3 rounded-xl border-2 border-blue-200 bg-blue-50">
                        <div className="text-center text-sm text-gray-800">
                            <p className="font-bold mb-1">
                                🎯 Complete challenges to earn bonus rewards!
                            </p>
                            <p className="text-xs text-gray-600">
                                Challenges reset every day at midnight
                            </p>
                        </div>
                    </div>
            </div>
        </div>
    );
};
