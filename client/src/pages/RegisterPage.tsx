// @ts-nocheck
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../features/auth/usersApiSlice';
import { setCredentials } from '../features/auth/authSlice';
import { RootState } from '../app/store';
import Navbar from '../components/Navbar';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [register, { isLoading, error }] = useRegisterMutation();
    const { userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await register({ name, email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary hover:text-indigo-500">
                                Sign in
                            </Link>
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                {(error as any)?.data?.message || 'Registration failed'}
                            </div>
                        )}
                        <div className="space-y-4 rounded-md shadow-sm">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Email address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                        >
                            {isLoading ? 'Registering...' : 'Sign up'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
