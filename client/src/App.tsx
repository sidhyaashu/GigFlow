import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GigFeedPage from './pages/GigFeedPage';
import CreateGigPage from './pages/CreateGigPage';
import MyGigsPage from './pages/MyGigsPage';
import GigDetailsPage from './pages/GigDetailsPage';
import { RootState } from './app/store';

function App() {
    const { userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (userInfo) {
            const socket = io('https://gigflow-backend-production.up.railway.app');
            socket.emit('join', userInfo._id);

            socket.on('notification', (data: any) => {
                alert(data.message); // Simple alert for notification
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [userInfo]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<GigFeedPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/post-gig" element={<CreateGigPage />} />
                <Route path="/my-gigs" element={<MyGigsPage />} />
                <Route path="/gigs/:gigId" element={<GigDetailsPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
