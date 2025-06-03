import { getCookie } from "../../../utils/cookie.js";
import { API } from "../../../utils/data.js";
import {
  handleIsSubmitingStatus,
  insertTemplateToElement,
  select,
  selectAll,
} from "../../../utils/elem.js";
import { fetchAllGroups } from "../../../utils/groups.js";
import { fetchAllPermissions } from "../../../utils/permissions.js";
import { createUser } from "../../../utils/users.js";
import {
  generateSelectTemplate,
  generateUserEditModalTemplate,
  generateUserInfoModalTemplate,
} from "./templates.js";
import {
  addGroupsReq,
  addPermissionsReq,
  deleteGroupsReq,
  deletePermissionsReq,
  deleteReq,
  editReq,
  getSingleUser,
  getTrInfo,
  insertUsers,
} from "./utils.js";

import { getUsers } from "/utils/users.js";

let mainUsers = null;
let allGroups = null;
let allPermissions = null;

export const getAllGroups = async () => {
  allGroups = await fetchAllGroups()
};

export const getAllPermissions = async () => {
  allPermissions = await fetchAllPermissions()
};

const createModalEl = select("#userCreateModal");
export const showCreateModal = () => {
  createModalEl.classList.add("show");
};

export const hideCreateModal = () => {
  createModalEl.classList.remove("show");
};

export const submitUser = async (e) => {
  e.preventDefault();
  const info = new FormData(e.target);
  const data = Object.fromEntries(info.entries());
  try {
    const response = await createUser(data);
    console.log(response);
    showUsers();
    swal(response, "", "success");
    hideCreateModal();
  } catch (error) {
    swal(error.message, "", "error");
  }
};

export const showUsers = async () => {
  const users = await getUsers();
  mainUsers = users.results;
  console.log(users);
  insertUsers(users.results);
};

const editModalEl = select("#userEditModal");
let selectedUser = null;
export const hideEditModal = async () => {
  editModalEl.classList.remove("show");
  insertTemplateToElement(
    "",
    editModalEl
  )
};
export const editUser = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const newInfo = Object.fromEntries(formData.entries());

  const modalGroups = [
    ...new Set(
      [...selectAll(".group-select")]
        .map((el) => el.value)
        .filter((value) => value.trim())
    ),
  ];
  const modalPermissions = [
    ...new Set(
      [...selectAll(".permission-select")]
        .map((el) => el.value)
        .filter((value) => value.trim())
    ),
  ];

  const newGroups = modalGroups.filter(
    (item) => !selectedUser.groups.some(group => group.name == item)
  );
  const newPermissions = modalPermissions.filter(
    (item) => !selectedUser.permissions.some(permission => permission.id == item)
  );

  const deletedGroups = (selectedUser.groups.filter(
    (group) => !modalGroups.some(item => group.name == item)
  )).map(item => item.name);
  const deletedPermissions = (selectedUser.permissions.filter(
    (permission) => !modalPermissions.some(item => permission.id == item)
  )).map(item => item.id);
  // console.log(first)

  console.log("new info ->", newInfo);
  console.log("new groups ->", newGroups);
  console.log("deleted groups ->", deletedGroups);
  console.log("new permissions ->", newPermissions);
  console.log("deleted permissions ->", deletedPermissions);

  console.log(selectedUser)

  const promices = [
    editReq({
      ...selectedUser,
      ...newInfo,
    }),
    addGroupsReq(selectedUser.user_id, newGroups),
    deleteGroupsReq(selectedUser.user_id, deletedGroups),
    addPermissionsReq(selectedUser.user_id, newPermissions),
    deletePermissionsReq(selectedUser.user_id, deletedPermissions),
  ];

  handleIsSubmitingStatus($(".user-edit-submit-btn"), true, {
    submitingText: "در حال ویرایش ...",
  });

  Promise.allSettled(promices)
    .then((res) => {
      console.log(res);
      showUsers();
      hideEditModal();
      swal("کاربر با موفقیت ویرایش شد", "", "success");
    })
    .catch((error) => {
      swal(error.message, "", "error");
    })
    .finally(() => {
      handleIsSubmitingStatus($(".user-edit-submit-btn"), false, {
        successText: "ویرایش",
      });
    });
};

export const insertEditModalInfo = async (e) => {
  e.target.innerHTML = "در حال لود ...";

  const info = getTrInfo(e);
  const userAllData = await getSingleUser(info.id);
  selectedUser = userAllData;

  e.target.innerHTML = "ویرایش";

  const template = generateUserEditModalTemplate(
    userAllData,
    allGroups,
    allPermissions
  );

  insertTemplateToElement(template, editModalEl);
};

export const showEditModal = async (e) => {
  insertEditModalInfo(e);

  editModalEl.classList.add("show");
};

export const addSelect = (type) => {
  const wrapper = document.getElementById(
    type === "group" ? "groupSelectWrapper" : "permissionSelectWrapper"
  );

  const template = generateSelectTemplate(type, allGroups, allPermissions);

  insertTemplateToElement(template, wrapper, true);
};

export const removeSelect = (button) => {
  const item = button.parentElement;
  const wrapper = item.parentElement;
  if (wrapper.children.length > 1) {
    wrapper.removeChild(item);
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await deleteReq(id);
    showUsers();
    swal(response, "", "success");
  } catch (error) {
    swal(error.message, "", "error");
  }
};

export const showDeleteSwal = (e) => {
  const info = getTrInfo(e);
  const fullName = `${info.first_name} ${info.last_name}`;

  swal("", `آیا از حذف   ${fullName} اطمینان دارید؟`, "warning").then(
    async (result) => {
      if (result) deleteUser(info.id, fullName);
    }
  );
};

export const renderSearch = (e) => {
  const searchInput = select("[type='search']");

  searchInput.onkeyup = (e) => {
    const value = e.target.value.toLowerCase().trim();

    const filteredUsers = mainUsers.filter(
      (user) =>
        user.username.includes(value.trim()) ||
        user.first_name.includes(value.trim()) ||
        user.last_name.includes(value.trim())
    );

    insertUsers(filteredUsers);
  };
};

const infoModal = select("#infoModal");
export const showInfoModal = async (e) => {
  console.log(e);
  e.target.innerHTML = "در حال لود ...";

  const info = getTrInfo(e);

  const userAllData = await getSingleUser(info.id);

  e.target.innerHTML = "مشاهده";

  const template = generateUserInfoModalTemplate(userAllData);

  infoModal.innerHTML = template;

  infoModal.classList.add("show");
};

export const hideInfoModal = () => {
  infoModal.classList.remove("show");
  insertTemplateToElement(
    "",
    infoModal
  )
};
