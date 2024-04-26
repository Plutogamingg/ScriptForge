import React, { useState } from 'react';
import API_BASE_URL from '../hoc/url';

function CreateStoryForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/gen/stories/`, {  // Adjust this URL to your specific endpoint for creating a story
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // If CSRF token is needed, ensure it's included in your headers or cookie is auto-handled
                },
                body: JSON.stringify(formData),
                credentials: 'include'  // Ensures cookies are included with the request
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                const data = await response.json();
                console.log('Success:', data);
                alert('Story created successfully!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create story.');
        }
    };

    return (
        <div className="max-w-xl mx-auto my-10 p-5 border rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        required
                        rows="4"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create Story
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateStoryForm;
