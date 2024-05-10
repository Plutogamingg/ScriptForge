import React, { useEffect, useState } from 'react';
import { useCurrentStory } from '../hooks/hookCurrentStory';
import useAxiosPrivate from '../hooks/hookUrlPrivate';

function StorySelector() {
    const [stories, setStories] = useState([]);
    const [error, setError] = useState('');
    const { selectStory } = useCurrentStory();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axiosPrivate.get('/gen/stories/');
                setStories(response.data);
                setError(''); // Clear any previous errors on successful fetch
            } catch (error) {
                console.error('Error fetching stories:', error);
                setError('Failed to fetch stories');
            }
        };
        fetchStories();
    }, [axiosPrivate]);

    const handleDeleteStory = async (story) => {
        if (window.confirm(`Are you sure you want to delete "${story.title}"?`)) {
            try {
                await axiosPrivate.delete(`/gen/stories/${story.id}/`);
                setStories(stories.filter(s => s.id !== story.id));
                setError(''); // Clear any previous errors on successful deletion
            } catch (error) {
                console.error('Error deleting story:', error);
                setError('Failed to delete the story');
            }
        }
    };

    return (
        <div className="story-selector-container mb-5 p-4 bg-transparent">
            <h2 className="text-lg font-semibold mb-4 text-white">Select a Story</h2>
            {error && <p className="text-red-500">{error}</p>}
            {stories.length > 0 ? (
                stories.map((story) => (
                    <div key={story.id} className="mb-2 flex justify-between items-center">
                        <button onClick={() => selectStory(story)} className="flex-grow text-left p-2 hover:bg-gray-700 bg-gray-800 text-white rounded">
                            {story.title}
                        </button>
                        <button onClick={() => handleDeleteStory(story)} className="ml-2 p-2 hover:bg-red-700 bg-red-800 text-white rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No stories available.</p>
            )}
        </div>
    );
}

export default StorySelector;
