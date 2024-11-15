import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserData,
  sendOtp,
  verifyOtp,
  userRegister,
  logout,
} from "../auth";

interface UserState {
  loading: boolean;
  isAuthenticated: boolean;
  fetchUser: boolean;
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber: string;
  } | null;
  error: string | null;
  phoneNumber: string;
  verificationId: string | null;
  authError: string | null;
  authStatus: string | null;
}

const initialState: UserState = {
  loading: false,
  isAuthenticated: false,
  fetchUser: false,
  user: null,
  error: null,
  phoneNumber: "",
  verificationId: null,
  authError: null,
  authStatus: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.fetchUser = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.fetchUser = false;
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.fetchUser = false;
      })

      .addCase(sendOtp.pending, (state) => {
        state.authError = null;
        state.loading = true;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.authStatus = "otpSent";
        state.verificationId = action.payload;
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.authError = action.payload as string;
        state.loading = false;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.authError = null;
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.authStatus = "otpVerified";
        state.loading = false;
        state.user = {
          ...action.payload,
          email: action.payload.email ?? undefined,
        };
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.authError = action.payload as string;
        state.loading = false;
      })
      .addCase(userRegister.pending, (state) => {
        state.authError = null;
        state.loading = true;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.authError = action.payload as string;
        state.loading = false;
      })
      .addCase(logout.pending, (state) => {
        state.authError = null;
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.authStatus = "login";
        state.loading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.authError = action.payload as string;
        state.loading = false;
      });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
