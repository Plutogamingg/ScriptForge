import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/hookUrlPrivate';
import Select from 'react-select';

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
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    // Example for dynamic and accessible select change handler
    const handleSelectChange = (name) => (selectedOption) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: selectedOption ? selectedOption.value : ''
        }));
    };
    

    const handleSelectCharacters = (selectedOptions) => {
        setSelectedCharacters(selectedOptions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const characterIds = selectedCharacters.map(option => option.value); // Collect character IDs from selected options
    
        try {
            // First, create the script
            const scriptResponse = await axiosPrivate.post('/gen/script/', {
                ...formData, // Spread existing form data
                story: storyId // Ensure this matches the backend's expected field for story ID
            });
    
            console.log('Script created successfully:', scriptResponse.data);
    
            // If the script is created successfully, add characters to it
            if (scriptResponse.data && scriptResponse.data.id) {
                const addCharactersResponse = await axiosPrivate.post(`/gen/script/${scriptResponse.data.id}/add_characters/`, {
                    character_ids: characterIds // This needs to match the backend's expected field
                });
    
                console.log('Characters added to script:', addCharactersResponse.data);
                alert('Script and characters added successfully!');
            }
        } catch (error) {
            // Handle errors if the request fails
            const errorMessage = error.response?.data?.detail || 'Failed to create script. Please try again.';
            console.error('Error creating script or adding characters:', errorMessage);
            alert(errorMessage);
        }
    };
    
    


    return (
        <div className="max-w-xl mx-auto my-10 p-5 border rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" name="title" id="title" required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.title} onChange={handleChange} />
                </div>
                <div>
                <label>Characters:</label>
                <Select
                    isMulti
                    options={characters}
                    onChange={handleSelectCharacters}
                    value={selectedCharacters}
                    className="basic-multi-select"
                    classNamePrefix="select"
                />
            </div>
                <div>
                    <label htmlFor="script_genre" className="block text-sm font-medium text-gray-700">Genre</label>
                    <Select
                        name="script_genre"
                        options={dropdownChoices.genres}
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={handleSelectChange('script_genre')}
                        value={dropdownChoices.genres.find(option => option.value === formData.script_genre)}
                    />
                </div>
                <div>
                    <label htmlFor="script_setting" className="block text-sm font-medium text-gray-700">Setting</label>
                    <Select
                        name="script_setting"
                        options={dropdownChoices.settings}
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={handleSelectChange('script_setting')}
                        value={dropdownChoices.settings.find(option => option.value === formData.script_setting)}
                    />
                </div>
                <div>
                    <label htmlFor="script_period" className="block text-sm font-medium text-gray-700">Time Period</label>
                    <Select
                        name="script_period"
                        options={dropdownChoices.timePeriods}
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={handleSelectChange('script_period')}
                        value={dropdownChoices.timePeriods.find(option => option.value === formData.script_period)}
                    />
                </div>
                <div>
                    <label htmlFor="script_type" className="block text-sm font-medium text-gray-700">Story Type</label>
                    <Select
                        name="script_type"
                        options={dropdownChoices.storyTypes}
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={handleSelectChange('script_type')}
                        value={dropdownChoices.storyTypes.find(option => option.value === formData.script_type)}
                    />
                </div>
                <div>
                    <label htmlFor="script_pace" className="block text-sm font-medium text-gray-700">Pace</label>
                    <Select
                        name="script_pace"
                        options={dropdownChoices.paces}
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={handleSelectChange('script_pace')}
                        value={dropdownChoices.paces.find(option => option.value === formData.script_pace)}
                    />
                </div>
                <div>
                    <label htmlFor="script_tone" className="block text-sm font-medium text-gray-700">Story Tone</label>
                    <Select
                        name="script_tone"
                        options={dropdownChoices.storyTones}
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={handleSelectChange('script_tone')}
                        value={dropdownChoices.storyTones.find(option => option.value === formData.script_tone)}
                    />
                </div>
                <div>
                    <label htmlFor="script_style" className="block text-sm font-medium text-gray-700">Writing Style</label>
                    <Select
                        name="script_style"
                        options={dropdownChoices.writingStyles}
                        className="basic-single"
                        classNamePrefix="select"
                        onChange={handleSelectChange('script_style')}
                        value={dropdownChoices.writingStyles.find(option => option.value === formData.script_style)}
                    />
                </div>
                {/* Displaying an overview of all entered data */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mt-6">Script Overview</h3>
                    <ul className="list-disc ml-5 mt-2">
                        <li><strong>Title:</strong> {formData.title}</li>
                        <li><strong>Genre:</strong> {formData.script_genre}</li>
                        <li><strong>Setting:</strong> {formData.script_setting}</li>
                        <li><strong>Time Period:</strong> {formData.script_period}</li>
                        <li><strong>Story Type:</strong> {formData.script_type}</li>
                        <li><strong>Pace:</strong> {formData.script_pace}</li>
                        <li><strong>Story Tone:</strong> {formData.script_tone}</li>
                        <li><strong>Writing Style:</strong> {formData.script_style}</li>
                    </ul>
                </div>
                <div className="text-right">
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Save Script
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateScriptForm;