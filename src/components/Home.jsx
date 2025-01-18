import React, { useState, useEffect } from 'react';
import profileService from '../services/profileService';
import authService from '../services/appwrite';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
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

    const handleProfileClick = (profile) => {
        setSelectedProfile(profile);
    };

    const handleCloseModal = () => {
        setSelectedProfile(null);
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
            <div className="flex-1 text-center">
                    <h1 className="text-3xl font-bold">Profiles</h1>
                </div>
            <button
                    onClick={handleLogout}
                    className="px-4 py-2 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                    Logout
                </button>
                </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.map(profile => (
                    <div key={profile.$id} className="p-4 bg-white rounded shadow-md">
                        <h2 className="text-xl font-bold">{profile.name}</h2>
                        <p>{profile.description}</p>
                        <button
                            onClick={() => handleProfileClick(profile)}
                            className="mt-2 px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            Summary
                        </button>
                    </div>
                ))}
            </div>

            {selectedProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-md relative w-11/12 md:w-3/4 lg:w-1/2">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
                        >
                            &times;
                        </button>
                        <h2 className="text-3xl font-bold mb-4">{selectedProfile.name}</h2>
                        <p className="mb-4">{selectedProfile.description}</p>
                        <div className="mt-2">
                            <iframe
                                width="100%"
                                height="300"
                                frameBorder="0"
                                src={`https://www.google.com/maps?q=${selectedProfile.address}&output=embed`}
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;