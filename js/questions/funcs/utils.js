import { getCookie } from "../../../utils/cookie.js";
import { API } from "../../../utils/data.js";
import { insertTemplateToElement, select } from "../../../utils/elem.js";
import { generateQuestionsTemplate } from "./template.js";

const questionsWrapper = select("#question-table-body")
export const insertQuestions = questions => {
  const template = generateQuestionsTemplate(questions);
  insertTemplateToElement(
    template,
    questionsWrapper
  )
}

export const fetchQuestions = async () => {
  const req = await fetch(`${API}/questionary/questions/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    }
  })
  return (await req.json()).results.results
}