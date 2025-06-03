import { setCookie, getCookie } from "./cookie.js";
import { convertBackendValidationToMessage } from "./data.js";
import { API } from "/utils/data.js";

export const saveToken = (access, refresh) => {
  setCookie(
    "access",
    access,
    7
  )

  if (refresh) {
    setCookie(
      "refresh",
      refresh,
      365
    )
  }
}

export const getTokensByInfo = async (info) => {
  const req = await fetch(`${API}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  })

  const response = await req.json();
  console.log(response)

  if (!req.ok) {
    throw Error(response.detail || convertBackendValidationToMessage(response))
  } 

  saveToken(response.access, response.refresh);
  return response.detail
}

export const getAccessTokenByRefresh = async () => {
  const refresh = getCookie("refresh");

  if (!refresh) {
    location.href = "./otp.html";
  }

  const req = await fetch(`${API}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  })

  const response = await req.json();
  if (!req.ok) {
    throw Error(response.detail || convertBackendValidationToMessage(response))
  }

  saveToken(response.access);
}