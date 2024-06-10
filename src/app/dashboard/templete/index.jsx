"use client";
import axios from "axios";
import React from "react";
import Navbar from "@/components/Navbar";
import TaskTable from "@/components/TaskTable";
import AddTask from "@/components/AddTaskForm";
import { useSnackbar } from "@/components/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserInfo,
  setShowForm,
  setLoading,
  clearEditData,
} from "@/redux/slice/taskSlice";

const TaskPage = () => {
  const dispatch = useDispatch();
  const snackBarMessage = useSnackbar();
  const loading = useSelector((state) => state.task.loading);
  const showForm = useSelector((state) => state.task.showForm);

  const getAllData = async () => {
    dispatch(setLoading(true));
    try {
      let res = await axios.get("/dashboard/api");
      dispatch(setUserInfo(res?.data?.data));
    } catch (error) {
      snackBarMessage(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleShowForm = () => {
    dispatch(setShowForm(true));
  };

  const handleClose = () => {
    dispatch(setShowForm(false));
    dispatch(clearEditData());
  };

  return (
    <>
      <Navbar handleShowForm={handleShowForm} />
      {!showForm && (
        <>
          <TaskTable
            getAllData={getAllData}
            loading={loading}
            handleShowForm={handleShowForm}
          />
        </>
      )}
      {showForm && (
        <AddTask getAllData={getAllData} handleClose={handleClose} />
      )}
    </>
  );
};

export default TaskPage;
