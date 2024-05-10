import React, { useState } from 'react';
import StorySelector from './StorySelect';
import StoryDetails from './StoryDetail';
import { useCurrentStory } from '../hooks/hookCurrentStory';

const StoryDashboard = () => {
    const { currentStory } = useCurrentStory();
    const [isSelectorOpen, setIsSelectorOpen] = useState(true);
    const [isSlider, setIsSlider] = useState(true);

    const toggleSidebar = () => setIsSelectorOpen(!isSelectorOpen);
    const toggleiSider = () => setIsSlider(!isSlider);

    return (
        <div className="dashboard-container">
            {/* Menu icon for mobile views */}
            <div className={`menu-icon ${isSelectorOpen ? 'open' : ''}`} onClick={toggleSidebar}>
                <div></div><div></div><div></div> {/* Hamburger lines */}
            </div>
            <div className={`story-selector ${isSelectorOpen ? 'open' : ''} shadow-2`} onClick={toggleiSider}>
                <StorySelector />
                <div className="toggle-handle" onClick={toggleSidebar}></div>
            </div>
            <div className="story-details">
                {currentStory ? <StoryDetails storyId={currentStory.id} /> : <p>Select a story to view details.</p>}
            </div>
        </div>
    );
}

export default StoryDashboard;
