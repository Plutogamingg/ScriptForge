import React, { useState } from 'react';

function CreateScriptForm() {
    const [formData, setFormData] = useState({
        title: '',
        genre: '',
        setting: '',
        timePeriod: '',
        storyType: '',
        pace: '',
        storyTone: '',
        writingStyle: ''
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data:', formData);
        // Here you would typically send the formData to the backend via an API
    };

    return (
        <div className="max-w-xl mx-auto my-10 p-5 border rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" name="title" id="title" required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.title} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
                    <input type="text" name="genre" id="genre" required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.genre} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="setting" className="block text-sm font-medium text-gray-700">Setting</label>
                    <input type="text" name="setting" id="setting" required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.setting} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-700">Time Period</label>
                    <input type="text" name="timePeriod" id="timePeriod" required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.timePeriod} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="storyType" className="block text-sm font-medium text-gray-700">Story Type</label>
                    <input type="text" name="storyType" id="storyType" required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.storyType} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="pace" className="block text-sm font-medium text-gray-700">Pace</label>
                    <input type="text" name="pace" id="pace" required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.pace} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="storyTone" className="block text-sm font-medium text-gray-700">Story Tone</label>
                    <input type="text" name="storyTone" id="storyTone" required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.storyTone} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="writingStyle" className="block text-sm font-medium text-gray-700">Writing Style</label>
                    <input type="text" name="writingStyle" id="writingStyle" required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.writingStyle} onChange={handleChange} />
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
