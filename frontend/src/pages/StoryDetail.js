import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/hookUrlPrivate';
import Select from 'react-select';
import CharacterForm from './CharacterPage'; // Assuming this component is set up to handle both new and story-specific character creations
import CreateScriptForm from './ScriptPage';

function StoryDetails() {
    const { storyId } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [story, setStory] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [scripts, setScripts] = useState([]);
    const [selectedCharacters, setSelectedCharacters] = useState([]); // Added for handling multiple character selections
    const [availableCharacters, setAvailableCharacters] = useState([]); // Characters not yet linked to this story
    const [isCharacterFormVisible, setIsCharacterFormVisible] = useState(false); // State to toggle character form visibility
    const [isScriptFormVisible, setIsScriptFormVisible] = useState(false); // State to toggle script form visibility


    // Fetching story details along with characters and scripts associated with it
    const fetchData = async () => {
        try {
            const [storyRes, charsRes, scriptsRes, availCharsRes] = await Promise.all([
                axiosPrivate.get(`/gen/stories/${storyId}/`),
                axiosPrivate.get(`/gen/stories/${storyId}/character`),
                axiosPrivate.get(`/gen/stories/${storyId}/script`),
                axiosPrivate.get('/gen/character/', { params: { exclude_story: storyId } }) // Adjusted for available characters
            ]);
            setStory(storyRes.data);
            setCharacters(charsRes.data);
            setScripts(scriptsRes.data);
            setAvailableCharacters(availCharsRes.data.map(char => ({
                value: char.id,
                label: char.name
            })));
        } catch (error) {
            console.error('Error loading story details:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [storyId, axiosPrivate]);

    // Handler for linking existing characters to the story
    const handleAddCharacter = async (selectedOptions) => {
        const characterIds = selectedOptions.map(option => option.value);

    try {
        await axiosPrivate.post(`/gen/stories/${storyId}/add_characters/`, { character_ids: characterIds });
        fetchData(); // Refresh data to reflect changes
    } catch (error) {
        console.error('Error adding characters to story:', error.response.data.error);
    }
};

    // Handler for creating a new character and linking to this story directly
    const handleCreateCharacter = async (characterData) => {
        try {
            // Pass storyId along with the character data to the API
            await axiosPrivate.post(`/gen/character/`, { ...characterData, storyId });
            fetchData();  // Refresh the data to reflect the new character in the list
        } catch (error) {
            console.error('Error creating new character:', error);
        }
    };
    
    const handleSubmitAddCharacters = () => {
        // Assuming you gather character IDs from some selection mechanism
        const selectedCharacterIds = []; // Example: adding just one character
        handleAddCharacter(selectedCharacterIds);
    };

    // Toggle the visibility of the character form
    const toggleCharacterForm = () => setIsCharacterFormVisible(!isCharacterFormVisible);
    const toggleScriptForm = () => setIsScriptFormVisible(!isScriptFormVisible); // Function to toggle script form visibility


   
    return (
        <div style={{
            background: "linear-gradient(135deg, #0F0F28 40%, #050506 60%)",
            color: 'black'
        }}>
            <h1>{story?.title}</h1>
            <p>{story?.description}</p>
            <h2>Characters</h2>
            <Select
                isMulti
                options={availableCharacters}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={setSelectedCharacters}
                value={selectedCharacters}
                placeholder="Link existing characters"
            />
            <button onClick={() => handleAddCharacter(selectedCharacters)} className="btn-toggle">
                Add Selected Characters
            </button>
            <button onClick={toggleCharacterForm}>
                {isCharacterFormVisible ? 'Cancel Adding Character' : 'Add Character'}
            </button>
            {isCharacterFormVisible && <CharacterForm storyId={storyId} onSave={fetchData} />}
            <ul>
                {characters.map(character => (
                    <li key={character.id}>{character.name}</li>
                ))}
            </ul>
            <h2>Scripts</h2>
            <button onClick={toggleScriptForm}>
                {isScriptFormVisible ? 'Cancel Adding Script' : 'Add Script'}
            </button>
            {isScriptFormVisible && <CreateScriptForm storyId={storyId} onSave={fetchData} />}
            <ul>
                {scripts.map(script => (
                    <li key={script.id}>{script.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default StoryDetails;