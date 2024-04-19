import { Dispatch } from "redux";
import { ResponseType } from "../api/todolists-api";
import { appActions } from "../state/app-reducer";
import { AppDispacthType } from "../state/store";
import axios from "axios";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setError({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setError({ error: "Some error" }));
  }
  dispatch(appActions.setStatus({ status: "failed" }));
};

export const handleServerNetworkError = (err: unknown, dispatch: AppDispacthType): void => {
  let errorMessage = "Some error occurred";
  if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data?.message || err?.message || errorMessage;
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
  } else {
    errorMessage = JSON.stringify(err);
  }

  dispatch(appActions.setError({ error: errorMessage }));
  dispatch(appActions.setStatus({ status: "failed" }));
};
