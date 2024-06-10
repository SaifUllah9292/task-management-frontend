"use client";
import axios from "axios";
import Loading from "../Loading";
import styles from "./styles.module.css";
import { getCookie } from "cookies-next";
import EditIcon from "@mui/icons-material/Edit";
import Pagination from "@/components/Pagination";
import React, { useState, useEffect } from "react";
import DeleteModal from "@/components/DeleteModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "@/components/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { setEditData, setCurrentPage } from "@/redux/slice/taskSlice";
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  Paper,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  TableHead,
} from "@mui/material";

const TaskTable = (props) => {
  const { getAllData, loading, handleShowForm } = props;
  const dispatch = useDispatch();
  const theme = useTheme();
  const firstName = getCookie("firstName");
  const lastName = getCookie("lastName");
  const snackBarMessage = useSnackbar();
  const isMatch = useMediaQuery(theme.breakpoints.down("sm"));
  const userInfo = useSelector((state) => state.task.userInfo);
  const currentPage = useSelector((state) => state.task.currentPage);
  const [deleteId, setDeleteId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const itemsPerPage = 5;

  const handleDelete = async (id) => {
    try {
      let res = await axios.delete(`dashboard/api/${id}`, {
        data: { id: id },
      });
      snackBarMessage({
        message: res?.data?.message,
      });
      if (res?.data?.status === true) {
        getAllData();
      }
    } catch (error) {
      snackBarMessage(error);
    }
  };

  const editItem = (data) => {
    dispatch(setEditData(data));
    handleShowForm();
  };

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = userInfo?.tasks?.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

    // Adjust the current page if the current page becomes empty
    if (currentItems?.length === 0 && currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  }, [userInfo, currentPage, dispatch]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userInfo?.tasks?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(userInfo?.tasks?.length / itemsPerPage);

  return (
    <>
      {isMatch ? (
        <>
          <Box sx={{ paddingTop: "50px" }}>
            <Typography className={styles.username}>Welcome</Typography>
            <Box className={styles.usernameContainer}>
              <Typography className={styles.username}>
                {firstName && firstName ? firstName : "No user data"}
              </Typography>
              <Typography className={styles.username}>
                {lastName && lastName ? lastName : "No user data"}
              </Typography>
            </Box>
          </Box>
        </>
      ) : (
        <Box sx={{ paddingTop: "50px" }}>
          <Typography className={styles.username}>
            Welcome {firstName && firstName ? firstName : "No user data"}
            &nbsp;
            {lastName && lastName ? lastName : "No user data"}
          </Typography>
        </Box>
      )}
      <Box sx={{ paddingTop: "50px" }}></Box>
      <Box className={styles.container}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <TableContainer component={Paper} className={styles.tableContainer}>
              <Table aria-label="simple table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell className={styles.tableCell}>Date</TableCell>
                    <TableCell className={styles.tableCell}>Title</TableCell>
                    <TableCell className={styles.tableCell}>
                      Description
                    </TableCell>
                    <TableCell className={styles.tableCell}>Status</TableCell>{" "}
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                {currentItems?.map((item) => (
                  <React.Fragment key={item.id}>
                    <TableRow>
                      <TableCell className={styles.tableCell}>
                        {item.dueDate}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        {item.title}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        {item.description}
                      </TableCell>

                      <TableCell className={styles.tableCell}>
                        {item.status}
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          setDeleteId(item.id);
                          setModalOpen(true);
                        }}
                      >
                        <DeleteIcon
                          sx={{
                            color: "red",
                            fontSize: {
                              lg: "40px",
                              md: "40px",
                              sm: "40px",
                              xs: "30px",
                            },
                            cursor: "pointer",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <EditIcon
                          sx={{
                            color: "yellow",
                            fontSize: {
                              lg: "40px",
                              md: "40px",
                              sm: "40px",
                              xs: "30px",
                            },
                            cursor: "pointer",
                          }}
                          onClick={() => editItem(item)}
                        />
                      </TableCell>
                    </TableRow>
                    <br></br>
                  </React.Fragment>
                ))}
              </Table>
            </TableContainer>

            <Box className={styles.pagination}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => dispatch(setCurrentPage(value))}
              />
            </Box>
          </>
        )}

        <DeleteModal
          open={modalOpen}
          msg={"Are your sure want to delete this task?"}
          title={"Delete"}
          cancel={"Cancel"}
          onClose={() => setModalOpen(false)}
          onClick={() => handleDelete(deleteId)}
        />
      </Box>
    </>
  );
};

export default TaskTable;
