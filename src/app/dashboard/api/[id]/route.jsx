import { apiConfig } from "@/config/apiConfig";
import axiosClient from "@/config/axiosClient";

export const deleteUser = async (id) => {
  return await axiosClient.delete(apiConfig.dashboard + `/${id}`);
};

export async function DELETE(req) {
  const body = await req.json();
  const data = await deleteUser(body.id);
  return Response.json(data?.data);
}

export const editUser = async (data) => {
  const editData = {
    dueDate: data?.dueDate,
    title: data?.title,
    description: data?.description,
    status: data?.status,
  };
  return await axiosClient.patch(
    apiConfig.dashboard + `/${data?.id}`,
    editData
  );
};

export async function PATCH(req) {
  const body = await req.json();
  const data = await editUser(body);
  return Response.json(data?.data);
}
