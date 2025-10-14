import React from "react";

interface Mission {
    id: string;
    title: string;
    description: string;
    quizOverview: string;
    realLifeTrivia: string[];
    npc: string;
    location: string;
    reward: string;
}

interface MissionSystemProps {
    mission: Mission;
    onStartQuiz: () => void;
    onClose: () => void;
}

export const MissionSystem: React.FC<MissionSystemProps> = ({
    mission,
    onStartQuiz,
    onClose,
}) => {
    // Provide default values if properties are missing
    const quizOverview = mission.quizOverview || "Complete this quiz to test your algebra skills.";
    const realLifeTrivia = mission.realLifeTrivia || [
        "Math helps solve real-world problems",
        "Understanding algebra improves decision-making",
        "Problem-solving skills are valuable in everyday life"
    ];

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-2xl mx-4 max-h-[95vh] overflow-y-auto custom-scrollbar">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-soft transition-all duration-200 hover:scale-110 z-20"
                        >
                            ✕
                        </button>

                        {/* Header */}
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                            📜 Mission Details
                        </h2>

                        {/* Mission Info */}
                        <div className="space-y-3 sm:space-y-4">
                            {/* Mission Title */}
                            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 flex items-center space-x-2">
                                    <span>⚔️</span>
                                    <span>{mission.title}</span>
                                </h3>
                                <p className="text-gray-700 text-sm sm:text-base">
                                    {mission.description}
                                </p>
                            </div>

                            {/* NPC Info */}
                            <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
                                <div className="flex items-center">
                                    <div className="text-xl sm:text-2xl mr-2 sm:mr-3">
                                        👤
                                    </div>
                                    <div>
                                        <h4 className="text-base sm:text-lg font-bold text-gray-700">
                                            NPC: {mission.npc}
                                        </h4>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            📍 Location: {mission.location}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quiz Overview */}
                            <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
                                <h4 className="text-base sm:text-lg font-bold text-gray-700 mb-2 flex items-center space-x-2">
                                    <span>📝</span>
                                    <span>Quiz Overview:</span>
                                </h4>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                    {quizOverview}
                                </p>
                            </div>

                            {/* Real-Life Applications */}
                            <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
                                <h4 className="text-base sm:text-lg font-bold text-gray-700 mb-3 flex items-center space-x-2">
                                    <span>💡</span>
                                    <span>Why This Matters in Real Life:</span>
                                </h4>
                                <ul className="space-y-2">
                                    {realLifeTrivia.map((trivia, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start"
                                        >
                                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <span className="text-gray-600 text-sm sm:text-base">
                                                {trivia}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Reward */}
                            <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4">
                                <div className="flex items-center">
                                    <div className="text-xl sm:text-2xl mr-2 sm:mr-3">
                                        🏆
                                    </div>
                                    <div>
                                        <h4 className="text-base sm:text-lg font-bold text-gray-700">
                                            Reward:
                                        </h4>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            {mission.reward}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
                            <button
                                onClick={onStartQuiz}
                                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 text-white font-medium rounded-xl shadow-soft hover:shadow-lg hover:scale-105 transition-all duration-200"
                            >
                                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                    <span>📝</span>
                                    <span>Start Quiz</span>
                                </div>
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-gray-500 hover:bg-gray-600 px-6 py-3 text-white font-medium rounded-xl shadow-soft hover:shadow-lg hover:scale-105 transition-all duration-200"
                            >
                                <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                    <span>🚪</span>
                                    <span>Close</span>
                                </div>
                            </button>
                        </div>
            </div>
        </div>
    );
};
