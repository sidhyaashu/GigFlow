import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useLogoutMutation } from '../features/auth/usersApiSlice';
import { RootState } from '../app/store';

const Navbar = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApi] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logoutApi({}).unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-primary">GigFlow</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {userInfo ? (
                            <>
                                <Link to="/post-gig" className="text-gray-700 hover:text-primary">Post Gig</Link>
                                <Link to="/my-gigs" className="text-gray-700 hover:text-primary">My Gigs</Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-primary">Login</Link>
                                <Link
                                    to="/register"
                                    className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
