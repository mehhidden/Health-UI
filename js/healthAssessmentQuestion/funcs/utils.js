import { getCookie } from "../../../utils/cookie.js";
import { API, convertBackendValidationToMessage } from "../../../utils/data.js";

export const FetchHealthQuestions = async () => {
  const res = await fetch(`${API}/health/health-questions/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });
  const json = await res.json();
  return json.results.results;
};

export const FetchHealthAssessments = async () => {
  const res = await fetch(`${API}/health/health-assessments/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });
  const json = await res.json();
  return json.results.results;
};

export const CreateHealthQuestion = async (data) => {
  const req = await fetch(`${API}/health/health-questions/`, {
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
    console.error("CreateHealthQuestion error:", json);
    throw Error(json.detail || convertBackendValidationToMessage(json));
  }
};

export const EditHealthQuestion = async (data, id) => {
  const req = await fetch(`${API}/health/health-questions/${id}/`, {
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

export const DeleteHealthQuestion = async (id) => {
  const req = await fetch(`${API}/health/health-questions/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });

  if (req.ok) return "حذف با موفقیت انجام شد";
  const json = await req.json();
  throw Error(json.detail || convertBackendValidationToMessage(json));
};
