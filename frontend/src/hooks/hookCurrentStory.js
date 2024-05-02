import { createContext, useContext, useState, useEffect } from 'react';
import useAxiosPrivate from './hookUrlPrivate';

const CurrentStoryContext = createContext();

export const CurrentStoryProvider = ({ children }) => {
    const [currentStory, setCurrentStory] = useState(null);
    const axiosPrivate = useAxiosPrivate();

    const selectStory = (story) => {
        setCurrentStory(story);
    };

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axiosPrivate.get('/gen/stories/');
                if (response.data && response.data.length > 0) {
                    setCurrentStory(response.data[0]);  // Optionally set the first story as the default current story
                }
            } catch (error) {
                console.error('Failed to fetch stories:', error);
            }
        };
        fetchStories();
    }, [axiosPrivate]);

    return (
        <CurrentStoryContext.Provider value={{ currentStory, selectStory }}>
            {children}
        </CurrentStoryContext.Provider>
    );
};

export const useCurrentStory = () => useContext(CurrentStoryContext);
