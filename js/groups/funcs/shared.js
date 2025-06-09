import {
  getTrInfo,
  handleIsSubmitingStatus,
  insertTemplateToElement,
  select,
  selectAll,
} from "../../../utils/elem.js";
import { fetchAllGroups } from "../../../utils/groups.js";
import { fetchAllPermissions } from "../../../utils/permissions.js";

import {
  generateCreateModalTemplate,
  generateEditModalTemplate,
  generateSelectTemplate,
} from "./templates.js";
import {
  addPermissionsReq,
  createGroup,
  deletePermissionsReq,
  insertGroups,
} from "./utils.js";

let allGroups = null;
let allPermissions = null;
let mainGroup = null;

export const getAllPermissions = async () => {
  allPermissions = await fetchAllPermissions();
};

const createModalEl = select("#userCreateModal");
let isFirstTime = true;
export const showCreateModal = () => {
  createModalEl.classList.add("show");
  if (!isFirstTime) {
    return;
  }

  mainGroup = {
    permissions: []
  }

  const template = generateCreateModalTemplate(allPermissions);

  insertTemplateToElement(template, createModalEl);
};

export const hideCreateModal = () => {
  createModalEl.classList.remove("show");
};

const editModalEl = select("#userEditModal");

export const showEditModal = (e) => {
  editModalEl.classList.add("show");
  const info = getTrInfo(e);
  mainGroup = info;

  const template = generateEditModalTemplate(
    info.group_name,
    allPermissions,
    info.permissions
  );

  insertTemplateToElement(template, editModalEl);
};

export const hideEditModal = () => {
  editModalEl.classList.remove("show");
};

export const addPermissionsToGroup = async (groupName) => {
  const modalPermissions = [
    ...new Set(
      [...selectAll(".permission-select")]
        .map((el) => el.value)
        .filter((value) => value.trim() && value !== "null")
    ),
  ];

  // console.log(modalPermissions)

  const newPermissions = modalPermissions.filter(
    (modalPermission) =>
      !mainGroup.permissions.some((item) => item.id == modalPermission)
  );
  

  console.log(newPermissions)
  await addPermissionsReq(groupName || mainGroup.group_name, newPermissions);
};

export const removePermissionsFromGroup = async (groupName) => {
  
  const modalPermissions = [
    ...new Set(
      [...selectAll(".permission-select")]
        .map((el) => el.value)
        .filter((value) => value.trim() && value !== "null")
    ),
  ];

  

  const deletedPermissions = (mainGroup.permissions.filter(item => !modalPermissions.includes(`${item.id}`))).map(deleted => deleted.id);

  
  await deletePermissionsReq(groupName || mainGroup.group_name, deletedPermissions);
}

export const submitGroup = async (e) => {
  e.preventDefault();
  const info = new FormData(e.target);
  const data = Object.fromEntries(info.entries());

  const isCreating = e.target.dataset.creating;
  const text = isCreating ? "ایجاد" : "ویرایش";

  handleIsSubmitingStatus($(".user-create-submit-btn"), true, {
    submitingText: `درحال ${text} ...`,
  });

  try {
    if (isCreating) {
      await createGroup(data.name);
    }

    // await addPermissionsToGroup(data.name);
    await Promise.allSettled([
      addPermissionsToGroup(data.name),
      removePermissionsFromGroup(data.name)
    ]).then(() => console.log("prmomis runned"))

    showGroups();

    swal(`گروه با موفقیت ${text} شد`, "", "success");

    hideCreateModal();
  } catch (error) {
    swal(error.message, "", "error");
  } finally {
    handleIsSubmitingStatus($(".user-create-submit-btn"), false, {
      successText: text,
    });
  }
};

export const showGroups = async () => {
  const groups = await fetchAllGroups();
  allGroups = groups;
  insertGroups(groups);
};

export const addSelect = () => {
  const wrapper = document.getElementById("permissionSelectWrapper");

  const template = generateSelectTemplate(allPermissions);

  insertTemplateToElement(template, wrapper, true);
};

export const removeSelect = (button) => {
  const item = button.parentElement;
  const wrapper = item.parentElement;
  wrapper.removeChild(item);
};

export const deleteUser = async (id) => {
  try {
    const response = await deleteReq(id);
    showGroups();
    swal(response, "", "success");
  } catch (error) {
    swal(error.message, "", "error");
  }
};

// export const showDeleteSwal = (e) => {
//   const info = getTrInfo(e);
//   const fullName = `${info.first_name} ${info.last_name}`;

//   swal("", `آیا از حذف   ${fullName} اطمینان دارید؟`, "warning").then(
//     async (result) => {
//       if (result) deleteUser(info.id, fullName);
//     }
//   );
// };
