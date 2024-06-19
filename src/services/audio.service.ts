import { axiosInstance } from "../utils/axios";

export const getAudioApi = async (data: {
  page?: string | number;
  keyword?: string;
}) => {
  try {
    const audio = await axiosInstance.get("/audios/admin", {
      params: data,
    });
    return audio?.data || {};
  } catch (error) {
    console.log("signIn error");
  }
};

export const createAudioApi = async (data: any) => {
  try {
    console.log(data)
    const audio = await axiosInstance.post("/audios", data);
    return audio?.data;
  } catch (error) {
    console.log("signIn error");
  }
};

export const deleteAudioApi = async (id: any) => {
  try {
    const audio = await axiosInstance.delete(`/audios/${id}`);
    return audio?.data;
  } catch (error) {
    console.log("signIn error");
  }
};
