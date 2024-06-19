"use client";

import ECommerce from "@/components/Dashboard/E-commerce";
import AuthLayout from "@/components/Layouts/AuthLayout";
import Modal from "@/components/Modal/Modal";
import TablePagination from "@/components/TablePagination/TablePagination";
import Select from "react-select";
import { useDebounce } from "@/hooks/useDebounce";
import useSearchParamsCus from "@/hooks/useSearchParamsCus";
import {
  createUserApi,
  deleteUserApi,
  getUsersApi,
} from "@/services/user.service";
import { useFormik } from "formik";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Toastify from "toastify-js";

const TYPE_MODAL = {
  CREATE: "create",
  EDIT: "edit",
  CLOSE: "",
};

export default function User() {
  const searchParamsCus: any = useSearchParamsCus();
  const pathname = usePathname();
  const { replace } = useRouter();
  // const params = useParams();
  const [option, setOption] = useState<any>(searchParamsCus.paramsObj);
  const [users, setUsers] = useState<any>();
  const [userSelected, setUserSelected] = useState<any>();
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(TYPE_MODAL.CLOSE);

  const getListUser = async () => {
    try {
      const res = await getUsersApi(option);
      console.log(res);
      setUsers(res?.data);
      setOption({
        ...option,
        page: res?.page,
      });
    } catch (error) {
      console.log("getListUser error", error);
    }
  };

  const handleSearch = useDebounce((term: string) => {
    const params = new URLSearchParams(searchParamsCus.searchParams);
    if (option) {
      for (let key in option) {
        params.set(key, option[key]);
      }
    }
    replace(`${pathname}?${params.toString()}`);
    getListUser();
  }, 100);

  const handleChangePage = (page: any) => {
    setOption({ ...option, page });
    handleSearch();
  };

  const formatDate = (date: any) => {
    return new Date(date)
      .toLocaleString("vi", {
        dateStyle: "short",
        timeStyle: "medium",
        timeZone: "Asia/Ho_Chi_Minh",
      })
      .split(" ")
      .reverse()
      .join(" ");
  };

  const handleShowDetail = (user: any) => {
    setUserSelected(user);
    setIsOpenModalDetail(true);
  };

  useEffect(() => {
    getListUser();
    console.log("option: ", option);
    console.log("pathname: ", pathname);
    // console.log("searchParams: ", searchParams);
    // console.log("params: ", params);
  }, []);

  const handleDelete = async () => {
    const result = await deleteUserApi(userSelected.id);
    if (result?.statusCode === 200) {
      Toastify({
        text: "Delete successfully",
        className: "info",
        close: true,
        gravity: "bottom",
        position: "center",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
    }
    getListUser();
    setIsOpenModalDelete(false);
  };

  return (
    <>
      <AuthLayout>
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <button
            onClick={() => setIsOpenModal(TYPE_MODAL.CREATE)}
            className="my-2 flex items-center gap-2 rounded bg-primary px-4.5 py-2 font-medium text-white hover:bg-opacity-80"
          >
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z"
                fill=""
              ></path>
            </svg>
            Add user
          </button>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                    Full Name
                  </th>
                  <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                    Email
                  </th>
                  <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                    Created At
                  </th>
                  <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                    Updated At
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users?.items?.map((user: any, key: any) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {user.fullName}
                      </h5>
                      {/* <p className="text-sm">${packageItem.price}</p> */}
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">{user.email}</p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {formatDate(user.createdAt)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {formatDate(user.updatedAt)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button
                          className="hover:text-primary"
                          onClick={() => handleShowDetail(user)}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                              fill=""
                            />
                            <path
                              d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                              fill=""
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setUserSelected(user);
                            setIsOpenModalDelete(true);
                          }}
                          className="hover:text-primary"
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                              fill=""
                            />
                            <path
                              d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                              fill=""
                            />
                            <path
                              d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                              fill=""
                            />
                            <path
                              d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <TablePagination
            total={Math.ceil(users?.totalItems / 10 || 1)}
            currentPage={option?.page}
            setCurrentPage={handleChangePage}
          />
        </div>
      </AuthLayout>
      <Modal
        isOpen={isOpenModalDetail}
        onClose={() => setIsOpenModalDetail(false)}
        title={"User Detail"}
      >
        <div className="rounded-sm border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
          {/* <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              User Detail
            </h3>
          </div> */}
          <div className="flex flex-col gap-5.5 p-6.5">
            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Full Name
              </label>
              <input
                type="text"
                disabled
                placeholder="Default Input"
                value={userSelected?.fullName}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Email
              </label>
              <input
                type="text"
                disabled
                placeholder="Active Input"
                value={userSelected?.email}
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              />
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isOpenModal == TYPE_MODAL.CREATE}
        onClose={() => setIsOpenModal("")}
        title={"Create category"}
      >
        <FormCreateUser
          onHandleSuccess={() => {
            setIsOpenModal(TYPE_MODAL.CLOSE);
            getListUser();
          }}
        />
      </Modal>
      <Modal
        isOpen={isOpenModalDelete}
        onClose={() => setIsOpenModalDelete(false)}
        title={"Confirm delete"}
      >
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleDelete()}
            className="inline-flex w-24 items-center justify-center gap-2.5 rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            OK
          </button>
          <button
            onClick={() => setIsOpenModalDelete(false)}
            className="bg-red-500 inline-flex w-24 items-center justify-center gap-2.5 rounded-md bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}

const FormCreateUser = ({ onHandleSuccess }: any) => {
  const onSubmit = async () => {
    try {
      const result = await createUserApi({
        ...values,
        role: values.role.value,
      });

      if (result?.statusCode === 200) {
        Toastify({
          text: "Create successfully",
          className: "info",
          close: true,
          gravity: "bottom",
          position: "center",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
        onHandleSuccess();
      }
    } catch (error) {
      console.log("handleLogin: ", error);
    }
  };

  const { handleSubmit, errors, values, handleBlur, handleChange }: any =
    useFormik({
      initialValues: {
        fullName: "",
        email: "",
        role: "",
        password: "",
      },
      onSubmit,
      enableReinitialize: true,
    });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="max-h-[55vh] overflow-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-6.5">
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Full Name <span className="text-meta-1">*</span>
                </label>
                <input
                  value={values.fullName}
                  name="fullName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  placeholder="Enter full name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  email <span className="text-meta-1">*</span>
                </label>
                <input
                  inputMode="email"
                  value={values.email}
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="text"
                  placeholder="Enter email"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Password <span className="text-meta-1">*</span>
              </label>
              <input
                security="true"
                value={values.password}
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                placeholder="Enter password"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Role <span className="text-meta-1">*</span>
              </label>
              <Select
                name="role"
                isClearable
                options={[
                  {
                    label: "Admin",
                    value: "admin",
                  },
                  {
                    label: "User",
                    value: "user",
                  },
                ]}
                value={values.role}
                onChange={(selectedOption: any) => {
                  handleChange({
                    target: { name: "role", value: selectedOption },
                  });
                }}
                noOptionsMessage={() => "No options"}
                classNames={{
                  control: () =>
                    "w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary",
                  valueContainer: () => "",
                }}
                onBlur={handleBlur}
              />
            </div>
          </div>
        </div>
        <button className="mt-5 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
          Submit
        </button>
      </form>
    </div>
  );
};
