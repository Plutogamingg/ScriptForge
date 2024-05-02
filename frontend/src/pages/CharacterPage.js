import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/hookUrlPrivate';
import Select from 'react-select';

function CreateCharacterForm({ onSave, storyId }) {
    const axiosPrivate = useAxiosPrivate();
    const [formData, setFormData] = useState({
        name: '',
        character_type: '',
        backstory: '',
        traits: []
    });
    const [traits, setTraits] = useState([]);
    const [characterTypes, setCharacterTypes] = useState([]);
    const [backstoryOptions, setBackstoryOptions] = useState([]);


    useEffect(() => {
        const fetchDropdownOptions = async () => {
            try {
                const response = await axiosPrivate.get('/gen/dropdown-choices');
                setTraits(response.data.character_traits_choices.map(trait => ({
                    value: trait.value,
                    label: trait.key
                })));
                setCharacterTypes(response.data.character_type_choices.map(type => ({
                    value: type.value,
                    label: type.key
                })));
                setBackstoryOptions(response.data.character_backstory_choices.map(backstory => ({
                    value: backstory.value,
                    label: backstory.key
                })));
            } catch (error) {
                console.error('Failed to fetch dropdown options:', error);
            }
        };
    
        fetchDropdownOptions();
    }, [axiosPrivate]);
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTraitChange = (selectedOptions) => {
        setFormData({ ...formData, traits: selectedOptions || [] });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Assuming backend expects each trait as an object with 'description'
            const traitObjects = formData.traits.map(trait => ({ description: trait.value }));
    
            const completeFormData = {
                ...formData,
                traits: traitObjects,  // Sending each trait as an object
                storyId  // Include storyId in the payload if needed
            };
    
            const response = await axiosPrivate.post('/gen/character/', completeFormData);
            console.log('Success:', response.data);
            alert('Character created successfully!');
            if (onSave) {
                onSave(response.data);  // Optional callback
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data.detail : error.message);
            alert('Failed to create character. Please try again.');
        }
    };
    


    return (
        <div className="max-w-xl mx-auto my-10 p-5 border rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
    <label htmlFor="character_type" className="block text-sm font-medium text-gray-700">Character Type</label>
    <Select
    name="character_type"
    options={characterTypes}
    className="basic-single"
    classNamePrefix="select"
    onChange={(selectedOption) => setFormData({ ...formData, character_type: selectedOption.value })}
    value={characterTypes.find(option => option.value === formData.character_type)}
/>

</div>
<div>
    <label htmlFor="backstory" className="block text-sm font-medium text-gray-700">Backstory</label>
    <Select
    name="backstory"
    options={backstoryOptions}
    className="basic-single"
    classNamePrefix="select"
    onChange={(selectedOption) => setFormData({ ...formData, backstory: selectedOption.value })}
    value={backstoryOptions.find(option => option.value === formData.backstory)}
/>

</div>
                {/* Other form fields */}
                <div>
    <label htmlFor="traits" className="block text-sm font-medium text-gray-700">Traits</label>
    <Select
        isMulti
        name="traits"
        options={traits}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleTraitChange}
        value={formData.traits} // This should display the selected traits correctly
    />
</div>
                 {/* Displaying an overview of all entered data */}
                 <div>
                    <h3 className="text-lg font-semibold text-gray-800 mt-6">Character Overview</h3>
                    <ul className="list-disc ml-5 mt-2">
                        <li><strong>Name:</strong> {formData.name}</li>
                        <li><strong>Type:</strong> {formData.character_type}</li>
                        <li><strong>Backstory:</strong> {formData.backstory}</li>
                        <li><strong>Traits:</strong> {formData.traits.map(trait => trait.label).join(', ')}</li>
                    </ul>
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save Character
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateCharacterForm;
