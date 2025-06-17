import { getCookie } from "../../../utils/cookie.js";
import { API, convertBackendValidationToMessage } from "../../../utils/data.js";
import { insertTemplateToElement, select } from "../../../utils/elem.js";
import { generateQuestionsTemplate } from "./template.js";

const questionsWrapper = select("#question-table-body");
export const insertQuestions = (questions) => {
  const template = generateQuestionsTemplate(questions);
  insertTemplateToElement(template, questionsWrapper);
};

export const fetchQuestions = async () => {
  const req = await fetch(`${API}/questionary/questions/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });
  return (await req.json()).results.results;
};

export const createReq = async (data) => {
  const req = await fetch(`${API}/questionary/questions/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      plans: [data.plans],
      coverages: [data.coverages],
    }),
  });

  const response = await req.json();

  if (req.ok) {
    return response.detail || "ساخت سوال با موفقیت انجام شد";
  } else {
    throw Error(convertBackendValidationToMessage(response));
  }
};


