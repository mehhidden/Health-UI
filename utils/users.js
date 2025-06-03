import { getCookie } from "./cookie.js";
import { API, convertBackendValidationToMessage } from "./data.js";
export const getUsers = async () => {
  const response = await fetch(`${API}/users/get_users/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  }).then((res) => res.json());

  return response;
};

export const createUser = async (data) => {
  const req = await fetch(`${API}/users/create_user/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await req.json();
  
  if (req.ok) {

    return response.detail || "ثبت نام با موفقیت انجام شد";
  } else {
    
    throw Error(convertBackendValidationToMessage(response));
  }
};
