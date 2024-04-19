import { Dispatch } from "redux";
import { LoginParamsType, ResultCodes, TodolistApi, authAPI } from "../api/todolists-api";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { appActions } from "./app-reducer";
import { createAppAsyncThunk } from "../utils/create-app-async-thunk";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.value;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.value;
    });
    builder.addCase(me.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.value;
    });
  },
});

const login = createAppAsyncThunk<{ value: boolean }, LoginParamsType>(
  `${slice.name}/login`,
  async (data, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    dispatch(appActions.setStatus({ status: "loading" }));
    try {
      const res = await authAPI.login(data);
      if (res.data.resultCode === ResultCodes.Succeeded) {
        dispatch(appActions.setStatus({ status: "succeeded" }));
        return { value: true };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

const logout = createAppAsyncThunk<{ value: boolean }, any>(
  `${slice.name}/logout`,
  async (arg, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    dispatch(appActions.setStatus({ status: "loading" }));
    try {
      const res = await authAPI.logout();
      if (res.data.resultCode === ResultCodes.Succeeded) {
        dispatch(appActions.setStatus({ status: "succeeded" }));
        return { value: false };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

const me = createAppAsyncThunk<{ value: boolean }, any>(
  `${slice.name}/me`,
  async (arg, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    dispatch(appActions.setStatus({ status: "loading" }));
    try {
      const res = await authAPI.me();
      if (res.data.resultCode === ResultCodes.Succeeded) {
        dispatch(appActions.setStatus({ status: "succeeded" }));
        dispatch(appActions.setInitialized({ initialized: true }));
        return { value: true };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setInitialized({ initialized: true }));
    }
  }
);

//exports
export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = { login, logout, me };
