import { getCookie } from "../../../utils/cookie.js";
import { API, convertBackendValidationToMessage } from "../../../utils/data.js";
import { insertTemplateToElement, select } from "../../../utils/elem.js";
import { getReq } from "../../../utils/request.js";
import { generateQuestionsTemplate } from "./template.js";

const questionsWrapper = select("#question-table-body");
export const insertQuestions = (questions) => {
  const template = generateQuestionsTemplate(questions);
  insertTemplateToElement(template, questionsWrapper);
};

export const fetchQuestions = async () => 
  (await getReq("/questionary/questions/")).results.results;



export const editReq = async (id, data) => {
  const req = await fetch(`${API}/questionary/questions/${id}/`, {
    method: "PUT",
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

    return response.detail || "ویرایش سوال با موفقیت انجام شد";
  } else {
    
    throw Error(convertBackendValidationToMessage(response));
  }
};
