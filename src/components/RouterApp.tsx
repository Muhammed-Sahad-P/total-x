import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import VerifyOtp from '../pages/VerifyOtp';
import RegistrationPage from '../pages/RegistrationPage';
import ProtectedRoute from '../routes/ProtectedRoute';
import HomePage from '../pages/HomePage';

const RouterApp = () => {


    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path='/verify-otp' element={<VerifyOtp />} />
                <Route path='/register' element={<RegistrationPage />} />
                <Route
                    path='/home'
                    element={
                        // <ProtectedRoute>
                        <HomePage />
                        // </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};
export default RouterApp
