import { getCookie } from "../../../utils/cookie.js";
import { API } from "../../../utils/data.js";
import { insertTemplateToElement, select } from "../../../utils/elem.js";
import { generateGroupsTableTemplate } from "./templates.js";



export const insertGroups = (groups) => {
  const template = generateGroupsTableTemplate(groups);
  console.log(groups)
  insertTemplateToElement(template, select("#groups-wrapper"));
};

export const createGroup = async (name) => {
  const req = await fetch(`${API}/permissions_manager/create_group/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({name}),
  });

  const response = await req.json();
  
  if (req.ok) {

    return response.detail || "ثبت گروه با موفقیت انجام شد";
  } else {
    
    throw Error(convertBackendValidationToMessage(response));
  }
};

// export const deleteReq = async (id) => {
//   const req = await fetch(`${API}/users/delete_user/${id}/`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${getCookie("access")}`,
//     },
//   });

//   if (req.ok) {
//     return "حذف با موفقیت انجام شد";
//   } else {
//     const response = await req.json();
//     throw Error(response.detail || convertBackendValidationToMessage(response));
//   }
// };

export const addPermissionsReq = async (group_name, permissions) => {
  console.log(permissions)
  const promices = permissions.map((permission_id) =>
    fetch(`${API}/permissions_manager/add_permission_to_group/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("access")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ permission_id, group_name }),
    })
  );

  return Promise.all(promices);
};

export const deletePermissionsReq = async (group_name, permissions) => {
  const promices = permissions.map((permission_id) =>
    fetch(`${API}/permissions_manager/remove_permission_from_group/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("access")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ permission_id, group_name }),
    })
  );

  return Promise.all(promices);
}