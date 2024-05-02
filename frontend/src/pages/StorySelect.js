import React, { useEffect, useState } from 'react';
import { useCurrentStory } from "../hooks/hookCurrentStory"
import useAxiosPrivate from '../hooks/hookUrlPrivate';

function StorySelector() {
    const { selectStory } = useCurrentStory();
    const [stories, setStories] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axiosPrivate.get('/gen/stories/');
                setStories(response.data);
            } catch (error) {
                console.error('Error fetching stories:', error);
            }
        };
        fetchStories();
    }, [axiosPrivate]);

    return (
        <div>
            <h2>Select a Story</h2>
            {stories.map((story) => (
                <div key={story.id}>
                    <button onClick={() => selectStory(story)}>
                        {story.title}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default StorySelector;
