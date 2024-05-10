import React, { createContext, useContext, useState, useEffect } from 'react';
import useAxiosPrivate from './hookUrlPrivate';

const CurrentStoryContext = createContext();

export const CurrentStoryProvider = ({ children }) => {
    const [currentStory, setCurrentStory] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        // Fetch stories initially or handle fetching differently based on your needs
        const fetchStories = async () => {
            try {
                const response = await axiosPrivate.get('/gen/stories/');
                if (response.data && response.data.length > 0) {
                    setCurrentStory(response.data[0]); // Optionally set the first story as the default
                }
            } catch (error) {
                console.error('Failed to fetch stories:', error);
            }
        };
        fetchStories();
    }, [axiosPrivate]);

    const selectStory = (story) => {
        setCurrentStory(story);
    };

    return (
        <CurrentStoryContext.Provider value={{ currentStory, selectStory }}>
            {children}
        </CurrentStoryContext.Provider>
    );
};

export const useCurrentStory = () => useContext(CurrentStoryContext);
