import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/hookUrlPrivate';
import Select from 'react-select';
import CharacterForm from './CharacterPage'; // Assuming this component is set up to handle both new and story-specific character creations
import CreateScriptForm from './ScriptPage';
import { customSelectStyles } from '../styles/dropdown';
import Modal from './ScriptModal';
import LoadingSpinner from '../components/LoadingSpinner';
import DraftModal from './DraftModal';




function StoryDetails({ storyId }) {
    const axiosPrivate = useAxiosPrivate();
    const [story, setStory] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [scripts, setScripts] = useState([]);
    const [selectedCharacters, setSelectedCharacters] = useState([]); // Added for handling multiple character selections
    const [availableCharacters, setAvailableCharacters] = useState([]); // Characters not yet linked to this story
    const [isCharacterFormVisible, setIsCharacterFormVisible] = useState(false); // State to toggle character form visibility
    const [isScriptFormVisible, setIsScriptFormVisible] = useState(false); // State to toggle script form visibility
    const [showCharacters, setShowCharacters] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generatedScriptContent, setGeneratedScriptContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);  // Track loading state
    const [generatedScripts, setGeneratedScripts] = useState({});
    const [visibleDrafts, setVisibleDrafts] = useState({});
    const [selectedDraft, setSelectedDraft] = useState(null);
    const [isModalDraftOpen, setIsModalDraftOpen] = useState(false);


   



    // Define modal toggle functions
    const openDraftModal = () => setIsModalDraftOpen(true);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDraft(null);
    };
    const openModalWithDraft = (draft) => {
        setSelectedDraft(draft);  // Set the draft to be displayed
        setIsModalDraftOpen(true);  // Open the DraftModal specifically
    };
    
    const closeDraftModal = () => {
        setIsModalDraftOpen(false);
        setSelectedDraft(null);
        // Assuming selectedDraft is not null and contains the scriptId you need:
        if (selectedDraft && selectedDraft.scriptId) {
            toggleDraftVisibility(selectedDraft.scriptId);  // Toggle visibility to hide drafts when modal closes
        }
    };
    
    
    
    
    
   
    
    useEffect(() => {
        if (storyId) { // Ensure there is a storyId before fetching data
            fetchData();
        }
    }, [storyId]); // Depend on storyId
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
    const toggleCharacterForm = () => {
        setIsCharacterFormVisible(prev => {
            console.log("Toggling form visibility from", prev, "to", !prev);
            return !prev;
        });
    };    
    const toggleScriptForm = () => {
        setIsScriptFormVisible(prev => {
            console.log("Toggling script form visibility from", prev, "to", !prev);
            return !prev;
        });
    };

const toggleCharactersVisibility = () => {
    setShowCharacters(prev => !prev);
};

const [showCharacterControls, setShowCharacterControls] = useState(false);

const toggleCharacterControlsVisibility = () => {
    setShowCharacterControls(prev => !prev);
};
    
const [showScriptsControls, setShowScriptsControls] = useState(false);
const toggleScriptControlsVisibility = () => setShowScriptsControls(prev => !prev);


const [activeScriptId, setActiveScriptId] = useState(null); // State to track active script for generation



const fetchGeneratedScript = async (scriptId) => {
    setIsLoading(true);  // Start loading
    setActiveScriptId(scriptId);  // Ensure the activeScriptId is set when fetching
    try {
        const response = await axiosPrivate.get(`/gen/api/chat-with-openai/${scriptId}/generate`);
        setGeneratedScriptContent(response.data.generated_script);
        setIsModalOpen(true);
    } catch (error) {
        console.error('Error fetching generated script:', error);
    } finally {
        setIsLoading(false);  // Stop loading regardless of the outcome
    }
};

const fetchGeneratedScripts = async (scriptId) => {
    try {
        const response = await axiosPrivate.get(`/gen/scripts/${scriptId}/generated-scripts/`);
        setGeneratedScripts(prev => ({ ...prev, [scriptId]: response.data.data }));
    } catch (error) {
        console.error('Error fetching generated scripts:', error);
    }
};


const saveScript = async () => {
    if (!activeScriptId) {
        console.error('No active script selected');
        return;
    }
    const content = generatedScriptContent;  // The content to be saved
    try {
        const response = await axiosPrivate.post(`/gen/scripts/${activeScriptId}/save-generated-script/`, {
            content: content  // Sending JSON data
        });
        console.log(response.data.message);  // Access response data
        if (response.data.status === 'success') {
            console.log('Generated script saved successfully');
            closeModal();  // Close modal on success
            fetchGeneratedScripts(activeScriptId);  // Refresh the script data
        } else {
            console.error('Failed to save generated script:', response.data.message);  // Log error message
        }
    } catch (error) {
        console.error('Error saving generated script:', error.response ? error.response.data.message : error.message);
    }
};


const toggleDraftVisibility = (scriptId) => {
    setVisibleDrafts(prev => ({
        ...prev,
        [scriptId]: !prev[scriptId]  // Toggle the visibility
    }));
};



const handleCommit = async () => {
    if (!selectedDraft || !selectedDraft.id) {
        console.error('No draft selected or missing draft ID');
        return;
    }

    try {
        const response = await axiosPrivate.post(`/gen/api/commit-script/${selectedDraft.id}/`, {
            content: selectedDraft.content
        });
        console.log(response.data.message);
        if (response.data.status === 'success') {
            console.log('Script committed successfully');
            closeDraftModal();  // Close the modal on successful commit
        } else {
            console.error('Failed to commit script:', response.data.message);
        }
    } catch (error) {
        console.error('Error committing script:', error.response ? error.response.data.message : error.message);
    }
};


const handleDelete = async () => {
    if (!selectedDraft || !selectedDraft.id) {
        console.error('No draft selected or missing draft ID');
        return;
    }

    console.log("Attempting to delete draft with ID:", selectedDraft.id);

    try {
        const response = await axiosPrivate.delete(`/gen/generated-scripts/${selectedDraft.id}/delete/`);
        console.log("Delete response:", response.data);
        if (response.data.status === 'success') {
            console.log('Generated script deleted successfully');
            closeDraftModal();  // Close the modal on successful deletion
            fetchGeneratedScripts(activeScriptId);  // Refresh list after delete
        } else {
            console.error('Failed to delete generated script:', response.data.message);
        }
    } catch (error) {
        console.error('Error deleting generated script:', error.response ? error.response.data.message : error.message);
    }
};

const deleteScript = async (scriptId) => {
    try {
        const response = await axiosPrivate.delete(`/gen/api/scripts/${scriptId}/delete/`);
        console.log(response.data.message);
        if (response.data.status === 'success') {
            // Optionally refresh the list of scripts or handle UI updates here
            console.log('Script deleted successfully');
            fetchData();  // Assuming fetchData is a function that fetches all scripts
        } else {
            console.error('Failed to delete script:', response.data.message);
        }
    } catch (error) {
        console.error('Error deleting script:', error.response ? error.response.data.message : error.message);
    }
};


    return (
        <div className="flex flex-col mb-80 mt-10	items-center justify-center min-h-screen -mt-20" style={{ backgroundRepeat: 'no-repeat' }}>
            <div className="w-full max-w-lg px-6 py-12 text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
        <span className="text-orange-500">{story?.title}</span> 
    </h1>
    <p className="text-green-400 overflow-y-auto overflow-x-hidden bg-transparent shadow-lg rounded-lg p-4 max-w-full h-48 whitespace-normal break-words" style={{ 
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
}}>
    {story?.description}
</p>

</div>
<div className="w-full max-w-lg px-6 py-12 text-center relative">  
    <h2 onClick={toggleCharacterControlsVisibility} className="text-4xl font-bold text-white cursor-pointer flex justify-center items-center">
        <span className="text-orange-500 mb-2">Characters</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
             className={`h-6 w-6 transform transition-transform duration-200 ml-2 ${showCharacterControls ? 'rotate-180' : 'rotate-90'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l7-7-7-7" />
        </svg>
    </h2>
    {showCharacterControls && (
        <>
        <div className="text-green-400 mb-10 mt-10 overflow-y-auto overflow-x-hidden bg-transparent shadow-lg rounded-lg p-4 max-w-full whitespace-normal break-words" style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', minHeight: '12rem' /* 192px or 12rem assuming 16px is 1rem */ }}>
           
            <Select
                isMulti
                options={availableCharacters}
                className="basic-multi-select mb-7 mt-10"
                classNamePrefix="select"
                onChange={setSelectedCharacters}
                value={selectedCharacters}
                styles={customSelectStyles}
                placeholder="Link existing characters"
            />
            <div className="text-center mb-10 my-4"> 
                <button 
                    onClick={() => handleAddCharacter(selectedCharacters)} 
                    className="px-16 py-3 rounded-full text-lg font-medium text-orange-500 bg-transparent border border-orange-500 hover:bg-orange-500 hover:text-white focus:outline-none focus:shadow-outline transition duration-300"
                >
                    Add Selected Characters
                </button>
            </div>
            </div>
            <div className={`bg-transparent mb-10 shadow-lg rounded-lg p-4 max-w-full whitespace-normal break-words ${isCharacterFormVisible ? '' : 'max-h-48'}`} style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', overflowY: 'auto', minHeight: '12rem' }}>
            <button onClick={toggleCharacterForm} className="w-full mb-20 bg-transparent text-white py-2 flex items-center justify-center relative">
                <span className="text-orange-500 mt-10">Create Characters</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     className={`h-6 w-6 transform mt-10 transition-transform duration-200 ${isCharacterFormVisible ? 'rotate-180' : 'rotate-0'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l7-7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-0 w-full border-b-2 border-orange-500"></span>
            </button>
            {isCharacterFormVisible && <CharacterForm storyId={storyId} onSave={() => { console.log('Data saved'); /* Add your fetchData logic here */ }} />}
        </div>
        <div className="text-green-400 overflow-y-auto overflow-x-hidden bg-transparent shadow-lg rounded-lg p-4 max-w-full whitespace-normal break-words" style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', minHeight: '12rem' /* 192px or 12rem assuming 16px is 1rem */ }}>

    <div className="text-center mt-4">
        <button onClick={toggleCharactersVisibility} className="text-lg font-medium text-orange-500 bg-transparent hover:text-white transition duration-300">
            Show Characters in Story
        </button>
    </div>
    {showCharacters && (
        <ul className="list-none p-0">
            {characters.map(character => (
                <li key={character.id} className="bg-gray-800 text-white p-2 rounded-lg m-1">
                    {character.name}
                </li>
            ))}
        </ul>
    )}
</div>



        </>
    )}
    <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-500"></span> {/* Visual segment line */}
</div>
       




<div className="w-full max-w-lg px-6 py-12 text-center relative"> {/* Added relative for positioning */}
    <h2 onClick={toggleScriptControlsVisibility} className="text-4xl font-bold text-white cursor-pointer flex justify-center items-center">
        <span className="text-green-400">Scripts</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             className={`h-6 w-6 transform transition-transform duration-200 ml-2 ${showScriptsControls ? 'rotate-180' : 'rotate-90'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l7-7-7-7" />
        </svg>
    </h2>
    {showScriptsControls && (
        <>
           <div className="bg-transparent mb-10 mt-10 shadow-lg rounded-lg p-4 max-w-full whitespace-normal break-words" style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', minHeight: '12rem' }}>
    <button onClick={toggleScriptForm} className="w-full bg-transparent text-white py-2 flex items-center justify-center relative">
        <span className="text-green-400">Create Scripts</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             className={`h-6 w-6 transform transition-transform duration-200 ${isScriptFormVisible ? 'rotate-180' : 'rotate-90'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l7-7-7-7" />
        </svg>
        <span className="absolute bottom-0 left-0 w-full border-b-2 border-orange-500"></span>
    </button>
    {isScriptFormVisible && <CreateScriptForm storyId={storyId} onSave={fetchData} />}
</div>

<div className="bg-transparent shadow-lg rounded-lg p-4 max-w-full whitespace-normal overflow-hidden" style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', minHeight: '12rem' }}>
    <ul>
    {scripts.map(script => (
        < li key={script.id}  className="bg-gray-800 text-white p-2 rounded-lg m-1 flex flex-col relative"> {/* Added relative positioning */}
                <div className="flex justify-between mb-2 items-center relative"> {/* Added relative positioning */}
                    <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => {
                        fetchGeneratedScripts(script.id);
                        toggleDraftVisibility(script.id);
                    }}>
                        {script.title}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={`h-5 w-5 ml-2 transform transition-transform duration-200 ${
                                visibleDrafts[script.id] ? 'rotate-180' : 'rotate-0'
                            }`}
                        >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>

                    </span>
                    
                    {/* Buttons with fixed position to the right */}
                    <div className="absolute  top-0 right-0 flex items-center">
    <button
        onClick={() => fetchGeneratedScript(script.id)}
        className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300 mb-2 mr-2"
    >
        Generate
    </button>
    <button
        onClick={() => deleteScript(script.id)}
        className="px-6 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300 mb-2 mr-2"
    >
        Delete
    </button>
</div>

                    {/* End of buttons */}
                </div>
                {visibleDrafts[script.id] && generatedScripts[script.id] && (
                    <ul className="mt-4">
                        {generatedScripts[script.id].map(gs => (
                            <li key={gs.id} className="text-sm mt-2" onClick={() => openModalWithDraft(gs)}>
                                Draft from {gs.created_at}: {gs.content.substring(0, 50)}...
                            </li>
                        ))}
                        
                        <li>
                            <button onClick={() => toggleDraftVisibility(script.id)}
                                    className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300">
                                Close
                            </button>
                        </li>
                    </ul>
                )}
            </li>
        ))}
    </ul>
    <DraftModal 
        isOpen={isModalDraftOpen} 
        handleClose={closeDraftModal}
        handleCommit={() => handleCommit(selectedDraft)}
        handleDelete={() => handleDelete(selectedDraft)}
    >
        <pre style={{ whiteSpace: 'pre-wrap' }}>{selectedDraft ? selectedDraft.content : 'Loading...'}</pre>
    </DraftModal>
</div>

{isLoading && <LoadingSpinner />} 
<Modal 
    isOpen={isModalOpen} 
    handleClose={closeModal}  // Passed but does nothing if overlay click is disabled
    handleSave={saveScript}
>
    <pre style={{ whiteSpace: 'pre-wrap' }}>{generatedScriptContent}</pre>
</Modal>
        
        </>
    )}
    <span className="absolute bottom-0 left-0 w-full h-1 bg-green-400"></span> {/* Bottom line for visual segment */}
</div>

</div>
    );
}

export default StoryDetails;