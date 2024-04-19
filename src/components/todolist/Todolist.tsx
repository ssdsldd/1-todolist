import React, { MouseEvent, useCallback, useEffect } from "react";
import { EditableSpan } from "../editableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import s from "./Todolist.module.css";
import { useSelector } from "react-redux";
import { RootReducerType, useAppDispatch } from "../../state/store";
import {
  TodolistDomainType,
  filterType,
  todolistActions,
  todolistThunks,
} from "../../state/todolists-reducer";
import { taskThunks } from "../../state/tasks-reduser";
import { AddForm } from "../addforn/AddForm";
import { MyButton } from "../myButton/MyButton";
import { Task } from "../task/Task";
import { TaskStatuses, TaskType } from "../../api/todolists-api";

export type TodolistPropsType = {
  todolist: TodolistDomainType;
};

export const Todolist = React.memo(({ todolist }: TodolistPropsType) => {
  console.log("Todolist render");

  const { id, title, filter, entityStatus } = todolist;
  const dispatch = useAppDispatch();
  const tasks = useSelector<RootReducerType, TaskType[]>((state) => state.tasks[id]);
  const filteredTasks: TaskType[] =
    filter === "active"
      ? tasks.filter((task) => task.status === TaskStatuses.New)
      : todolist.filter === "completed"
      ? tasks.filter((task) => task.status === TaskStatuses.Completed)
      : tasks;

  const onChangeFilterHandler = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const currentFilter = e.currentTarget.dataset.filter as filterType;
      dispatch(todolistActions.changeFilter({ filter: currentFilter, todolistId: id }));
    },
    [id]
  );
  const onRemoveTodolitstHandler = () => {
    dispatch(todolistThunks.removeTodolist(id));
  };
  const addTask = useCallback(
    (title: string) => {
      dispatch(taskThunks.addTask({ todolistId: id, title }));
    },
    [dispatch]
  );

  const editTodolistTitle = (title: string) => {
    dispatch(todolistThunks.updateTodolistTitle({ title, todolistId: id }));
  };

  useEffect(() => {
    dispatch(taskThunks.getTasks(id));
  }, []);

  return (
    <div>
      <div className={s.titleContainer}>
        <EditableSpan
          globalTitle={title}
          callback={editTodolistTitle}
          disabled={entityStatus === "loading"}
        />
        <IconButton
          size="medium"
          onClick={onRemoveTodolitstHandler}
          color="default"
          disabled={entityStatus === "loading"}
        >
          <DeleteOutlinedIcon fontSize="inherit" />
        </IconButton>
      </div>
      <AddForm callback={addTask} disabled={entityStatus === "loading"} />
      <ul className={s.list}>
        {filteredTasks?.map((item) => {
          return <Task key={item.id} todolistid={id} task={item} />;
        })}
      </ul>
      <div className={s.buttonsBox}>
        <MyButton
          name="All"
          variant={filter === "all" ? "outlined" : "text"}
          dataFilter="all"
          callback={onChangeFilterHandler}
        />
        <MyButton
          name="Active"
          variant={filter === "active" ? "outlined" : "text"}
          dataFilter="active"
          callback={onChangeFilterHandler}
        />
        <MyButton
          name="Completed"
          variant={filter === "completed" ? "outlined" : "text"}
          dataFilter="completed"
          callback={onChangeFilterHandler}
        />
      </div>
    </div>
  );
});
