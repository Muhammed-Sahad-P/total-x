import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import authError from '../redux/Slice/userSlice';
import authStatus from '../redux/Slice/userSlice';
import Button from '../components/Button';
import Input from '../components/Input';
import { Link } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    agree: boolean;
}

const RegistrationPage: React.FC = () => {
    const dispatch = useDispatch();

    const formik = useFormik<FormValues>({
        initialValues: { firstName: '', lastName: '', email: '', phone: '', agree: false },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First name is required'),
            lastName: Yup.string().required('Last name is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            phone: Yup.string().matches(/^[0-9]{10}$/, 'Must be a valid phone number').required('Phone number is required'),
            agree: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions').required('Agreement is required'),
        }),
        onSubmit: async (values, { setSubmitting, setStatus }) => {
            try {
                await addDoc(collection(db, 'users'), {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phone: values.phone,
                    agreedToTerms: values.agree,
                    createdAt: new Date(),
                });
                alert('Registration successful!');
                setStatus({ success: true });
                formik.resetForm();
            } catch (error) {
                console.error('Error adding document: ', error);
                setStatus({ error: 'Registration failed. Please try again.' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="relative flex min-h-screen flex-col lg:flex-row">
            {/* Left section with image */}
            <div className="w-full lg:w-1/2 flex justify-center items-center p-4">
                <img src="/Registration.png" alt="signup" className="w-auto h-auto max-h-[600px] object-contain" />
            </div>

            {/* Right section with form */}
            <div className="absolute top-5 right-10 p-4">
                <img src="/totalxIcon.png" alt="Icon" className="w-auto h-auto max-h-[100px]" />
            </div>

            <div className="w-full lg:w-1/2 p-8 flex justify-center items-start bg-white">
                <div className="w-full max-w-lg mt-8 lg:mt-36">
                    <h2 className="text-3xl font-bold text-gray-800">Sign Up</h2>
                    <p className="mt-2 text-gray-600">Let's get you all set up so you can access your personal account</p>

                    {/* Display Success or Error Message */}
                    {formik.status?.success && (
                        <div className="text-green-500 text-sm mt-4">Registration successful! Please log in.</div>
                    )}
                    {formik.status?.error && (
                        <div className="text-red-500 text-sm mt-4">{formik.status.error}</div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="mt-6">
                        {/* First and Last Name Inputs */}
                        <div className="flex flex-col lg:flex-row mb-4 space-y-4 lg:space-x-4 lg:space-y-0">
                            <div className="w-full lg:w-1/2 relative">
                                <Input
                                    name="firstName"
                                    label="First Name"
                                    type="text"
                                    placeholder="Enter your first name"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    error={formik.errors.firstName && formik.touched.firstName ? formik.errors.firstName : undefined}
                                />
                            </div>

                            <div className="w-full lg:w-1/2 relative">
                                <Input
                                    name="lastName"
                                    label="Last Name"
                                    type="text"
                                    placeholder="Enter your last name"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    error={formik.errors.lastName && formik.touched.lastName ? formik.errors.lastName : undefined}
                                />
                            </div>
                        </div>

                        {/* Email and Phone Inputs */}
                        <div className="flex flex-col lg:flex-row mb-4 space-y-4 lg:space-x-4 lg:space-y-0">
                            <div className="w-full lg:w-1/2 relative">
                                <Input
                                    name="email"
                                    label="Email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.errors.email && formik.touched.email ? formik.errors.email : undefined}
                                />
                            </div>

                            <div className="w-full lg:w-1/2 relative">
                                <Input
                                    name="phone"
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    error={formik.errors.phone && formik.touched.phone ? formik.errors.phone : undefined}
                                />
                            </div>
                        </div>

                        {/* Terms and Conditions Agreement */}
                        <div className="mb-4 flex items-center">
                            <input
                                id="agree"
                                type="checkbox"
                                name="agree"
                                checked={formik.values.agree}
                                onChange={formik.handleChange}
                                className="h-4 w-4 text-blue-500 focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="agree" className="ml-2 text-gray-700 text-sm">
                                I agree to the <Link to="/terms" className="text-red-500 hover:underline">Terms</Link> and <Link to="/privacy" className="text-red-500 hover:underline">Privacy Policy</Link>.
                            </label>
                            {formik.errors.agree && <div className="text-red-500 text-sm mt-1">{formik.errors.agree}</div>}
                        </div>

                        <Button
                            type="submit"
                            text={formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
                            width="w-full"
                            height="h-12"
                            loading={formik.isSubmitting}
                        />
                    </form>

                    {/* Login Redirect */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600 font-poppins text-sm">
                            Already have an account? <Link to="/" className="text-red-500 font-semibold">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;
