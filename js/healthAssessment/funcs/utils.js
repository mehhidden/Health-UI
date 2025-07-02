import { getCookie } from "../../../utils/cookie.js";
import { API, convertBackendValidationToMessage } from "../../../utils/data.js";

export const FetchHealth = async () => {
  const res = await fetch(`${API}/health/health-assessments/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });
  const json = await res.json();
  return json.results.results;  
};

export const FetchProducts = async () => {
  const res = await fetch(`${API}/catalog/products/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });
  const json = await res.json();
  return json.results.results;  
};

export const CreateHealth = async (data) => {
  const req = await fetch(`${API}/health/health-assessments/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await req.json();

  if (req.ok) return json.detail || "ثبت با موفقیت انجام شد";
  else {
    console.error("CreateHealth error:", json);
    throw Error(json.detail || convertBackendValidationToMessage(json));
  }
};


export const EditHealth = async (data, id) => {
  const req = await fetch(`${API}/health/health-assessments/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await req.json();
  if (req.ok) return json.detail || "ویرایش با موفقیت انجام شد";
  else throw Error(json.detail || convertBackendValidationToMessage(json));
};

export const DeleteHealth = async (id) => {
  const req = await fetch(`${API}/health/health-assessments/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });

  if (req.ok) return "حذف با موفقیت انجام شد";
  const json = await req.json();
  throw Error(json.detail || convertBackendValidationToMessage(json));
};
