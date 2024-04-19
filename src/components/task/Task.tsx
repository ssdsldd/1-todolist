import React, { useCallback } from "react";
import MyCheckbox from "../checkbox/MyCheckbox";
import { EditableSpan } from "../editableSpan/EditableSpan";
import { IconButton } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import s from "./Task.module.css";
import { taskThunks } from "../../state/tasks-reduser";
import { TaskStatuses, TaskType } from "../../api/todolists-api";
import { useAppDispatch } from "../../state/store";

type TaskPropsType = {
  task: TaskType;
  todolistid: string;
};

export const Task = React.memo(({ task, todolistid }: TaskPropsType) => {
  const dispatch = useAppDispatch();

  const onClickHandler = () =>
    dispatch(taskThunks.removeTask({ todolistId: todolistid, taskId: task.id }));
  const editTaskTitle = useCallback(
    (title: string) => {
      dispatch(
        taskThunks.updateTask({ todolistId: todolistid, taskId: task.id, model: { title } })
      );
    },
    [task.id, todolistid]
  );
  const onChangeStatusHandler = (taskid: string, status: TaskStatuses) => {
    dispatch(taskThunks.updateTask({ todolistId: todolistid, taskId: task.id, model: { status } }));
  };

  return (
    <li className={task.status === TaskStatuses.Completed ? `${s.comletedTask} ${s.item}` : s.item}>
      <MyCheckbox
        checked={task.status === TaskStatuses.Completed}
        onChange={(value) =>
          onChangeStatusHandler(task.id, value ? TaskStatuses.Completed : TaskStatuses.New)
        }
      />
      <EditableSpan globalTitle={task.title} callback={editTaskTitle} />
      <IconButton size="small" onClick={onClickHandler}>
        <DeleteOutlinedIcon fontSize="inherit" />
      </IconButton>
    </li>
  );
});
