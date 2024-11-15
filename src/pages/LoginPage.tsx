import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { sendOtp } from '../redux/authSlice';
import Button from '../components/Button';
import Input from '../components/Input';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { phone: "" },
    validationSchema: Yup.object({
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Must be a valid phone number")
        .required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      console.log("hi")
      dispatch(sendOtp(values.phone));
      navigate("/verify-otp");
    },
  });

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="absolute top-0 left-0 m-6">
        <img src="/totalxIcon.png" alt="Total X" className="w-16 h-16 ml-8 mt-6" />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl p-8">
        <div className="w-full md:w-1/2 pr-0 md:pr-8 flex flex-col justify-center mb-8 md:mb-0">
          <h2 className="text-2xl sm:text-3xl font-semibold text-black mb-4 text-center md:text-left font-poppins">Login</h2>
          <p className="mb-6 text-center md:text-left text-gray-600 font-poppins">Login to access your account</p>

          <form onSubmit={formik.handleSubmit}>
            <div className="relative mb-6">
              <Input
                name="phone"
                label="Enter mobile number"
                type="text"
                placeholder="+91 "
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.errors.phone && formik.touched.phone ? formik.errors.phone : undefined}
              />
            </div>

            <Button text="Get OTP" loading={loading} width="w-full" />
          </form>

          <div className="text-center mt-4">
            <p className="text-black font-poppins text-sm">
              Don't have an account?{" "}
              <a href="/register" className="text-red-500 hover:underline font-poppins text-sm">
                Sign Up
              </a>
            </p>
          </div>

          {error && <div className="text-red-500 text-sm mt-4 text-center font-poppins">{error}</div>}
        </div>

        <div className="w-full md:w-1/2">
          <img src="/loginh.png" alt="Login" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
