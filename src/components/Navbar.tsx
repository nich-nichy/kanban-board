import { useNavigate } from 'react-router-dom'
import { LogOut, Save } from 'lucide-react';
import Cookies from "js-cookie";
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux'
import axios from 'axios';
import { useState, useEffect } from 'react';

const url = import.meta.env.VITE_BACKEND_URL;

const Navbar = () => {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const [saveBtn, setSaveBtn] = useState(false);
    const columnDetails = useSelector((state: any) => state.boardSlice.columnsState);
    const taskDetails = useSelector((state: any) => state.boardSlice.tasksState);
    const handleLogout = () => {
        Swal.fire({
            title: "Logged out",
            text: "You have been logged out",
            icon: "success"
        });
        Cookies.remove('token')
        navigate("/login");
    };
    const saveBoard = async () => {
        try {
            const saveData = await axios.post(`${url}/board/save-board`, {
                columnDetails,
                taskDetails,
                token: token
            })
            if (saveData.data.success === true) {
                Swal.fire({
                    title: "Board saved",
                    text: "Your board is saved'",
                    icon: "success"
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Something went wrong",
                    icon: "success"
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        if (columnDetails.length === 0) {
            setSaveBtn(false);
        } else if (columnDetails.length !== 0) {
            setSaveBtn(true);
        }
    }, [columnDetails])

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-end items-center h-16">
                    <div className="flex items-center gap-6">
                        {saveBtn === true ? <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg
                text-white border bg-green-500 border-green-500  hover:border-green-600 hover:bg-green-600 
                transition-colors duration-200 ease-in-out"
                            onClick={() => saveBoard()}
                        >
                            <Save size={13} />
                            <span className='text-sm'>Save</span>
                        </button> : null}

                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-lg
                text-white border bg-red-400 border-red-400 hover:border-red-500 hover:bg-red-500 
                transition-colors duration-200 ease-in-out"
                            onClick={handleLogout}
                        >
                            <LogOut size={13} />
                            <span className='text-sm'>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;