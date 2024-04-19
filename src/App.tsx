import "./App.css";
import Header from "./components/header/Header";
import Container from "@mui/material/Container";
import TodolistLists from "./components/todolistsList/TodolistLists";
import { CircularProgress, LinearProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { RootReducerType, useAppDispatch } from "./state/store";
import { RequestStatusType } from "./state/app-reducer";
import CustomizedSnackbars from "./components/ErrorSnackbar/ErrorSnackbar";
import { Login } from "./pages/login/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./pages/notFound/notFound";
import { useEffect } from "react";
import { authThunks } from "./state/auth-reducer";

function App() {
  const dispatch = useAppDispatch();
  const status = useSelector<RootReducerType, RequestStatusType>((state) => state.app.status);
  const isInitialized = useSelector<RootReducerType, boolean>((state) => state.app.isInitialized);

  useEffect(() => {
    dispatch(authThunks.me({}));
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      {status === "loading" && <LinearProgress />}
      <Container maxWidth="xl">
        <CustomizedSnackbars />
        <Routes>
          <Route path="/" element={<TodolistLists />} />
          <Route path="/login" element={<Login />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to={"/404"} />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
