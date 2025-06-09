import { getCookie } from "../../../utils/cookie.js";
import { API, convertBackendValidationToMessage } from "../../../utils/data.js";



export const fetchProducts = async () => {
  const req = await fetch(`${API}/catalog/products/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });
  return (await req.json()).results.results;
};

export const deleteReq = async (id) => {
  const req = await fetch(`${API}/catalog/products/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });

  if (req.ok) {
    return "حذف  محصول بیمه با موفقیت انجام شد";
  } else {
    const response = await req.json();
    throw Error(response.detail || convertBackendValidationToMessage(response));
  }
};

export const editReq = async (id, data) => {
  const req = await fetch(`${API}/catalog/products/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await req.json();
  
  if (req.ok) {

    return response.detail || "ویرایش محصول با موفقیت انجام شد";
  } else {
    
    throw Error(convertBackendValidationToMessage(response));
  }
};

export const createReq = async (formData) => {
  const req = await fetch(`${API}/catalog/products/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
    body: formData,
  });

  const response = await req.json();
  
  if (req.ok) {

    return response.detail || "ساخت محصول با موفقیت انجام شد";
  } else {
    
    throw Error(convertBackendValidationToMessage(response));
  }
};
