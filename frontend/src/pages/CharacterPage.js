import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/hookUrlPrivate';
import Select, { components } from 'react-select';
import Modal from 'react-modal';
import { customSelectStyles } from '../styles/dropdown';

Modal.setAppElement('#root');


function CreateCharacterForm({ onSave, storyId }) {
    const axiosPrivate = useAxiosPrivate();
    const [formData, setFormData] = useState({
        name: '',
        character_type: '',
        backstory: '',
        char_context: '',
        traits: []
    });
    const [traits, setTraits] = useState([]);
    const [characterTypes, setCharacterTypes] = useState([]);
    const [backstoryOptions, setBackstoryOptions] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const traitObjects = formData.traits.map(trait => ({ description: trait.value }));
            const completeFormData = {
                ...formData,
                traits: traitObjects,
                storyId
            };
            const response = await axiosPrivate.post('/gen/character/', completeFormData);
            console.log('Success:', response.data);
            if (onSave) {
                onSave(response.data);
            }
            setIsOpen(true);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data.detail : error.message);
            alert('Failed to create character. Please try again.');
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

  const handleDescChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));

    if (name === 'char_context') {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    }
};

    return (
        <>
<main className="flex flex-col items-center justify-center min-h-screen" style={{
            backgroundRepeat: 'no-repeat',
          }}>                <div className="w-full max-w-lg px-6 py-12 text-center">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        <span className="text-orange-500">CHARACTER </span>
                        <span className="text-green-400 text-accent">CREATE</span>

                    </h2>
                </div>
                <div className="w-full max-w-xl mx-auto p-5 border border-orange-500 border-transparent rounded-lg bg-transparent">
                    <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
    <label htmlFor="name" className="block text-sm font-medium text-gray-700"></label>
    <input
    type="text"
    name="name"
    id="name"
    required
    className="inputName" // Use the class name directly as a string
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
    placeholder="Enter Name"
/>








</div>


<div>
    <label htmlFor="character_type" className="block text-sm font-medium text-gray-700"></label>
    <Select
        name="character_type"
        options={characterTypes}
        className="basic-single text-white"
        classNamePrefix="select"
        components={{ DropdownIndicator }}
        onChange={(selectedOption) => setFormData({ ...formData, character_type: selectedOption.value })}
        value={characterTypes.find(option => option.value === formData.character_type)}
        styles={customSelectStyles}
        placeholder="Character Type"
    />
</div>


<div>
    <label htmlFor="backstory" className="block text-sm font-medium text-gray-700"></label>
    <Select
        name="backstory"
        options={backstoryOptions}
        className="basic-single text-white"
        classNamePrefix="select"
        components={{ DropdownIndicator }}
        onChange={(selectedOption) => setFormData({ ...formData, backstory: selectedOption.value })}
        value={backstoryOptions.find(option => option.value === formData.backstory)}
        styles={customSelectStyles}
        placeholder="Backstory" // Sets the placeholder text before selection
    />
</div>
<div>
    <label htmlFor="traits" className="block text-sm font-medium text-gray-700"></label>
    <Select
        isMulti
        name="traits"
        options={traits}
        className="basic-multi-select text-white"
        classNamePrefix="select"
        components={{ DropdownIndicator }}
        onChange={(selectedOptions) => setFormData({ ...formData, traits: selectedOptions || [] })}
        value={formData.traits}
        styles={customSelectStyles}
        placeholder="Traits" // Sets the placeholder text before selection
    />
</div>
<div>
                            <label htmlFor="char_context" className="sr-only">Script Context</label>
                            <textarea
                                name="char_context"
                                id="char_context"
                                required
                                rows="1"
                                className="inputName"
                                placeholder="Description"
                                value={formData.char_context}
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







            </main>
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
                contentLabel="Character Overview"
            >
                <h2>Character Overview</h2>
                <ul>
                    <li><strong>Name:</strong> {formData.name}</li>
                    <li><strong>Type:</strong> {formData.character_type}</li>
                    <li><strong>Backstory:</strong> {formData.backstory}</li>
                    <li><strong>Traits:</strong> {formData.traits.map(trait => trait.label).join(', ')}</li>
                </ul>
                <button onClick={closeModal} className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded">Close</button>
            </Modal>
        </>
    );
}

export default CreateCharacterForm;
