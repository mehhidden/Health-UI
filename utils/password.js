import { getCookie } from "./cookie.js";
import { API, convertBackendValidationToMessage } from "./data.js";

export const changePasswrd = async (data) => {
  const req = await fetch(`${API}/users/change_password/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await req.json();

  if (req.ok) {
    return response.detail || response;
  } else {
    throw Error(response.detail || convertBackendValidationToMessage(response));
  }
};
