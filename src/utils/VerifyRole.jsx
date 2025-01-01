import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;

export const useVerifyToken = () => {
    const [tempData, setTempData] = useState({
        id: "",
        username: "",
        email: "",
    });
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();
    const userToken = Cookies.get("token");

    useEffect(() => {
        const verifyCookie = async () => {
            Cookies.remove("adminToken")
            if (!userToken) {
                navigate("/login");
                return;
            }
            try {
                const { data } = await axios.post(
                    `${url}/verify-token`,
                    { token: userToken },
                    { withCredentials: true }
                );
                if (data.status) {
                    setTempData({
                        id: data.id,
                        username: data.user,
                        email: data.email,
                    })
                } else {
                    Cookies.remove("token");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error verifying user", error);
                Cookies.remove("token");
                navigate("/login");
            } finally {
                setIsVerified(true);
            }
        };

        verifyCookie();
    }, [userToken, navigate]);

    return { id: tempData?.id, username: tempData?.username, isVerified: tempData?.isVerified, userEmail: tempData?.email };
};
