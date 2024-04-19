import { ResultCodes, TaskType, TodolistApi } from "../api/todolists-api";
import { Dispatch } from "redux";
import { RootReducerType } from "./store";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import { appActions } from "./app-reducer";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { todolistActions, todolistThunks } from "./todolists-reducer";
import { createAppAsyncThunk } from "../utils/create-app-async-thunk";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(todolistThunks.createTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId];
      })
      .addCase(todolistThunks.getTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task);
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const index = state[action.payload.todolistId].findIndex(
          (task) => task.id === action.payload.taskId
        );
        if (index !== -1) state[action.payload.todolistId].splice(index, 1);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state[action.payload.todolistId].findIndex(
          (task) => task.id === action.payload.taskId
        );
        if (index !== -1) {
          state[action.payload.todolistId][index] = {
            ...state[action.payload.todolistId][index],
            ...action.payload.model,
          };
        }
      });
  },
});

//thunks
const getTasks = createAppAsyncThunk<{ todolistId: string; tasks: TaskType[] }, string>(
  `${slice.name}/getTasks`,
  async (todolistId: string, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    dispatch(appActions.setStatus({ status: "loading" }));
    try {
      const res = await TodolistApi.getTasks(todolistId);
      dispatch(appActions.setStatus({ status: "succeeded" }));
      return { todolistId, tasks: res.data.items };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);
const addTask = createAppAsyncThunk<{ task: TaskType }, { todolistId: string; title: string }>(
  `${slice.name}/addTask`,
  async (arg, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    dispatch(appActions.setStatus({ status: "loading" }));
    try {
      const res = await TodolistApi.createTasks(arg.todolistId, arg.title);
      if (res.data.resultCode === ResultCodes.Succeeded) {
        dispatch(appActions.setStatus({ status: "succeeded" }));
        return { task: res.data.data.item };
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
const removeTask = createAppAsyncThunk<
  { todolistId: string; taskId: string },
  { todolistId: string; taskId: string }
>(`${slice.name}/removeTask`, async (arg, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;
  dispatch(appActions.setStatus({ status: "loading" }));
  try {
    const res = await TodolistApi.deleteTasks(arg.todolistId, arg.taskId);
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
const updateTask = createAppAsyncThunk<
  any,
  { todolistId: string; taskId: string; model: updateDpmainTaskObj }
>(`${slice.name}/updateTask`, async (arg, thunkApi) => {
  const { dispatch, rejectWithValue, getState } = thunkApi;
  const task = getState().tasks[arg.todolistId].find((task) => task.id === arg.taskId);
  if (!task) {
    return;
  }
  dispatch(appActions.setStatus({ status: "loading" }));
  const apiModel = {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    startDate: task.startDate,
    deadline: task.deadline,
    ...arg.model,
  };
  try {
    const res = await TodolistApi.updateTask(arg.todolistId, arg.taskId, apiModel);
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

//types
export type TasksStateType = {
  [key: string]: TaskType[];
};
type updateDpmainTaskObj = {
  title?: string;
  description?: string;
  status?: number;
  priority?: number;
  startDate?: string;
  deadline?: string;
};

//exports
export const tasksReducer = slice.reducer;
export const taskActions = slice.actions;
export const taskThunks = { getTasks, addTask, removeTask, updateTask };
