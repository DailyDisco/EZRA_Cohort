import { useAuth } from '@clerk/react-router';
import HeroBanner from './components/HeroBanner';
import HomePageFAQs from './components/HomePageFAQs';
import HomePageFeaturesComponent from './components/HomePageFeaturesComponent';
import { useEffect } from 'react';
import MyChatBot from './components/ChatBot';

function App() {
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                await getToken();
                // Token fetched successfully for authentication
            } catch (error) {
                console.error('Error fetching session token:', error);
            }
        };

        fetchSession();
    }, [getToken]);

    return (
        <div
            className="min-vh-100 d-flex flex-column"
            style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%)' }}
        >
            <HeroBanner />
            <main className="flex-grow-1">
                <HomePageFeaturesComponent />
                <HomePageFAQs />
            </main>
            <MyChatBot />
        </div>
    );
}

export default App;
