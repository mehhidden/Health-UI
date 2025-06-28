import { getCookie } from "../../../utils/cookie.js";
import { API, convertBackendValidationToMessage } from "../../../utils/data.js";

export const fetchInsureds = async () => {
  const res = await fetch(`${API}/insurance_form/forms/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });

  if (!res.ok) {
    throw new Error("خطا در دریافت بیمه‌گذاران");
  }

  const data = await res.json();
  return data.results.results;
};

export const createReq = async (dataObj) => {
  const res = await fetch(`${API}/insurance_form/forms/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataObj),
  });

  const json = await res.json();

  if (res.ok) return json.detail || "بیمه‌گذار با موفقیت ثبت شد";
  throw Error(json.detail || convertBackendValidationToMessage(json));
};

export const editReq = async (id, dataObj) => {
  const res = await fetch(`${API}/insurance_form/forms/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataObj),
  });

  const json = await res.json();

  if (res.ok) return json.detail || "بیمه‌گذار با موفقیت ویرایش شد";
  throw Error(json.detail || convertBackendValidationToMessage(json));
};

export const deleteReq = async (id) => {
  const res = await fetch(`${API}/insurance_form/forms/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });

  if (res.ok) return "بیمه‌گذار حذف شد";

  const json = await res.json();
  throw Error(json.detail || convertBackendValidationToMessage(json));
};

export const fetchBasics = async () => {
  const res = await fetch(`${API}/insurance_form/basic-insurers/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.detail || "خطا در دریافت بیمه‌گرهای پایه");
  }

  const data = await res.json();

  if (!data.results || !data.results.results) {
    throw new Error("ساختار داده بیمه‌گرهای پایه اشتباه است");
  }

  return data.results.results;
};
