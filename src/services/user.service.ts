import { axiosInstance } from "../utils/axios";

export const getUsersApi = async (data: {
  page?: string | number;
  keyword?: string;
}) => {
  try {
    const user = await axiosInstance.get("/users", {
      params: data,
    });
    return user?.data || {};
  } catch (error) {
    console.log("signIn error");
  }
};

export const createUserApi = async (data: any) => {
  try {
    const category = await axiosInstance.post("/users", data);
    return category?.data;
  } catch (error) {
    console.log("signIn error");
  }
};

export const deleteUserApi = async (id: any) => {
  try {
    const audio = await axiosInstance.delete(`/users/${id}`);
    return audio?.data;
  } catch (error) {
    console.log("signIn error");
  }
};