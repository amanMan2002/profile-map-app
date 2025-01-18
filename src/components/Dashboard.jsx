import React, { useState, useEffect } from 'react';
import profileService from '../services/profileService';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
    const [profiles, setProfiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await profileService.getProfiles();
                setProfiles(response.documents);
            } catch (error) {
                console.error('Error fetching profiles:', error);
            }
        };
        fetchProfiles();
    }, []);

    const handleAddProfile = async () => {
        try {
            const response = await profileService.createProfile({
                name,
                description,
                address,
            });
            setProfiles([...profiles, response]);
            setName('');
            setDescription('');
            setAddress('');
        } catch (error) {
            console.error('Error adding profile:', error);
        }
    };

    const handleEditProfile = (profile) => {
        setSelectedProfile(profile);
        setName(profile.name);
        setDescription(profile.description);
        setAddress(profile.address);
        setIsEditing(true);
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await profileService.updateProfile(selectedProfile.$id, {
                name,
                description,
                address,
            });
            setProfiles(profiles.map(profile => (profile.$id === selectedProfile.$id ? response : profile)));
            setSelectedProfile(null);
            setName('');
            setDescription('');
            setAddress('');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleDeleteProfile = async (id) => {
        try {
            await profileService.deleteProfile(id);
            setProfiles(profiles.filter(profile => profile.$id !== id));
        } catch (error) {
            console.error('Error deleting profile:', error);
        }
    };

    const handleCloseModal = () => {
        setSelectedProfile(null);
        setName('');
        setDescription('');
        setAddress('');
        setIsEditing(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 mb-2"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 mb-2"
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 mb-2"
                />
                {isEditing ? (
                    <button
                        onClick={handleUpdateProfile}
                        className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                    >
                        Update Profile
                    </button>
                ) : (
                    <button
                        onClick={handleAddProfile}
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        Add Profile
                    </button>
                   
                )}
                <button
                    onClick={() => navigate('/home')}
                    className="w-full mt-4 px-4 py-2 font-bold text-white bg-gray-600 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                >
                    Go to Home
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.map(profile => (
                    <div key={profile.$id} className="p-4 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-bold">{profile.name}</h2>
                        <p>{profile.description}</p>
                        <div className="mt-2">
                            <iframe
                                width="100%"
                                height="200"
                                frameBorder="0"
                                src={`https://www.google.com/maps?q=${profile.address}&output=embed`}
                                allowFullScreen
                            ></iframe>
                        </div>
                        <button
                            onClick={() => handleEditProfile(profile)}
                            className="mt-2 px-4 py-2 font-bold text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteProfile(profile.$id)}
                            className="mt-2 px-4 py-2 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {selectedProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md relative w-11/12 md:w-3/4 lg:w-1/2">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
                        >
                            &times;
                        </button>
                        <h2 className="text-3xl font-bold mb-4">Edit Profile</h2>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 mb-2"
                        />
                        <button
                            onClick={handleUpdateProfile}
                            className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                        >
                            Update Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;