import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Error = () => {
    const [timeLeft, setTimeLeft] = useState(20);
    const navigate = useNavigate();
    useEffect(() => {
        if (timeLeft === 0) {
            navigate('/')
            return;
        }
        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);
    return (
        <div className="font-opensans min-h-screen bg-white flex flex-col justify-center items-center sticky">
            <div className="max-w-md text-center bg-white p-6 rounded-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h1>
                <p className="text-gray-600 mb-6">
                    It looks like something went wrong
                </p>
            </div>
        </div>
    );
}

export default Error;
