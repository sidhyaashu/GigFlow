// @ts-nocheck
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetGigByIdQuery } from '../features/gigs/gigsApiSlice';
import {
    useGetGigBidsQuery,
    useSubmitBidMutation,
    useHireFreelancerMutation,
} from '../features/bids/bidsApiSlice';
import Navbar from '../components/Navbar';
import { RootState } from '../app/store';

const GigDetailsPage = () => {
    const { gigId } = useParams();
    const { userInfo } = useSelector((state: RootState) => state.auth);

    const { data: gig, isLoading: isGigLoading } = useGetGigByIdQuery(gigId, {
        skip: !gigId,
    });

    const isOwner = userInfo && gig && userInfo._id === gig.ownerId._id;
    const isFreelancer = userInfo && gig && userInfo._id !== gig.ownerId._id;

    // Bidding State
    const [message, setMessage] = useState('');
    const [price, setPrice] = useState('');
    const [submitBid, { isLoading: isSubmittingBid }] = useSubmitBidMutation();
    const [submitError, setSubmitError] = useState('');

    // Owner: Fetch Bids
    const { data: bids, isLoading: isBidsLoading } = useGetGigBidsQuery(gigId, {
        skip: !isOwner,
    });

    // Hiring
    const [hireFreelancer] = useHireFreelancerMutation();

    const handleBidSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!price || !message) {
                setSubmitError('Please fill in all fields');
                return;
            }
            await submitBid({ gigId, message, price: Number(price) }).unwrap();
            setMessage('');
            setPrice('');
            setSubmitError('');
            // Optionally notify success
        } catch (err: any) {
            setSubmitError(err?.data?.message || 'Failed to place bid');
        }
    };

    const handleHire = async (bidId: string) => {
        try {
            await hireFreelancer({ bidId }).unwrap();
            // Success handled by RTK Query invalidation handling status updates
        } catch (err) {
            console.error(err);
        }
    };

    if (isGigLoading) return <div className="p-8">Loading...</div>;
    if (!gig) return <div className="p-8">Gig not found</div>;

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow rounded-lg p-6 mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{gig.title}</h1>
                            <p className="text-gray-500 mb-4">Posted by: {gig.ownerId.name}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold uppercase text-sm 
                ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {gig.status}
                        </div>
                    </div>
                    <p className="text-gray-700 text-lg mb-6">{gig.description}</p>
                    <div className="text-2xl font-bold text-gray-900">Budget: ${gig.budget}</div>
                </div>

                {/* Freelancer View: Place Bid */}
                {isFreelancer && gig.status === 'open' && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Place a Bid</h2>
                        {submitError && <p className="text-red-500 mb-4">{submitError}</p>}
                        <form onSubmit={handleBidSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                                <textarea
                                    rows={4}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Why are you the best fit for this job?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bid Price ($)</label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmittingBid}
                                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 disabled:opacity-50"
                            >
                                {isSubmittingBid ? 'Submitting...' : 'Submit Proposal'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Owner View: Review Bids */}
                {isOwner && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-6">Proposals ({bids?.length || 0})</h2>
                        {isBidsLoading ? (
                            <p>Loading proposals...</p>
                        ) : bids?.length === 0 ? (
                            <p>No proposals yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {bids?.map((bid: any) => (
                                    <div key={bid._id} className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold">{bid.freelancerId.name}</h3>
                                            <p className="text-gray-600 mb-2">{bid.message}</p>
                                            <p className="font-semibold text-primary">Bid: ${bid.price}</p>
                                            <p className="text-sm text-gray-400 mt-1">Status: {bid.status}</p>
                                        </div>
                                        <div>
                                            {bid.status === 'pending' && gig.status === 'open' && (
                                                <button
                                                    onClick={() => handleHire(bid._id)}
                                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                                >
                                                    Hire
                                                </button>
                                            )}
                                            {bid.status === 'hired' && (
                                                <span className="text-green-600 font-bold px-4 py-2 border border-green-600 rounded">Hired</span>
                                            )}
                                            {bid.status === 'rejected' && (
                                                <span className="text-red-500 font-bold px-4 py-2">Rejected</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default GigDetailsPage;
