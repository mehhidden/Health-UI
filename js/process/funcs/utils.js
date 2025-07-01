import { getCookie } from "../../../utils/cookie.js";
import { API, convertBackendValidationToMessage } from "../../../utils/data.js";


export const FetchProcess = async () => {
  const req = await fetch(`${API}/orders/processes/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });

  const json = await req.json();
  return json.results?.results || [];
};


export const FetchProcessPlan = async () => {
  const req = await fetch(`${API}/catalog/plans/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });

  const json = await req.json();
  return json.results?.results || [];
};


export const createProcess = async (formData) => {
  const name = formData.get("name")?.trim();
  const order = parseInt(formData.get("order"), 10);
  const plan = parseInt(formData.get("plan"), 10);
  const code = `auto_${Date.now()}`;

  if (!name) throw Error("نام پردازش الزامی است.");
  if (isNaN(order)) throw Error("عدد مرحله صحیح نیست.");
  if (isNaN(plan)) throw Error("طرح انتخاب نشده است.");

  const body = JSON.stringify({ name, order, plan, code });

  const req = await fetch(`${API}/orders/processes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("access")}`,
    },
    body,
  });

  const json = await req.json();
  if (req.ok) return json.detail || "ثبت با موفقیت انجام شد";
  else throw Error(json.detail || convertBackendValidationToMessage(json));
};


export const editReq = async (id, formData) => {
  const name = formData.get("name")?.trim();
  const order = parseInt(formData.get("order"), 10);
  const plan = parseInt(formData.get("plan"), 10);

  let code = formData.get("code")?.trim();
  if (!code) {
    code = `auto_${Date.now()}`;
  }

  if (!name) throw Error("نام پردازش الزامی است.");
  if (isNaN(order)) throw Error("عدد مرحله صحیح نیست.");
  if (isNaN(plan)) throw Error("طرح انتخاب نشده است.");

  const body = JSON.stringify({ name, order, plan, code });

  const req = await fetch(`${API}/orders/processes/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("access")}`,
    },
    body,
  });

  const json = await req.json();
  if (req.ok) return json.detail || "ویرایش با موفقیت انجام شد";
  else throw Error(json.detail || convertBackendValidationToMessage(json));
};


export const deleteReq = async (id) => {
  const req = await fetch(`${API}/orders/processes/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });

  if (req.ok) return "حذف با موفقیت انجام شد";
  else {
    const json = await req.json();
    throw Error(json.detail || convertBackendValidationToMessage(json));
  }
};
