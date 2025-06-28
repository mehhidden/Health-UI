import { getCookie } from "../../../utils/cookie.js";
import { API, convertBackendValidationToMessage } from "../../../utils/data.js";




export const fetchInsureds = async () => {
  const req = await fetch(`${API}/insurance_form/basic-insurers/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });
  return (await req.json()).results.results;
};

export const createReq = async (formData) => {
  const req = await fetch(`${API}/insurance_form/basic-insurers/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
    body: formData,
  });

  const json = await req.json();
  if (req.ok) return json.detail || "ثبت با موفقیت انجام شد";
  else throw Error(json.detail || convertBackendValidationToMessage(json));
};

export const editReq = async (id, formData) => {
  const req = await fetch(`${API}/insurance_form/basic-insurers/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
    body: formData,
  });

  const json = await req.json();
  if (req.ok) return json.detail || "ویرایش با موفقیت انجام شد";
  else throw Error(json.detail || convertBackendValidationToMessage(json));
};

export const deleteReq = async (id) => {
  const req = await fetch(`${API}/insurance_form/basic-insurers/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });

  if (req.ok) return "بیمه‌گر حذف شد";
  else {
    const json = await req.json();
    throw Error(json.detail || convertBackendValidationToMessage(json));
  }
};
