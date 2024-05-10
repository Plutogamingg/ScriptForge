import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/hookUrlPrivate';
import Select, { components } from 'react-select';
import Modal from 'react-modal';
import { customSelectStyles } from '../styles/dropdown';

Modal.setAppElement('#root');

function CreateScriptForm({ storyId }) {
    const axiosPrivate = useAxiosPrivate();
    const { scriptId } = useParams(); // Retrieve scriptId from URL if available
    const [characters, setCharacters] = useState([]);
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        script_genre: '',
        script_setting: '',
        script_period: '',
        script_style: '',
        script_pace: '',
        script_tone: '',
        script_type: '',
        script_context: '',
        story: storyId // Set story ID in formData
    });
    const [dropdownChoices, setDropdownChoices] = useState({
        genres: [],
        settings: [],
        timePeriods: [],
        storyTypes: [],
        paces: [],
        storyTones: [],
        writingStyles: []
    });
    const [modalIsOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Assuming scriptId is defined in your component's state and you are in a context where scriptId is relevant
                const scriptIdParam = scriptId ? `?script_id=${scriptId}` : '';
                const responses = await Promise.all([
                    axiosPrivate.get('/gen/dropdown-choices'),
                    axiosPrivate.get(`/gen/stories/${storyId}/available_characters${scriptIdParam}/`) // Modified to use the new endpoint
                ]);
                setDropdownChoices({
                    genres: responses[0].data.genre_choices.map(choice => ({ value: choice.value, label: choice.key })),
                    settings: responses[0].data.setting_choices.map(choice => ({ value: choice.value, label: choice.key })),
                    timePeriods: responses[0].data.time_period_choices.map(choice => ({ value: choice.value, label: choice.key })),
                    storyTypes: responses[0].data.story_type_choices.map(choice => ({ value: choice.value, label: choice.key })),
                    paces: responses[0].data.pace_choices.map(choice => ({ value: choice.value, label: choice.key })),
                    storyTones: responses[0].data.story_tone_choices.map(choice => ({ value: choice.value, label: choice.key })),
                    writingStyles: responses[0].data.writing_style_choices.map(choice => ({ value: choice.value, label: choice.key }))
                });
                setCharacters(responses[1].data.map(char => ({
                    value: char.id,
                    label: char.name
                })));
            } catch (error) {
                console.error('Failed to fetch choices or characters:', error);
            }
        };
    
        fetchData();
    }, [axiosPrivate, storyId, scriptId]); // Include scriptId in the dependency array to re-fetch when it changes
    
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => {
            console.log('Updating text field:', name, value);
            return {
                ...prevState,
                [name]: value
            };
        });
    };
    
    const handleSelectChange = (name) => (selectedOption) => {
        console.log('Updating dropdown:', name, selectedOption);
        setFormData(prevState => ({
            ...prevState,
            [name]: selectedOption ? selectedOption.value : ''
        }));
    };
    
    

    const handleSelectCharacters = (selectedOptions) => {
        setSelectedCharacters(selectedOptions);
    };
    const [scripts, setScripts] = useState([]); // State to store scripts


    const fetchScripts = async () => {
        try {
            const response = await axiosPrivate.get(`/gen/stories/${storyId}/script`);
            if (response.status === 200) {
                setScripts(response.data); // Update local state with fetched scripts
            }
        } catch (error) {
            console.error('Failed to fetch scripts:', error);
        }
    };
    

    useEffect(() => {
        fetchScripts();
    }, [storyId]); // Re-fetch scripts when storyId changes
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Submitting form data:', formData);
        const characterIds = selectedCharacters.map(option => option.value);
    
        try {
            const scriptResponse = await axiosPrivate.post('/gen/script/', { ...formData, story: storyId });
            if (scriptResponse.data && scriptResponse.data.id) {
                await axiosPrivate.post(`/gen/script/${scriptResponse.data.id}/add_characters/`, {
                    character_ids: characterIds
                });
                alert('Script and characters added successfully!');
                fetchScripts(); // Refresh local script list
            }
        } catch (error) {
            console.error('Error creating script:', error);
            alert('Failed to create script. Please try again.');
        }
    };
    
    
    const handleDescChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'script_context') {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        }
    };
    
    const closeModal = () => {
        setIsOpen(false);
    };

    const toggleModal = () => {
        setIsOpen(!modalIsOpen);
    };

    // Custom dropdown indicator
const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 7.5L10 12.5L15 7.5" stroke="#0BF1B7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </components.DropdownIndicator>
    );
  };

  return (
    <>
        <main className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundRepeat: 'no-repeat' }}>
            <div className="w-full max-w-lg px-6 py-12 text-center">
                <h2 className="text-5xl font-bold text-white mb-6">
                    <span className="text-orange-500">SCRIPT </span>
                    <span className="text-green-400">CREATE</span>
                </h2>
            </div>
            <div className="w-full max-w-xl mx-auto p-5 border border-orange-500 border-transparent rounded-lg bg-transparent">
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
    <label htmlFor="title" className="sr-only">Title</label>
    <input
        type="text"
        name="title"
        id="title"
        required
        className="inputName"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
    />
</div>





                    <div>
                        <Select
                            isMulti
                            name="characters"
                            options={characters}
                            onChange={handleSelectCharacters}
                            value={selectedCharacters}
                            className="basic-multi-select text-white"
                            classNamePrefix="select"
                            styles={customSelectStyles}
                            components={{ DropdownIndicator }}
                            placeholder="Select Characters"
                        />
                    </div>
                    <div>
    <Select
        name="script_genre"
        options={dropdownChoices.genres}
        onChange={handleSelectChange('script_genre')}
        value={dropdownChoices.genres.find(option => option.value === formData.script_genre)}
        className="basic-single text-white"
        classNamePrefix="select"
        styles={customSelectStyles}
        placeholder="Select Genre"
    />
</div>
<div>
    <Select
        name="script_setting"
        options={dropdownChoices.settings}
        onChange={handleSelectChange('script_setting')}
        value={dropdownChoices.settings.find(option => option.value === formData.script_setting)}
        className="basic-single text-white"
        classNamePrefix="select"
        styles={customSelectStyles}
        placeholder="Select Setting"
    />
</div>
<div>
    <Select
        name="script_period"
        options={dropdownChoices.timePeriods}
        onChange={handleSelectChange('script_period')}
        value={dropdownChoices.timePeriods.find(option => option.value === formData.script_period)}
        className="basic-single text-white"
        classNamePrefix="select"
        styles={customSelectStyles}
        placeholder="Select Time Period"
    />
</div>
<div>
    <Select
        name="script_style"
        options={dropdownChoices.writingStyles}
        onChange={handleSelectChange('script_style')}
        value={dropdownChoices.writingStyles.find(option => option.value === formData.script_style)}
        className="basic-single text-white"
        classNamePrefix="select"
        styles={customSelectStyles}
        placeholder="Select Writing Style"
    />
</div>
<div>
    <Select
        name="script_pace"
        options={dropdownChoices.paces}
        onChange={handleSelectChange('script_pace')}
        value={dropdownChoices.paces.find(option => option.value === formData.script_pace)}
        className="basic-single text-white"
        classNamePrefix="select"
        styles={customSelectStyles}
        placeholder="Select Pace"
    />
</div>
<div>
    <Select
        name="script_tone"
        options={dropdownChoices.storyTones}
        onChange={handleSelectChange('script_tone')}
        value={dropdownChoices.storyTones.find(option => option.value === formData.script_tone)}
        className="basic-single text-white"
        classNamePrefix="select"
        styles={customSelectStyles}
        placeholder="Select Tone"
    />
</div>
<div>
    <Select
        name="script_type"
        options={dropdownChoices.storyTypes}
        onChange={handleSelectChange('script_type')}
        value={dropdownChoices.storyTypes.find(option => option.value === formData.script_type)}
        className="basic-single text-white"
        classNamePrefix="select"
        styles={customSelectStyles}
        placeholder="Select Type"
    />
</div>
<div>
                            <label htmlFor="script_context" className="sr-only">Script Context</label>
                            <textarea
                                name="script_context"
                                id="script_context"
                                required
                                rows="1"
                                className="inputName"
                                placeholder="Description"
                                value={formData.script_context}
                                onChange={handleDescChange}
                                style={{ overflow: 'hidden', resize: 'none' }}
                            ></textarea>
                        </div>
                    
                </form>
                </div>
                <div className="flex justify-between px-4 mt-8 mb-20 w-full">
    <button
        type="submit"
        className="flex-1 mx-2 text-lg font-medium text-black bg-orange-500 hover:bg-orange-600 hover:text-white focus:outline-none focus:shadow-outline transition duration-300"
        style={{ padding: '1rem 0' }} // Responsive padding
        onClick={handleSubmit}
    >
        CREATE
    </button>
    <button
        type="button"
        className="flex-1 mx-2 text-lg font-medium text-orange-500 bg-transparent border border-orange-500 hover:bg-orange-500 hover:text-white focus:outline-none focus:shadow-outline transition duration-300"
        style={{ padding: '1rem 0' }} // Responsive padding
        onClick={toggleModal}
    >
        OVERVIEW
    </button>
</div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        background: '#1a1a2e',
                        color: 'white',
                        border: '1px solid #e94560',
                    }
                }}
                contentLabel="Script Overview"
            >
                <h2>Script Overview</h2>
                <ul>
                    {Object.keys(formData).map(key => (
                        <li key={key}><strong>{key.replace('_', ' ').toUpperCase()}:</strong> {formData[key]}</li>
                    ))}
                </ul>
                <button onClick={closeModal} className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded">Close</button>
            </Modal>
        </main>
    </>
);



}

export default CreateScriptForm;