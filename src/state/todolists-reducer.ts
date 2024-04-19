import { v1 } from "uuid";
import { ResultCodes, TodolistApi, TodolistType } from "../api/todolists-api";
import { Dispatch } from "redux";
import { RequestStatusType, appActions } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../utils/create-app-async-thunk";

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeFilter: (state, action: PayloadAction<{ filter: filterType; todolistId: string }>) => {
      const todoIndex = state.findIndex((todo) => todo.id === action.payload.todolistId);
      if (todoIndex !== -1) {
        state[todoIndex].filter = action.payload.filter;
      }
    },
    changeEntityStatus: (
      state,
      action: PayloadAction<{ todolistId: string; entityStatus: RequestStatusType }>
    ) => {
      const todoIndex = state.findIndex((todo) => todo.id === action.payload.todolistId);
      if (todoIndex !== -1) {
        state[todoIndex].entityStatus = action.payload.entityStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTodolists.fulfilled, (state, action) => {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: "idle",
      }));
    });
    builder.addCase(removeTodolist.fulfilled, (state, action) => {
      const todoIndex = state.findIndex((todo) => todo.id === action.payload.todolistId);
      if (todoIndex !== -1) state.splice(todoIndex, 1);
    });
    builder.addCase(createTodolist.fulfilled, (state, action) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
    });
    builder.addCase(updateTodolistTitle.fulfilled, (state, action) => {
      const todoIndex = state.findIndex((todo) => todo.id === action.payload.todolistId);
      if (todoIndex !== -1) {
        state[todoIndex].title = action.payload.title;
      }
    });
  },
});

//types
export type filterType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: filterType;
  entityStatus: RequestStatusType;
};

//thunks
const getTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, any>(
  `${slice.name}/getTodolists`,
  async (arg, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    dispatch(appActions.setStatus({ status: "loading" }));
    try {
      const res = await TodolistApi.getTodolists();
      dispatch(appActions.setStatus({ status: "succeeded" }));
      return { todolists: res.data };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);
const removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>(
  `${slice.name}/removeTodolist`,
  async (todolistId, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    dispatch(appActions.setStatus({ status: "loading" }));
    dispatch(todolistActions.changeEntityStatus({ todolistId, entityStatus: "loading" }));
    try {
      const res = await TodolistApi.deleteTodolist(todolistId);
      if (res.data.resultCode === ResultCodes.Succeeded) {
        dispatch(appActions.setStatus({ status: "succeeded" }));
        return { todolistId };
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
const createTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  `${slice.name}/createTodolist`,
  async (title, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    dispatch(appActions.setStatus({ status: "loading" }));
    try {
      const res = await TodolistApi.createTodolist(title);
      if (res.data.resultCode === ResultCodes.Succeeded) {
        dispatch(appActions.setStatus({ status: "succeeded" }));
        return { todolist: res.data.data.item };
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
const updateTodolistTitle = createAppAsyncThunk<
  { title: string; todolistId: string },
  { title: string; todolistId: string }
>(`${slice.name}/updateTodolistTitle`, async (arg, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;
  dispatch(appActions.setStatus({ status: "loading" }));
  try {
    const res = await TodolistApi.updateTodolistTitle(arg.todolistId, arg.title);
    if (res.data.resultCode === ResultCodes.Succeeded) {
      dispatch(appActions.setStatus({ status: "succeeded" }));
      return arg;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

//exports
export const todolistsReducer = slice.reducer;
export const todolistActions = slice.actions;
export const todolistThunks = { getTodolists, removeTodolist, createTodolist, updateTodolistTitle };
