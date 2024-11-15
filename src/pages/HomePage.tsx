import React from 'react';
import Button from '../components/Button';
import { logout } from '../redux/auth';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

const HomePage: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-12">
            <div className="text-xl font-semibold text-black mb-4 text-center sm:text-lg md:text-xl lg:text-2xl font-poppins">
                {user?.phoneNumber}
            </div>
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg font-poppins">
                <Button text="Logout" onClick={() => dispatch(logout())} />
            </div>
        </div>
    );
};

export default HomePage;
