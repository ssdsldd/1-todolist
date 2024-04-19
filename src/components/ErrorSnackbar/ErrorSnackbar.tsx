import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { RootReducerType, useAppDispatch } from "../../state/store";
import { useSelector } from "react-redux";
import { appActions } from "../../state/app-reducer";

export default function CustomizedSnackbars() {
  const dispatch = useAppDispatch();
  const error = useSelector<RootReducerType, null | string>((state) => state.app.error);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(appActions.setError({ error: null }));
  };

  return (
    <div>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}
