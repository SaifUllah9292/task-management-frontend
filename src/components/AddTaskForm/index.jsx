"use client";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import styles from "./styles.module.css";
import CustomButton from "../CustomButton";
import TextInput from "@/components/TextInput";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "@/components/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { clearEditData } from "@/redux/slice/taskSlice";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import {
  Grid,
  Box,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Typography,
  IconButton,
  Button,
} from "@mui/material";

const AddTask = (props) => {
  const { getAllData, handleClose } = props;
  const dispatch = useDispatch();
  const snackBarMessage = useSnackbar();
  const editData = useSelector((state) => state.task.editData);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      dueDate: "",
      title: "",
      description: "",
      status: "",
    },

    onSubmit: async (values) => {
      if (editData.id) {
        updateData(values);
      } else {
        postData(values);
      }
    },

    validationSchema: Yup.object({
      dueDate: Yup.string().required("Date is required"),
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      status: Yup.string().required("Status is required"),
    }),
  });

  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return [year, month, day].join("-");
  };

  const postData = async (values) => {
    setLoading(true);
    try {
      let formattedDate = formatDate(values.dueDate);
      let res = await axios.post("dashboard/api", {
        dueDate: formattedDate,
        title: values.title,
        description: values.description,
        type: values.status,
      });

      if (res?.data?.status === true) {
        getAllData();
        snackBarMessage({
          type: "success",
          message: res?.data?.message,
        });
        formik.handleReset();
      } else {
        snackBarMessage({
          message: res?.data?.message,
        });
        formik.handleReset();
      }
    } catch (error) {
      snackBarMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (values) => {
    setLoading(true);
    try {
      let formattedDate = formatDate(values.dueDate);
      let res = await axios.patch(`dashboard/api/${editData.id}`, {
        id: editData.id,
        dueDate: formattedDate,
        title: values.title,
        description: values.description,
        status: values.status,
      });

      if (res?.data?.status === true) {
        getAllData();
        snackBarMessage({
          type: "warning",
          message: res?.data?.message,
        });
        dispatch(clearEditData());
        formik.handleReset();
      } else {
        snackBarMessage({
          message: res?.data?.message,
        });
      }
    } catch (error) {
      snackBarMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    formik.handleReset();
    dispatch(clearEditData());
  };

  useEffect(() => {
    if (editData.id) {
      formik.setFieldValue("dueDate", formatDate(editData.dueDate));
      formik.setFieldValue("title", editData.title);
      formik.setFieldValue("description", editData.description);
      formik.setFieldValue("status", editData.status);
    }
  }, [editData]);

  return (
    <>
      <br />

      <Box className={styles.iconContainer}>
        <Box className={styles.iconsubContainer}>
          <IconButton onClick={handleClose}>
            <ChevronLeftOutlinedIcon
              className={styles.ChevronLeftOutlinedIcon}
            />
          </IconButton>

          <Typography variant="h5" textAlign={"center"}>
            {editData.id ? " Update Task" : "Add Task"}
          </Typography>
          <Button onClick={clearForm} className={styles.clearBtn}>
            Clear
          </Button>
        </Box>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Grid item container lg={12} spacing={2}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box className={styles.inputField}>
              <TextInput
                placeholder="Enter Date"
                type="date"
                name="dueDate"
                sx={{
                  width: "90%",
                }}
                value={formik.values.dueDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Box>

            {formik.touched.dueDate && formik.errors.dueDate ? (
              <Box className={styles.error}>{formik.errors.dueDate}</Box>
            ) : (
              ""
            )}
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box className={styles.inputField}>
              <TextInput
                label="Title"
                type="text"
                name="title"
                sx={{
                  width: "90%",
                }}
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Box>

            {formik.touched.title && formik.errors.title ? (
              <Box className={styles.error}>{formik.errors.title}</Box>
            ) : (
              ""
            )}
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box className={styles.inputField}>
              <TextInput
                label="Description"
                type="text"
                name="description"
                sx={{
                  width: "90%",
                }}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Box>

            {formik.touched.description && formik.errors.description ? (
              <Box className={styles.error}>{formik.errors.description}</Box>
            ) : (
              ""
            )}
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box className={styles.inputField}>
              <Box
                sx={{
                  width: "90%",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="type"
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            {formik.touched.status && formik.errors.status ? (
              <Box className={styles.error}>{formik.errors.status}</Box>
            ) : (
              ""
            )}
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box className={styles.inputField}>
              <CustomButton
                type="submit"
                loading={loading}
                title={editData.id ? " Update Task" : "Add Task"}
              />
            </Box>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AddTask;
