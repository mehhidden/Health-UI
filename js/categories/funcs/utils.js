import { getCookie } from "../../../utils/cookie.js";
import { API, convertBackendValidationToMessage } from "../../../utils/data.js";



export const fetchCategories = async () => {
  const req = await fetch(`${API}/catalog/categories/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });
  return (await req.json()).results.results;
};

export const editReq = async (id, data) => {
  const req = await fetch(`${API}/catalog/categories/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await req.json();
  
  if (req.ok) {

    return response.detail || "ویرایش رشته با موفقیت انجام شد";
  } else {
    
    throw Error(convertBackendValidationToMessage(response));
  }
};

export const createReq = async (formData) => {
  const req = await fetch(`${API}/catalog/categories/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
    body: formData,
  });

  const response = await req.json();
  
  if (req.ok) {

    return response.detail || "ساخت رشته با موفقیت انجام شد";
  } else {
    
    throw Error(convertBackendValidationToMessage(response));
  }
};
