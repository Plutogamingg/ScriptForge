import React, { useState } from 'react';

function CreateCharacterForm() {
    const [formData, setFormData] = useState({
        name: '',
        characterType: '',
        backstory: '',
        traits: []
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTraitChange = (e) => {
        const options = e.target.options;
        let value = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setFormData({ ...formData, traits: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data:', formData);
        // Here you would typically send the formData to the backend via an API
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
                <div>
                    <label htmlFor="traits" className="block text-sm font-medium text-gray-700">Traits</label>
                    <select
                        multiple
                        name="traits"
                        id="traits"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={handleTraitChange}
                    >
                        {/* Placeholder for trait options. Replace with dynamic loading of traits */}
                        <option value="brave">Brave</option>
                        <option value="loyal">Loyal</option>
                        <option value="clever">Clever</option>
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
