import { todolistsReducer } from "./todolists-reducer";
import { tasksReducer } from "./tasks-reduser";
import { ThunkDispatch } from "redux-thunk";
import { useDispatch } from "react-redux";
import { appReducer } from "./app-reducer";
import { authReducer } from "./auth-reducer";
import { UnknownAction, combineReducers, configureStore } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export const useAppDispatch = useDispatch<AppDispacthType>;

//types
export type RootReducerType = ReturnType<typeof store.getState>;
export type AppDispacthType = ThunkDispatch<RootReducerType, unknown, UnknownAction>;
