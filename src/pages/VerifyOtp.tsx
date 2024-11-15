import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { verifyOtp } from '../redux/auth';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '../components/Input';

const VerifyOtp: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, authError, verificationId } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { otp: "" },
    validationSchema: Yup.object({
      otp: Yup.string().length(6, 'Otp must be 6 digits').required('Otp is required'),
    }),
    onSubmit: async (values) => {
      if (verificationId) {
        await dispatch(verifyOtp({ otp: values.otp, verificationId }));
        navigate('/home');
      }
    },
  });


  return (
    <div className="min-h-screen flex flex-col justify-center items-center font-poppins">
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
        <img src="/totalxIcon.png" alt="Total X" className="w-16 h-16 sm:w-20 sm:h-20" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center p-8 w-full max-w-4xl">
        <div className="w-full sm:w-1/2 sm:pr-8 flex flex-col justify-center mb-6 sm:mb-0">
          <Link to="/" className="flex items-center text-black hover:underline mb-4">
            <IoIosArrowBack className="mr-2" />
            Back to Login
          </Link>

          <h2 className="text-3xl font-bold text-black mb-4 text-left font-poppins">Verify OTP</h2>
          <p className="mb-6 text-left text-gray-600 font-poppins text-sm">An authentication code has been sent to your phone</p>

          <form onSubmit={formik.handleSubmit}>
            <Input
              name='otp'
              label="Enter Code"
              type="text"
              placeholder="Enter the 6 digit code"
              value={formik.values.otp}
              onChange={formik.handleChange}
              error={formik.touched.otp && formik.errors.otp}
              maxLength={6}
            />

            <Button text={loading ? 'Verifying...' : 'Verify'} disabled={loading || formik.isSubmitting} width="w-full" type="submit" />
          </form>

          {authError && <div className="text-red-500 text-sm mt-4 font-poppins">{authError}</div>}

          <div className="text-center mt-4">
            <p className="text-black font-poppins text-sm">
              Didn't receive the code?{' '}
              <a href="#" className="text-red-500 hover:underline font-poppins text-sm">
                Resend
              </a>
            </p>
          </div>
        </div>

        <div className="w-full sm:w-1/2">
          <img src="/loginh.png" alt="Login" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
