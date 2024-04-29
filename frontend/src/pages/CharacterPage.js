import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/hookUrlPrivate';

function CreateCharacterForm() {
    const axiosPrivate = useAxiosPrivate();
    const [formData, setFormData] = useState({
        name: '',
        characterType: '',
        backstory: '',
        traits: []
    });
    const [traits, setTraits] = useState([]);

    useEffect(() => {
        const fetchTraits = async () => {
            try {
                const response = await axiosPrivate.get('/gen/dropdown-choices');
                // Assuming `character_traits_choices` is the key for traits in the response
                setTraits(response.data.character_traits_choices);
            } catch (error) {
                console.error('Failed to fetch traits:', error);
            }
        };

        fetchTraits();
    }, [axiosPrivate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTraitChange = (e) => {
        // Using Array.from to create an array from the selected options
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prevFormData => ({
            ...prevFormData,
            traits: selectedOptions  // Update traits in state to the array of selected options
        }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosPrivate.post('/gen/character', formData);
            console.log('Success:', response.data);
            alert('Character created successfully!');
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
                    <label htmlFor="characterType" className="block text-sm font-medium text-gray-700">Character Type</label>
                    <input
                        type="text"
                        name="characterType"
                        id="characterType"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.characterType}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="backstory" className="block text-sm font-medium text-gray-700">Backstory</label>
                    <textarea
                        name="backstory"
                        id="backstory"
                        required
                        rows="4"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.backstory}
                        onChange={handleChange}
                    ></textarea>
                </div>
                {/* Other form fields */}
                <div>
    <label htmlFor="traits" className="block text-sm font-medium text-gray-700">Traits</label>
    <select
        multiple
        name="traits"
        id="traits"
        required
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={formData.traits}
        onChange={handleTraitChange}
    >
        {traits.map(trait => (
            <option key={trait.key} value={trait.key}>
                {trait.value}
            </option>
        ))}
    </select>
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
