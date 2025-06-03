import { getCookie } from "./cookie.js";
import { API } from "./data.js";

export const fetchAllGroups = async () => {
  try {
    const groups = await fetch(`${API}/permissions_manager/get_groups/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("access")}`,
      },
    }).then((res) => res.json()).then(data => data.groups);

    console.log(groups)
    return groups;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};