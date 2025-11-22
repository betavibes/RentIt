'use client';

import React from 'react';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onChange?: (rating: number) => void;
}

export default function StarRating({
    rating,
    maxRating = 5,
    size = 'md',
    interactive = false,
    onChange
}: StarRatingProps) {
    const [hoverRating, setHoverRating] = React.useState(0);

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    const handleClick = (value: number) => {
        if (interactive && onChange) {
            onChange(value);
        }
    };

    const handleMouseEnter = (value: number) => {
        if (interactive) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(0);
        }
    };

    const displayRating = hoverRating || rating;

    return (
        <div className="flex items-center gap-1">
            {[...Array(maxRating)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= displayRating;
                const isHalfFilled = !interactive && starValue - 0.5 <= displayRating && starValue > displayRating;

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onMouseLeave={handleMouseLeave}
                        disabled={!interactive}
                        className={`${sizeClasses[size]} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
                            }`}
                    >
                        {isHalfFilled ? (
                            <svg
                                className="w-full h-full text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <defs>
                                    <linearGradient id={`half-${index}`}>
                                        <stop offset="50%" stopColor="currentColor" />
                                        <stop offset="50%" stopColor="rgb(71 85 105)" stopOpacity="1" />
                                    </linearGradient>
                                </defs>
                                <path
                                    fill={`url(#half-${index})`}
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                />
                            </svg>
                        ) : (
                            <svg
                                className={`w-full h-full ${isFilled ? 'text-yellow-400' : 'text-slate-600'
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
