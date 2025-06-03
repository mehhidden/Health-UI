import { getCookie } from "/utils/cookie.js";
import { getAccessTokenByRefresh } from "./token.js";
import { API } from "/utils/data.js";
import { cashItem } from "./cash.js";
export const protectDashboard = async () => {
  try {
    const permissions = cashItem(
      "permissions",
      "",
      async () => {
        const req = await fetch(`${API}/permissions_manager/get_permissions/`, {
          headers: {
            Authorization: `Bearer ${getCookie("access")}`,
          },
        });
      
        if (req.ok) {
          const response = await req.json();
          console.log("Permissions ->", response);
          return response;
        }
      
        await getAccessTokenByRefresh();
        protectDashboard()
      }
    )

    return permissions
  } catch (error) {
    console.log(error.message)
    location.href = "./otp.html";
  }
};
