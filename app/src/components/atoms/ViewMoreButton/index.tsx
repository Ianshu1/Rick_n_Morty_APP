import React from "react";

interface ViewMoreButtonProps {
    onClick: () => void;
}

const ViewMoreButton: React.FC<ViewMoreButtonProps> = ({ onClick }) => {
    return (
        <button
            className="view-more-btn mt-4 w-full py-2 text-sm font-medium bg-zinc-950 text-white rounded-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={onClick}
        >
            View More
        </button>
    );
};

export default ViewMoreButton;