
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




