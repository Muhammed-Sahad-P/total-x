import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data() as {
          firstName: string;
          lastName: string;
          email: string;
          phoneNumber: string;
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data", error);
      return rejectWithValue("Failed to fetch user data");
    }
  }
);

const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (phoneNumber: string, { rejectWithValue }) => {
    const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {});
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptcha
      );
      recaptcha.clear();
      return confirmation.verificationId;
    } catch (error) {
      recaptcha.clear();
      console.error(error);
      return rejectWithValue("Failed to send OTP");
    }
  }
);

const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    { otp, verificationId }: { otp: string; verificationId: string | null },
    { rejectWithValue }
  ) => {
    try {
      if (!verificationId) throw new Error("Verification ID not found");
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const res = await signInWithCredential(auth, credential);
      const user = {
        phoneNumber: res.user.phoneNumber!,
        email: res.user.email,
      };
      return user;
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === "auth/invalid-verification-code"
      ) {
        return rejectWithValue("Invalid Otp");
      }
      return rejectWithValue("Otp verification failed");
    }
  }
);

const userRegister = createAsyncThunk(
  "user/userRegister",
  async (
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    },
    { rejectWithValue }
  ) => {
    try {
      await addDoc(collection(db, "users"), user);
      return user;
    } catch (error) {
      console.error(error);
      return rejectWithValue("User registration failed");
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

const logout = createAsyncThunk("user/logout", async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error(error);
  }
});

export { fetchUserData, sendOtp, verifyOtp, userRegister, logout };
