import { getCookie } from "../../../utils/cookie.js";
import { API } from "../../../utils/data.js";
import { insertTemplateToElement, select } from "../../../utils/elem.js";
import { generateUsersTableTemplate } from "./templates.js";

export const getTrInfo = (e) => {
  const tr = e.currentTarget.closest("tr");
  const info = JSON.parse(tr.dataset.info);
  return info;
};

export const insertUsers = (users) => {
  const template = generateUsersTableTemplate(users);

  insertTemplateToElement(template, select("#users-wrapper"));
};

export const deleteReq = async (id) => {
  const req = await fetch(`${API}/users/delete_user/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });

  if (req.ok) {
    return "حذف با موفقیت انجام شد";
  } else {
    const response = await req.json();
    throw Error(response.detail || convertBackendValidationToMessage(response));
  }
};

export const editReq = async (info) => {
  const { user_id, ...data } = info;

  const req = await fetch(`${API}/users/update_user/${user_id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (req.ok) {
    return "ادیت با موفقیت انجام شد";
  } else {
    const response = await req.json();
    throw (
      Error(response.detail || convertBackendValidationToMessage(response)) ||
      response
    );
  }
};

export const getSingleUser = async (id) => {
  const response = await fetch(`${API}/permissions_manager/list_user_groups_and_permissions/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: id }),
  }).then((res) => res.json());

  return response;
};

export const addGroupsReq = async (id, newGroups) => {
  const promices = newGroups.map((group) =>
    fetch(`${API}/permissions_manager/add_user_to_group/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("access")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: id, group_name: group }),
    })
  );

  return Promise.all(promices);
};

export const addPermissionsReq = async (id, newPermissions) => {
  const promices = newPermissions.map((permission) =>
    fetch(`${API}/permissions_manager/add_permission_to_user/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("access")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: id, permission_id: permission }),
    })
  );

  return Promise.all(promices);
}

export const deleteGroupsReq = async (id, deletedGroups) => {
  const promices = deletedGroups.map((group) =>
    fetch(`${API}/permissions_manager/remove_user_from_group/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("access")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: id, group_name: group }),
    })
  );

  return Promise.all(promices);
};

export const deletePermissionsReq = async (id, deletedPermissions) => {
  const promices = deletedPermissions.map((permission) =>
    fetch(`${API}/permissions_manager/remove_permission_from_user/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("access")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: id, permission_id: permission }),
    })
  );

  return Promise.all(promices);
}
