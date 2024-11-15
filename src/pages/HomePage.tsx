import React from 'react';
import { useSelector } from 'react-redux';
import Button from '../components/Button';
import { auth } from '../firebase';
import { logout } from '../redux/authSlice';
import { useDispatch } from 'react-redux';

const HomePage: React.FC = () => {
    const dispatch = useDispatch();

    const phoneNumber = useSelector((state: any) => state.auth.phoneNumber);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            dispatch(logout());
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };


    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-12">
            <div className="text-xl font-semibold text-black mb-4 text-center sm:text-lg md:text-xl lg:text-2xl font-poppins">
                {phoneNumber}
            </div>
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg font-poppins">
                <Button text="Logout" onClick={handleLogout} />
            </div>
        </div>
    );
};

export default HomePage;
