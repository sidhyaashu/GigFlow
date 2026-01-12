import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCreateGigMutation } from '../features/gigs/gigsApiSlice';
import Navbar from '../components/Navbar';
import { RootState } from '../app/store';

const CreateGigPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');

    const navigate = useNavigate();
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const [createGig, { isLoading }] = useCreateGigMutation();

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createGig({ title, description, budget: Number(budget) }).unwrap();
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Post a New Gig</h1>
                <form onSubmit={submitHandler} className="space-y-6 bg-white p-8 rounded-lg shadow">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Job Title</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            required
                            rows={4}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Budget ($)</label>
                        <input
                            type="number"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
                    >
                        {isLoading ? 'Posting...' : 'Post Job'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default CreateGigPage;
