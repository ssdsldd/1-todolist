import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispacthType, RootReducerType } from "../state/store";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootReducerType;
  dispatch: AppDispacthType;
  rejectValue: null;
}>();
