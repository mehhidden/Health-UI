import { getCookie } from "./cookie.js";
import { API } from "./data.js";

export const fetchAllPermissions = async () => {
  try {
    const permissions = await fetch(
      `${API}/permissions_manager/get_permissions/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("access")}`,
        },
      }
    ).then((res) => res.json());
    return permissions;
  } catch (error) {
    return [];
  }
};