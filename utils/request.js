import { getCookie } from "./cookie.js";
import { API, convertBackendValidationToMessage } from "./data.js";

export const createReq = async ({ data, path, name }) => {
  const req = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await req.json();

  if (req.ok) {
    return response.detail || `ساخت ${name} با موفقیت انجام شد`;
  } else {
    throw Error(
      convertBackendValidationToMessage(response) || `خطا در ساخت  ${name}`
    );
  }
};

export const editReq = async ({ data, path, name, method = "PUT" }) => {
  const req = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await req.json();

  if (req.ok) {
    return response.detail || `ویرایش ${name} با موفقیت انجام شد`;
  } else {
    throw Error(
      convertBackendValidationToMessage(response) || `خطا در ویرایش ${name}`
    );
  }
};

export const deleteReq = async ({ path, name }) => {
  const req = await fetch(`${API}${path}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });

  if (req.ok) {
    return `حذف  ${name} با موفقیت انجام شد`;
  } else {
    const response = await req.json();
    throw Error(
      response.detail ||
        convertBackendValidationToMessage(response) ||
        `خطا در حد ف ${name}`
    );
  }
};

export const getReq = async (path) => {
  const req = await fetch(`${API}${path}`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });
  return await req.json();
};
