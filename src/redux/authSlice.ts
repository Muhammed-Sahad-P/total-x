import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { auth } from "../firebase";

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  user: null | { phone?: string; name?: string; email?: string };
  error: string | null;
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: false,
  user: null,
  error: null,
};

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (phone: string, { rejectWithValue }) => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );

      await recaptchaVerifier.render();
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        recaptchaVerifier
      );

      window.confirmationResult = confirmationResult;

      return confirmationResult;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    { confirmationResult, otp }: { confirmationResult: any; otp: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      const userExists = await dispatch(checkUserExistence(user.phoneNumber));

      if (userExists) {
        return user;
      } else {
        throw new Error("User does not exist");
      }
    } catch (error: any) {
      return rejectWithValue("Invalid OTP or user does not exist");
    }
  }
);

export const checkUserExistence = createAsyncThunk(
  "auth/checkUserExistence",
  async (phone: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/check-user/${phone}`);
      const data = await response.json();
      return data.exists;
    } catch (error: any) {
      return rejectWithValue("Error checking user existence");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{ name: string; email: string }>
    ) {
      state.isAuthenticated = true;
      state.user = { name: action.payload.name, email: action.payload.email };
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = { phone: action.payload.phoneNumber };
      })
      .addCase(verifyOtp.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkUserExistence.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
        } else {
          state.error = "User does not exist";
        }
      });
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
