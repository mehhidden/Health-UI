import { getCookie } from "../../../utils/cookie.js";
import { API } from "/utils/data.js";
import {
  handleIsSubmitingStatus,
  insertTemplateToElement,
  select,
} from "../../../utils/elem.js";
import { cashedtems } from "../../../utils/cash.js";

import { createUser } from "../../../utils/users.js";

export const insertUsersCount = async (count) => {
  insertTemplateToElement(Number(count) ? count : "N/A", select("#users-counter"));
};

export const showUsers = async () => {


  const response = await fetch(`${API}/users/get_users/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  }).then((res) => res.json());

  setTimeout(() => {
    console.log(response)
    insertUsersCount(response.count);
  }, 1000);

  return response;
};

export const submitUser = async (e) => {
  e.preventDefault();

  const permissoins = cashedtems["permissions"];

  const hasPermissionToAddUser = permissoins.some((item) => {
    console.log(item.name.toLowerCase());
    return item.name.toLowerCase() === "can add user";
  });

  console.log(hasPermissionToAddUser);

  if (hasPermissionToAddUser) {
    const btnInitTemplate = select("#create-user-btn").innerHTML;

    const formData = new FormData(e.target);
    const objData = Object.fromEntries(formData.entries());

    try {
      handleIsSubmitingStatus($("#create-user-btn"), true, {
        submitingText: "در حال ایجاد ...",
      });
      await createUser(objData)

      swal("کاربر با موفقیت ایجاد شد", "", "success");
    } catch (error) {
      swal(error.message, "", "error");
    } finally {
      handleIsSubmitingStatus($("#create-user-btn"), false, {
        successText: btnInitTemplate,
      });
    }
  }else{
    swal("شما دسترسی لازم را ندارید", "", "error");
  }
};
