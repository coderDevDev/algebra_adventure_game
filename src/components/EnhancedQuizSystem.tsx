import React, { useState, useEffect } from "react";

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    steps?: string[]; // Step-by-step solution
    formula?: string; // Mathematical formula
    hints?: string[]; // Progressive hints
}

interface EnhancedQuizSystemProps {
    question: QuizQuestion;
    onAnswer: (isCorrect: boolean) => void;
    onClose: () => void;
    missionId?: string;
    level?: number; // 1 for Barangay, 2 for City
}

export const EnhancedQuizSystem: React.FC<EnhancedQuizSystemProps> = ({
    question,
    onAnswer,
    onClose,
    missionId,
    level = 1,
}) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [submissionTime, setSubmissionTime] = useState<number>(0);
    const [startTime] = useState<number>(Date.now());
    const [showHints, setShowHints] = useState(false);
    const [currentHintLevel, setCurrentHintLevel] = useState(0);
    const [showFormula, setShowFormula] = useState(false);

    // Timer system
    const QUIZ_TIME_LIMIT = 60;
    const [timeRemaining, setTimeRemaining] = useState(QUIZ_TIME_LIMIT);
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [timeBonus, setTimeBonus] = useState(0);

    // Level-based colors
    const levelColors = level === 1 ? {
        primary: "level1-primary",
        secondary: "level1-secondary",
        light: "level1-light",
        gradient: "from-level1-primary to-level1-secondary",
    } : {
        primary: "level2-primary",
        secondary: "level2-secondary",
        light: "level2-light",
        gradient: "from-level2-primary to-level2-accent",
    };

    // Countdown timer effect
    useEffect(() => {
        if (!isTimerRunning || showResult) return;

        const timerInterval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timerInterval);
                    setIsTimerRunning(false);
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [isTimerRunning, showResult]);

    const calculateTimeBonus = (remainingTime: number): number => {
        if (remainingTime >= 50) return 30; // Excellent!
        if (remainingTime >= 40) return 20; // Great!
        if (remainingTime >= 30) return 10; // Good!
        return 0;
    };

    const handleTimeUp = () => {
        setIsCorrect(false);
        setSubmissionTime(QUIZ_TIME_LIMIT);
        setShowResult(true);
        setTimeBonus(0);
        onAnswer(false);
    };

    const handleOptionSelect = (index: number) => {
        if (!showResult) {
            setSelectedOption(index);
        }
    };

    const handleSubmit = () => {
        if (selectedOption !== null) {
            setIsTimerRunning(false);
            const correct = selectedOption === question.correctAnswer;
            const timeSpent = (Date.now() - startTime) / 1000;
            const bonus = correct ? calculateTimeBonus(timeRemaining) : 0;
            setTimeBonus(bonus);
            setIsCorrect(correct);
            setSubmissionTime(timeSpent);
            setShowResult(true);
            onAnswer(correct);
        }
    };

    const handleNext = () => {
        onClose();
    };

    const handleShowHint = () => {
        setShowHints(true);
        if (currentHintLevel < (question.hints?.length || 0) - 1) {
            setCurrentHintLevel(currentHintLevel + 1);
        }
    };

    const getTimerColor = () => {
        if (timeRemaining <= 10) return "text-error animate-pulse";
        if (timeRemaining <= 20) return "text-warning";
        if (timeRemaining <= 30) return "text-math-orange";
        return "text-success";
    };

    const getTimerBgColor = () => {
        if (timeRemaining <= 10) return "bg-red-100 border-error";
        if (timeRemaining <= 20) return "bg-orange-100 border-warning";
        if (timeRemaining <= 30) return "bg-yellow-100 border-math-orange";
        return "bg-green-100 border-success";
    };

    const getProgressBarColor = () => {
        if (timeRemaining <= 10) return "bg-error";
        if (timeRemaining <= 20) return "bg-warning";
        if (timeRemaining <= 30) return "bg-math-orange";
        return "bg-success";
    };

    const timePercentage = (timeRemaining / QUIZ_TIME_LIMIT) * 100;

    return (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="w-full max-w-sm sm:max-w-2xl lg:max-w-4xl mx-2 sm:mx-4 max-h-[95vh] overflow-y-auto custom-scrollbar">
                {/* Quiz Container with Level-based Gradient */}
                <div className={`bg-gradient-to-br ${levelColors.gradient} rounded-2xl p-1 shadow-2xl`}>
                    <div className="bg-white rounded-xl p-4 sm:p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-3">
                                <div className={`bg-${levelColors.primary} rounded-lg px-4 py-2 shadow-soft`}>
                                    <span className="text-white font-bold text-sm">
                                        Mission #{missionId}
                                    </span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-heading font-bold text-gray-800">
                                    📝 Math Challenge
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-error hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Timer Display */}
                        {!showResult && (
                            <div className={`mb-4 p-4 rounded-xl border-3 ${getTimerBgColor()} transition-all duration-300 shadow-soft`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-3xl">⏱️</span>
                                        <span className={`text-3xl font-bold font-math ${getTimerColor()}`}>
                                            {timeRemaining}s
                                        </span>
                                    </div>
                                    <div className="text-sm font-semibold text-gray-700">
                                        {timeRemaining <= 10 ? "⚠️ HURRY!" : timeRemaining <= 20 ? "⏰ Time Running Out!" : "💪 You Got This!"}
                                    </div>
                                </div>
                                <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                                    <div
                                        className={`h-full ${getProgressBarColor()} transition-all duration-1000 ease-linear`}
                                        style={{ width: `${timePercentage}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Question Card */}
                        <div className="mb-6">
                            <div className={`bg-gradient-to-r from-${levelColors.light} to-white border-2 border-${levelColors.primary} rounded-xl p-6 shadow-soft`}>
                                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                                    <span className="text-2xl">❓</span>
                                    <span>Question:</span>
                                </h3>
                                <p className="text-gray-700 leading-relaxed text-base sm:text-lg font-body">
                                    {question.question}
                                </p>
                            </div>
                        </div>

                        {/* Help Section (Hints & Formula) */}
                        {!showResult && (question.hints || question.formula) && (
                            <div className="mb-4 space-y-2">
                                {question.formula && (
                                    <button
                                        onClick={() => setShowFormula(!showFormula)}
                                        className="w-full bg-info/10 hover:bg-info/20 border-2 border-info rounded-lg p-3 transition-all duration-200 flex items-center justify-between"
                                    >
                                        <span className="flex items-center space-x-2 font-semibold text-info">
                                            <span className="text-xl">📐</span>
                                            <span>Show Formula</span>
                                        </span>
                                        <span className="text-info">{showFormula ? "▼" : "▶"}</span>
                                    </button>
                                )}
                                {showFormula && question.formula && (
                                    <div className="bg-blue-50 border-2 border-info rounded-lg p-4 animate-slide-down">
                                        <code className="text-info font-math text-lg block text-center">
                                            {question.formula}
                                        </code>
                                    </div>
                                )}
                                {question.hints && question.hints.length > 0 && (
                                    <button
                                        onClick={handleShowHint}
                                        disabled={currentHintLevel >= question.hints.length - 1 && showHints}
                                        className="w-full bg-warning/10 hover:bg-warning/20 border-2 border-warning rounded-lg p-3 transition-all duration-200 flex items-center justify-between disabled:opacity-50"
                                    >
                                        <span className="flex items-center space-x-2 font-semibold text-warning">
                                            <span className="text-xl">💡</span>
                                            <span>Get a Hint</span>
                                        </span>
                                        <span className="text-xs text-warning">
                                            ({currentHintLevel + 1}/{question.hints.length})
                                        </span>
                                    </button>
                                )}
                                {showHints && question.hints && (
                                    <div className="space-y-2 animate-slide-down">
                                        {question.hints.slice(0, currentHintLevel + 1).map((hint, idx) => (
                                            <div key={idx} className="bg-amber-50 border-2 border-warning rounded-lg p-3">
                                                <div className="flex items-start space-x-2">
                                                    <span className="text-warning font-bold text-sm">Hint {idx + 1}:</span>
                                                    <span className="text-gray-700 text-sm">{hint}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                            {question.options.map((option, index) => {
                                let optionClass = "p-4 rounded-xl border-3 transition-all duration-200 cursor-pointer ";

                                if (showResult) {
                                    if (index === question.correctAnswer) {
                                        optionClass += "bg-green-100 border-green-500 text-green-800 shadow-lg ring-2 ring-green-300";
                                    } else if (index === selectedOption && !isCorrect) {
                                        optionClass += "bg-red-100 border-red-500 text-red-800 shadow-lg ring-2 ring-red-300";
                                    } else {
                                        optionClass += "bg-gray-50 border-gray-300 text-gray-500";
                                    }
                                } else {
                                    optionClass += selectedOption === index
                                        ? "bg-blue-50 border-blue-500 shadow-lg ring-4 ring-blue-300 scale-105"
                                        : "bg-white border-gray-300 hover:border-blue-400 hover:shadow-md hover:scale-102";
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleOptionSelect(index)}
                                        disabled={showResult}
                                        className={optionClass}
                                    >
                                        <div className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full border-3 mr-3 flex items-center justify-center font-bold flex-shrink-0 transition-all duration-200 ${
                                                showResult
                                                    ? index === question.correctAnswer
                                                        ? "bg-green-500 border-green-600 text-white shadow-lg"
                                                        : index === selectedOption && !isCorrect
                                                        ? "bg-red-500 border-red-600 text-white shadow-lg"
                                                        : "bg-gray-300 border-gray-400 text-gray-500"
                                                    : selectedOption === index
                                                    ? "bg-blue-500 border-blue-600 text-white shadow-lg scale-110"
                                                    : "bg-gray-200 border-gray-400 text-gray-600"
                                            }`}>
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <span className={`font-medium text-base transition-all duration-200 ${
                                                selectedOption === index && !showResult ? "text-blue-700 font-bold" : "text-gray-800"
                                            }`}>{option}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Result Section with Step-by-Step Solution */}
                        {showResult && (
                            <div className={`rounded-xl mb-4 border-3 p-6 ${
                                isCorrect ? "bg-green-50 border-success" : "bg-red-50 border-error"
                            }`}>
                                <div className="flex items-center mb-4">
                                    <div className={`text-4xl mr-3 ${isCorrect ? "text-success" : "text-error"}`}>
                                        {isCorrect ? "🎉" : "❌"}
                                    </div>
                                    <div>
                                        <h4 className={`text-2xl font-bold ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                                            {isCorrect ? "Excellent!" : "Not Quite!"}
                                        </h4>
                                        <p className={`text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                                            {isCorrect
                                                ? timeBonus > 0
                                                    ? `Amazing! Speed bonus: +${timeBonus} points!`
                                                    : "Great job solving the problem!"
                                                : "Let's learn from this together!"}
                                        </p>
                                    </div>
                                </div>

                                {/* Step-by-Step Solution */}
                                {question.steps && (
                                    <div className="bg-white rounded-lg p-4 border-2 border-gray-200 mb-4">
                                        <h5 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
                                            <span className="text-xl">📝</span>
                                            <span>Step-by-Step Solution:</span>
                                        </h5>
                                        <ol className="space-y-2">
                                            {question.steps.map((step, idx) => (
                                                <li key={idx} className="flex items-start space-x-3">
                                                    <span className={`flex-shrink-0 w-6 h-6 rounded-full bg-${levelColors.primary} text-white flex items-center justify-center text-xs font-bold`}>
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-gray-700 font-body">{step}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}

                                {/* Explanation */}
                                <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-300">
                                    <h5 className="font-bold text-amber-800 mb-2 flex items-center space-x-2">
                                        <span className="text-xl">💡</span>
                                        <span>Key Concept:</span>
                                    </h5>
                                    <p className="text-amber-700 font-body">{question.explanation}</p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-center space-x-4">
                            {!showResult ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={selectedOption === null}
                                    className={`bg-gradient-to-r ${levelColors.gradient} px-8 py-4 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2`}
                                >
                                    <span className="text-xl">📤</span>
                                    <span>Submit Answer</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className={`bg-gradient-to-r ${levelColors.gradient} px-8 py-4 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2`}
                                >
                                    <span className="text-xl">➡️</span>
                                    <span>Continue</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
