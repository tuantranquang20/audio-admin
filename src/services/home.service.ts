import { axiosInstance } from "../utils/axios";

export const getAnalyst = async () => {
  try {
    return await axiosInstance.get("/stripe/analyst");
  } catch (error) {
    console.log("signIn error");
  }
};
