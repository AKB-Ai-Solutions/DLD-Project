import React, { useState } from 'react';
import { FeedbackIcon, StarIcon, CloseIcon } from './icons/Icons';

export const Feedback: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsOpen(false);
            // Reset state after animation
            setTimeout(() => {
                setIsSubmitted(false);
                setRating(0);
                setComment('');
            }, 500);
        }, 2000);
    };

    if (isOpen) {
        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setIsOpen(false)}>
                <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
                    {isSubmitted ? (
                        <div className="p-8 text-center">
                            <h2 className="text-2xl font-bold mb-2 text-primary">Thank You!</h2>
                            <p>Your feedback has been received.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Share Your Feedback</h2>
                                <button type="button" onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <CloseIcon className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">How would you rate this simulator?</label>
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setRating(star)}
                                            >
                                                <StarIcon className={`w-8 h-8 transition-colors ${
                                                    (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-400'
                                                }`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium mb-2">Any comments or suggestions?</label>
                                    <textarea
                                        id="comment"
                                        rows={4}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="Tell us what you think..."
                                    />
                                </div>
                            </div>
                             <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg flex justify-end">
                                <button 
                                    type="submit"
                                    className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary/80 transition disabled:opacity-50"
                                    disabled={rating === 0}
                                >
                                    Submit Feedback
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/80 transition transform hover:scale-110"
            aria-label="Open feedback form"
        >
            <FeedbackIcon className="w-6 h-6" />
        </button>
    );
};
