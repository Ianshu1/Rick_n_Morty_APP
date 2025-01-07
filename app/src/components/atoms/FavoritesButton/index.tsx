interface FavoritesButtonProps {
    isFavorite?: boolean;
    toggleFavorite: () => void;
    isLoading?: boolean;
}

const FavoritesButton: React.FC<FavoritesButtonProps> = ({ isFavorite, toggleFavorite, isLoading }) => {
    return (
        <button
            className={`favorites-button flex items-center justify-center w-8 h-8 rounded-full border transition-all 
                ${isFavorite ? "bg-yellow-400 border-yellow-500" : "bg-white border-gray-300"}
                ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
            `}
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            disabled={isLoading}
        >
            {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isFavorite ? "white" : "#FFD700"}
                    className="w-5 h-5"
                >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            )}
        </button>
    );
};

export default FavoritesButton;
