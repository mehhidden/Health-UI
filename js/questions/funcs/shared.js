import { convertFormDataToObj } from "../../../utils/data.js";
import {
  generateSelectOptionsTemplate,
  getTrInfo,
  insertTemplateToElement,
  selectAll,
} from "../../../utils/elem.js";
import { fetchCoverages } from "../../catalog/coverages/coverages.js";
import { fetchPlans } from "../../catalog/plans/plans.js";
import { createReq, fetchQuestions, insertQuestions } from "./utils.js";

export function showQuestionCreateModal() {
  document.querySelector(".question-create-modal").classList.add("show");
}

export function showQuestionEditModal(event) {
  document.querySelector(".question-edit-modal").classList.add("show");

  document.getElementById("edit-question-text").value = question.text;
  document.getElementById("edit-question-type").value = question.type;
  document.getElementById("edit-plan-select").value = question.planId;
  document.getElementById("edit-coverage-select").value = question.coverageId;

  document.querySelector(".question-edit-modal form").dataset.id = question.id;
}

const allModals = document.querySelectorAll(".modal");
const allModalsInputs = [...allModals].map((modal) => [
  ...modal.querySelectorAll("select, input"),
]);
export function closeQuestionModals() {
  allModals.forEach((modal) => modal.classList.remove("show"));
  allModalsInputs.forEach((inputs) =>
    inputs.forEach((input) => (input.value = ""))
  );
}

export async function createQuestion(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const objData = convertFormDataToObj(formData);

  try {
    const response = await createReq(objData);
    await renderQuestions();
    swal(response, "", "success");
    closeQuestionModals();
  } catch (error) {
    swal("خطا در ایجاد سوال", error.message, "error");
  }
}

export function editQuestion(event) {
  event.preventDefault();

  const id = event.target.dataset.id;
  const text = document.getElementById("edit-question-text").value;
  const type = document.getElementById("edit-question-type").value;
  const planId = document.getElementById("edit-plan-select").value;
  const coverageId = document.getElementById("edit-coverage-select").value;

  const updatedQuestion = { id, text, type, planId, coverageId };

  updateQuestionInTable(updatedQuestion);
  closeQuestionModals();
}

export function addQuestionToTable(question) {
  const tbody = document.getElementById("question-table-body");
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><input type="checkbox" data-id="${question.id}"></td>
    <td>${question.id}</td>
    <td>${question.planId}</td>
    <td>${question.coverageId}</td>
    <td>${question.text}</td>
    <td>${question.type === "single" ? "تک پاسخ" : "چند گزینه‌ای"}</td>
    <td>
      <button class="edit-btn" onclick='showQuestionEditModal(${JSON.stringify(
        question
      )})'>ویرایش</button>
      <button class="delete-btn" onclick='deleteQuestion(${
        question.id
      })'>حذف</button>
    </td>
  `;

  tbody.appendChild(tr);
}

export function deleteQuestion(event) {
  const trInfo = getTrInfo(event);
  swal(`آیا مطمئن از حذف ${trInfo.text} هستید ؟`, "", "question").then(
    async (res) => {
      if (res) {
        try {
          const response = await deleteReq(trInfo.id);
          await renderQuestions();
          swal(response, "", "success");
        } catch (error) {
          swal("خطا در حذف سوال", error.message, "error");
        }
      }
    }
  );
}

export function deleteSelectedQuestions() {
  document
    .querySelectorAll('#question-table-body input[type="checkbox"]:checked')
    .forEach((cb) => {
      cb.closest("tr").remove();
    });
}

export const renderQuestions = async () => {
  const questions = await fetchQuestions();
  insertQuestions(questions);
};

const planSelects = selectAll(".plan-select");
const renderPlansSelectBox = async () => {
  const plans = (await fetchPlans()).results.results;
  const planOptionsTemplate = generateSelectOptionsTemplate(
    plans,
    "id",
    "name"
  );
  planSelects.forEach((select) => {
    insertTemplateToElement(planOptionsTemplate, select, true);
  });
};
const coverageSelects = selectAll(".coverage-select");
const renderCoveragesSelectBox = async () => {
  const coverages = await fetchCoverages();
  const planOptionsTemplate = generateSelectOptionsTemplate(
    coverages,
    "id",
    "name"
  );
  coverageSelects.forEach((select) => {
    insertTemplateToElement(planOptionsTemplate, select, true);
  });
};

export const renderSelectBoxes = () => {
  renderPlansSelectBox();
  renderCoveragesSelectBox();
};
