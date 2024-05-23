import React, { useEffect, useState } from 'react';
import { useCurrentStory } from '../hooks/hookCurrentStory';
import useAxiosPrivate from '../hooks/hookUrlPrivate';
import LoadingSpinner from '../components/LoadingSpinner';

// Define initial button styles in your component
const buttonStyle = {
    flex: '5',  // Keeps the flex allocation as before
    padding: '5px',  // Increased vertical padding
    margin: '4px',
    backgroundColor: 'gray',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'left',
    fontSize: '18px',  // Increase font size as needed
    transition: 'background-color 0.3s' // Smooth transition for background color change
};

const deleteButtonStyle = {
    flex: '1',  // Smaller flex grow factor for the delete button
    padding: '3px',
    margin: '3px',
    backgroundColor: 'white',
    color: 'red',
    border: 'none',
    borderRadius: '5px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.3s, color 0.3s' // Smooth transition for background and color change
};

function StorySelector() {
    const [stories, setStories] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { selectStory } = useCurrentStory();
    const axiosPrivate = useAxiosPrivate();

    // Hover states for each button type
    const [hoveredSelectStoryId, setHoveredSelectStoryId] = useState(null);
    const [hoveredDeleteStoryId, setHoveredDeleteStoryId] = useState(null);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axiosPrivate.get('/gen/stories/');
                setStories(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching stories:', error);
                setError('Failed to fetch stories');
            }
        };
        fetchStories();
    }, [axiosPrivate]);

    const handleDeleteStory = async (story) => {
        if (window.confirm(`Are you sure you want to delete "${story.title}"?`)) {
            setIsLoading(true);
            try {
                await axiosPrivate.delete(`/gen/stories/${story.id}/`);
                setStories(stories.filter(s => s.id !== story.id));
                setError('');
            } catch (error) {
                console.error('Error deleting story:', error);
                setError('Failed to delete the story');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="story-selector-container mb-5 bg-transparent">
            <h2 className="text-lg font-semibold mb-4 text-white">Select a Story</h2>
            {error && <p className="text-red-500">{error}</p>}
            {isLoading && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000
                }}>
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && stories.length > 0 ? (
                stories.map((story) => (

                    <div key={story.id} className="flex justify-between items-center" style={{margin: '10px 0'}}>

                        <button
                            title={story.title}
                            onClick={() => selectStory(story)}
                            onMouseEnter={() => setHoveredSelectStoryId(story.id)}
                            onMouseLeave={() => setHoveredSelectStoryId(null)}
                            style={{
                                flex: '5',
                                padding: '5px',
                                margin: '4px',
                                backgroundColor: hoveredSelectStoryId === story.id ? '#666' : 'gray',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'left',
                                fontSize: '18px',
                                transition: 'background-color 0.3s'
                            }}
                        >
                            {story.title}
                        </button>
                        
                        <button
                            onClick={() => handleDeleteStory(story)}
                            onMouseEnter={() => setHoveredDeleteStoryId(story.id)}
                            onMouseLeave={() => setHoveredDeleteStoryId(null)}
                            style={{
                                flex: '1',
                                padding: '3px',
                                margin: '3px',
                                backgroundColor: hoveredDeleteStoryId === story.id ? 'darkred' : 'white',
                                color: hoveredDeleteStoryId === story.id ? 'white' : 'red',
                                border: 'none',
                                borderRadius: '5px',
                                textAlign: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transition: 'background-color 0.3s, color 0.3s'
                            }}
                        >
                            <svg width="20" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
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