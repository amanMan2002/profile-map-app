import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/appwrite';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async () => {
        setLoading(true);
        try {
            await authService.createAccount({ email, password, name });
            navigate('/home');
        } catch (error) {
            console.error('Error signing up:', error);
            setError('Error signing up. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-2xl font-bold">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">Sign Up</h2>
                {error && <p className="text-red-500">{error}</p>}
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                        onClick={handleSignUp}
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        Sign Up
                    </button>
                    <div className="text-center">
                        <p>Already have an account?</p>
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                        <p>Admin?</p>
                        <Link to="/admin-login" className="text-blue-600 hover:underline">
                            Admin Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;