// @ts-nocheck
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useGetMyGigsQuery } from '../features/gigs/gigsApiSlice';
import Navbar from '../components/Navbar';
import { RootState } from '../app/store';

const MyGigsPage = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { data: gigs, isLoading, error } = useGetMyGigsQuery(undefined, {
        skip: !userInfo,
    });

    console.log(data)

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Posted Gigs</h1>

                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">Error loading your gigs</p>
                ) : gigs?.length === 0 ? (
                    <p>You haven't posted any gigs yet. <Link to="/post-gig" className="text-primary hover:underline">Post one now!</Link></p>
                ) : (
                    <div className="space-y-4">
                        {gigs?.map((gig: any) => (
                            <div key={gig._id} className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold">{gig.title}</h2>
                                    <p className="text-gray-500 text-sm">Posted on: {new Date(gig.createdAt).toLocaleDateString()}</p>
                                    <div className="mt-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                                    ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {gig.status}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    to={`/gigs/${gig._id}`}
                                    className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                                >
                                    Manage / View Bids
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyGigsPage;
