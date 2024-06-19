import { axiosInstance } from "../utils/axios";

export const getCategoryApi = async (data: {
  page?: string | number;
  keyword?: string;
}) => {
  try {
    const category = await axiosInstance.get("/categories", {
      params: data,
    });
    return category?.data || {};
  } catch (error) {
    console.log("signIn error");
  }
};

export const createCategoryApi = async (data: any) => {
  try {
    const category = await axiosInstance.post("/categories", data);
    return category?.data;
  } catch (error) {
    console.log("signIn error");
  }
};

export const getAllCategoryApi = async () => {
  try {
    const category = await axiosInstance.get("/categories/all");
    return category?.data || {};
  } catch (error) {
    console.log("signIn error");
  }
};
