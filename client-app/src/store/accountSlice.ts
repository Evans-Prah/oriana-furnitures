import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { AccountLoginResponse } from "../models/AccountLoginResponse";
import { ApiResponse } from "../models/ApiResponse";

interface AccountState {
  user: AccountLoginResponse | null;
  status: string;
}

const initialState: AccountState = {
  user: null,
  status: "idle",
};

export const loginUser = createAsyncThunk<
  AccountLoginResponse,
  { username: string; password: string }
>("account/loginUser", async ({ username, password }, thunkAPI) => {
  try {
    const user = await agent.Account.login({ username, password });
    if (!user) return {} as AccountLoginResponse;
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error) {
    return thunkAPI.rejectWithValue("A system error occured");
  }
});

export const getCurrentUser = createAsyncThunk(
  "account/getCurrentUser",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));

    try {
      const user = await agent.Account.checkAuthentication();
      console.log('user--->', user)
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue("A system error occured");
    }
  },
  {
    condition: () => {
      if (!localStorage.getItem("user")) return false;
    },
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      window.location.href = "/";
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.status = "pendingLoginUser";
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.status = "idle";
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(getCurrentUser.rejected, (state) => {
      state.user = null;
      localStorage.removeItem("user");
      toast.error('Session expired - please login again');
       window.location.href = "/";
    });
  },
});

export const { signOut, setUser } = accountSlice.actions;
