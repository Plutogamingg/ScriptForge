import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/hookUrlPrivate';
import LoadingSpinner from '../components/LoadingSpinner';

function CreateStoryForm() {
    const axiosPrivate = useAxiosPrivate();
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [isLoading, setIsLoading] = useState(false); // Add a loading state
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));

        if (name === 'description') {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading to true when the form submission starts
        try {
            const response = await axiosPrivate.post('/gen/stories/', formData);
            console.log('Success:', response.data);
            alert('Story created successfully!');
            navigate('/story-dashboard');
        } catch (error) {
            console.error('Error:', error.response ? `${error.response.data.detail}` : error.message);
            alert('Failed to create story. Please try again.');
        } finally {
            setIsLoading(false); // Set loading to false after the request is finished
        }
    };

    return (
        <>
            {isLoading && <LoadingSpinner />} {/* Display the loading spinner when isLoading is true */}
            <main className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundRepeat: 'no-repeat' }}>
                <div className="w-full max-w-lg px-6 py-12 text-center">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        <span className="text-orange-500">STORY </span>
                        <span className="text-green-400">CREATE</span>
                    </h2>
                </div>
                <div className="w-full max-w-xl mx-auto p-5 border border-transparent rounded-lg bg-transparent">
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
                            <label htmlFor="description" className="sr-only">Description</label>
                            <textarea
                                name="description"
                                id="description"
                                required
                                rows="1"
                                className="inputName"
                                placeholder="Description"
                                value={formData.description}
                                onChange={handleChange}
                                style={{ overflow: 'hidden', resize: 'none' }}
                            ></textarea>
                        </div>
                        <div className="flex justify-center w-full px-4 mt-8 mb-20">
                            <button
                                type="submit"
                                className="px-16 py-3 rounded-full text-lg font-medium text-black bg-orange-500 hover:bg-orange-600 focus:outline-none focus:shadow-outline transition duration-300"
                            >
                                Create Story
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

export default CreateStoryForm;

