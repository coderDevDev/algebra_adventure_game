import React, { useState } from "react";

interface ExtrasProps {
    onClose: () => void;
    isVisible: boolean;
}

export const Extras: React.FC<ExtrasProps> = ({ onClose, isVisible }) => {
    const [activeTab, setActiveTab] = useState<
        "gallery" | "achievements" | "statistics"
    >("gallery");

    // Mock data for demonstration
    const artGallery = [
        {
            id: 1,
            title: "Barangay Hall",
            description: "The heart of community governance",
            unlocked: true,
        },
        {
            id: 2,
            title: "City Mayor's Office",
            description: "Municipal leadership center",
            unlocked: true,
        },
        {
            id: 3,
            title: "Philippine Flag",
            description: "Symbol of our nation",
            unlocked: true,
        },
        {
            id: 4,
            title: "Community Garden",
            description: "Environmental stewardship",
            unlocked: false,
        },
        {
            id: 5,
            title: "Youth Assembly",
            description: "Future leaders in action",
            unlocked: false,
        },
        {
            id: 6,
            title: "Voting Process",
            description: "Democracy in practice",
            unlocked: true,
        },
    ];

    const achievements = [
        {
            id: 1,
            title: "First Steps",
            description: "Complete your first mission",
            icon: "👶",
            unlocked: true,
        },
        {
            id: 2,
            title: "Eco Warrior",
            description: "Master environmental missions",
            icon: "🌱",
            unlocked: true,
        },
        {
            id: 3,
            title: "Civic Scholar",
            description: "Answer 50 quiz questions correctly",
            icon: "📚",
            unlocked: false,
        },
        {
            id: 4,
            title: "Community Leader",
            description: "Complete all Level 1 missions",
            icon: "🏆",
            unlocked: false,
        },
        {
            id: 5,
            title: "Perfect Score",
            description: "Get 100% on any quiz",
            icon: "⭐",
            unlocked: true,
        },
        {
            id: 6,
            title: "Municipal Master",
            description: "Complete all Level 2 missions",
            icon: "🏛️",
            unlocked: false,
        },
        {
            id: 7,
            title: "Speed Runner",
            description: "Complete a mission in under 2 minutes",
            icon: "⚡",
            unlocked: false,
        },
        {
            id: 8,
            title: "Helpful Citizen",
            description: "Help 10 NPCs",
            icon: "🤝",
            unlocked: true,
        },
    ];

    const statistics = [
        { label: "Total Playtime", value: "2h 45m", icon: "⏰" },
        { label: "Missions Completed", value: "7 / 20", icon: "✅" },
        { label: "Quiz Accuracy", value: "85%", icon: "🎯" },
        { label: "Badges Earned", value: "7", icon: "🏆" },
        { label: "Coins Collected", value: "245", icon: "💰" },
        { label: "NPCs Met", value: "10", icon: "👥" },
        { label: "Current Level", value: "Level 1", icon: "⭐" },
        { label: "Best Streak", value: "5 correct", icon: "🔥" },
    ];

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-50 p-4">
            <div className="bg-white rounded-3xl shadow-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
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
                            🎨 Extras
                        </h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-center mb-6 space-x-2">
                        {[
                            { id: "gallery", label: "Art Gallery", icon: "🖼️" },
                            {
                                id: "achievements",
                                label: "Achievements",
                                icon: "🏆",
                            },
                            {
                                id: "statistics",
                                label: "Statistics",
                                icon: "📊",
                            },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? "bg-green-500 text-white shadow-soft"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                <span className="hidden sm:inline">
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        {/* Art Gallery */}
                        {activeTab === "gallery" && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4">
                                    🖼️ Art Gallery
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {artGallery.map((artwork) => (
                                        <div
                                            key={artwork.id}
                                            className={`rounded-xl p-4 border-2 ${
                                                artwork.unlocked
                                                    ? "bg-green-50 border-green-300"
                                                    : "bg-gray-100 border-gray-300 opacity-50"
                                            }`}
                                        >
                                            <div className="text-center">
                                                <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-amber-300 to-amber-500 rounded-lg flex items-center justify-center text-2xl">
                                                    {artwork.unlocked
                                                        ? "🎨"
                                                        : "🔒"}
                                                </div>
                                                <h4 className="font-bold text-gray-700 mb-1">
                                                    {artwork.unlocked
                                                        ? artwork.title
                                                        : "???"}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {artwork.unlocked
                                                        ? artwork.description
                                                        : "Complete more missions to unlock"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Achievements */}
                        {activeTab === "achievements" && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4">
                                    🏆 Achievements
                                </h3>
                                <div className="space-y-3">
                                    {achievements.map((achievement) => (
                                        <div
                                            key={achievement.id}
                                            className={`rounded-xl p-4 border-2 flex items-center space-x-4 ${
                                                achievement.unlocked
                                                    ? "bg-blue-50 border-blue-300"
                                                    : "bg-gray-100 border-gray-300 opacity-60"
                                            }`}
                                        >
                                            <div className="text-3xl">
                                                {achievement.unlocked
                                                    ? achievement.icon
                                                    : "🔒"}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-700 mb-1">
                                                    {achievement.unlocked
                                                        ? achievement.title
                                                        : "???"}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {achievement.unlocked
                                                        ? achievement.description
                                                        : "Keep playing to unlock this achievement"}
                                                </p>
                                            </div>
                                            {achievement.unlocked && (
                                                <div className="text-green-600 font-bold text-sm">
                                                    ✅ Unlocked
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Statistics */}
                        {activeTab === "statistics" && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4">
                                    📊 Your Statistics
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {statistics.map((stat, index) => (
                                        <div
                                            key={index}
                                            className="rounded-xl p-4 border-2 border-purple-200 bg-purple-50 flex items-center justify-between"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">
                                                    {stat.icon}
                                                </span>
                                                <span className="font-semibold text-gray-700">
                                                    {stat.label}
                                                </span>
                                            </div>
                                            <div className="font-bold text-amber-900 text-lg">
                                                {stat.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border-2 border-blue-300">
                                    <h4 className="font-bold text-gray-700 mb-2">
                                        🎯 Your Progress
                                    </h4>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-300"
                                            style={{ width: "35%" }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2 text-center">
                                        Overall Progress: 35% Complete
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

            </div>
        </div>
    );
};
