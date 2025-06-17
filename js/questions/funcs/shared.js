import { convertFormDataToObj } from "../../../utils/data.js";
import {
  generateSelectOptionsTemplate,
  getTrInfo,
  insertTemplateToElement,
  select,
  selectAll,
} from "../../../utils/elem.js";
import { fetchCoverages } from "../../catalog/coverages/coverages.js";
import { fetchPlans } from "../../catalog/plans/plans.js";
import {
  createReq,
  deleteReq,
  editReq,
  fetchQuestions,
  insertQuestions,
} from "./utils.js";

export function showQuestionCreateModal() {
  document.querySelector(".question-create-modal").classList.add("show");
}

const editModalEl = select(".question-edit-modal");
const editModalInputs = [...editModalEl.querySelectorAll("input, select")];
export function showQuestionEditModal(event) {
  const trInfo = getTrInfo(event);

  editModalEl.classList.add("show");
  editModalEl.dataset.id = trInfo.id;

  console.log(editModalInputs);

  editModalInputs.forEach((input) => {
    input.value = trInfo[input.name];
  });
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

export async function editQuestion(event) {
  event.preventDefault();

  const id = editModalEl.dataset.id;
  const formData = new FormData(event.target);
  const objData = convertFormDataToObj(formData);
  try {
    const response = await editReq(id, objData);
    await renderQuestions();
    swal(response, "", "success");
    closeQuestionModals();
  } catch (error) {
    swal("خطا در ویرایش سوال", error.message, "error");
  }
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
  const selected = selectAll(
    '#question-table-body input[type="checkbox"]:checked'
  );
  if (!selected.length) return swal("هیچ آیتمی انتخاب نشده است", "", "warning");

  swal(`آیا ${selected.length} سوال انتخاب شده حذف شوند؟`, "", "question").then(
    async (result) => {
      if (result) {
        try {
          const infos = [...selected].map(
            (cb) => JSON.parse(cb.closest("tr").dataset.info).id
          );
          const promices = infos.map((id) => deleteReq(id));
          await Promise.all(promices);
          await renderQuestions();
          swal("سوال ها با موفقیت حذف شدند", "", "success");
        } catch (error) {
          swal("خطا در حذف سوال", error.message, "error");
        }
      }
    }
  );
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
