import React, { useCallback, useEffect } from "react";
import s from "./TodolistLists.module.css";
import { RootReducerType, useAppDispatch } from "../../state/store";
import { useSelector } from "react-redux";
import { TodolistDomainType, todolistThunks } from "../../state/todolists-reducer";
import { AddForm } from "../addforn/AddForm";
import { Paper } from "@mui/material";
import { Todolist } from "../todolist/Todolist";
import { Navigate } from "react-router-dom";

export default function TodolistLists() {
  const dispatch = useAppDispatch();
  const todolists = useSelector<RootReducerType, TodolistDomainType[]>((state) => state.todolists);
  const isLoggedIn = useSelector<RootReducerType, boolean>((state) => state.auth.isLoggedIn);

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(todolistThunks.createTodolist(title));
    },
    [dispatch]
  );

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    dispatch(todolistThunks.getTodolists({}));
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <div className={s.addTodolist}>
        <AddForm callback={addTodolist} />
      </div>
      <div className={s.todolistsBox}>
        {todolists.map((todolist) => {
          return (
            <Paper className={s.paper} elevation={3} key={todolist.id}>
              <Todolist todolist={todolist} />
            </Paper>
          );
        })}
      </div>
    </>
  );
}
