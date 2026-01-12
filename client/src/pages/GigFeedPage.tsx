// @ts-nocheck
import { useState } from 'react';
import { useGetGigsQuery } from '../features/gigs/gigsApiSlice';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const GigFeedPage = () => {
    const [search, setSearch] = useState('');
    const { data: gigs, isLoading, error } = useGetGigsQuery(search);

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Browse Gigs</h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search gigs..."
                            className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <p>Loading gigs...</p>
                ) : error ? (
                    <p className="text-red-500">Error loading gigs</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gigs?.map((gig: any) => (
                            <div key={gig._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <h2 className="text-xl font-semibold mb-2">{gig.title}</h2>
                                <p className="text-gray-600 mb-4 line-clamp-3">{gig.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-green-600">Budget: ${gig.budget}</span>
                                    <Link
                                        to={`/gigs/${gig._id}`}
                                        className="text-primary hover:text-indigo-700 font-medium"
                                    >
                                        View Details
                                    </Link>
                                </div>
                                <div className="mt-4 text-sm text-gray-500">
                                    Posted by: {gig.ownerId?.name || 'Unknown'}
                                </div>
                            </div>
                        ))}
                        {gigs?.length === 0 && <p className="text-gray-500">No gigs found.</p>}
                    </div>
                )}
            </div>
        </>
    );
};

export default GigFeedPage;
