import React from "react";

export interface NotificationData {
    type: "success" | "warning" | "info" | "error";
    title: string;
    message: string;
    icon?: string;
    actions?: Array<{
        label: string;
        action: () => void;
        style?: "primary" | "secondary" | "danger";
    }>;
}

interface GameNotificationProps {
    notification: NotificationData | null;
    onClose: () => void;
    isVisible: boolean;
}

export const GameNotification: React.FC<GameNotificationProps> = ({
    notification,
    onClose,
    isVisible,
}) => {
    if (!notification || !isVisible) {
        return null;
    }

    const getTypeStyles = () => {
        switch (notification.type) {
            case "success":
                return {
                    bgColor: "bg-green-50",
                    border: "border-green-200",
                    icon: notification.icon || "🎉",
                    titleColor: "text-gray-800",
                    messageColor: "text-gray-600",
                };
            case "warning":
                return {
                    bgColor: "bg-yellow-50",
                    border: "border-yellow-200",
                    icon: notification.icon || "⚠️",
                    titleColor: "text-gray-800",
                    messageColor: "text-gray-600",
                };
            case "info":
                return {
                    bgColor: "bg-blue-50",
                    border: "border-blue-200",
                    icon: notification.icon || "ℹ️",
                    titleColor: "text-gray-800",
                    messageColor: "text-gray-600",
                };
            case "error":
                return {
                    bgColor: "bg-red-50",
                    border: "border-red-200",
                    icon: notification.icon || "❌",
                    titleColor: "text-gray-800",
                    messageColor: "text-gray-600",
                };
            default:
                return {
                    bgColor: "bg-gray-50",
                    border: "border-gray-200",
                    icon: notification.icon || "💬",
                    titleColor: "text-gray-800",
                    messageColor: "text-gray-600",
                };
        }
    };

    const getButtonStyles = (style?: string) => {
        switch (style) {
            case "primary":
                return "bg-blue-500 hover:bg-blue-600 text-white shadow-soft";
            case "danger":
                return "bg-red-500 hover:bg-red-600 text-white shadow-soft";
            case "secondary":
            default:
                return "bg-gray-500 hover:bg-gray-600 text-white shadow-soft";
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-50 p-4">
            <div
                className={`bg-white rounded-3xl shadow-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto custom-scrollbar relative`}
            >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-soft transition-all duration-200 hover:scale-110 z-20"
                    >
                        ✕
                    </button>

                    {/* Content */}
                    <div className="text-center space-y-4">
                        {/* Icon */}
                        <div className="text-5xl mb-2">
                            {styles.icon}
                        </div>

                        {/* Title */}
                        <h2
                            className={`text-2xl font-bold ${styles.titleColor} mb-2`}
                        >
                            {notification.title}
                        </h2>

                        {/* Message */}
                        <div className={`rounded-xl border-2 ${styles.border} ${styles.bgColor} p-4`}>
                            <p
                                className={`text-base ${styles.messageColor} leading-relaxed`}
                            >
                                {notification.message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2 mt-6">
                            {notification.actions &&
                            notification.actions.length > 0 ? (
                                notification.actions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            // Execute the action
                                            action.action();
                                            // Close the notification
                                            onClose();
                                        }}
                                        className={`w-full py-3 px-6 rounded-xl transition-all duration-200 font-medium hover:scale-105 ${getButtonStyles(
                                            action.style
                                        )}`}
                                    >
                                        <div className="text-white flex items-center justify-center space-x-2">
                                            <span>{action.label}</span>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <button
                                    onClick={onClose}
                                    className="w-full bg-blue-500 hover:bg-blue-600 py-3 px-6 rounded-xl transition-all duration-200 font-medium hover:scale-105 shadow-soft"
                                >
                                    <div className="text-white flex items-center justify-center space-x-2">
                                        <span>👍</span>
                                        <span>OK</span>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
            </div>
        </div>
    );
};
