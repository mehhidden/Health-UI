import { convertFormDataToObj } from "../../../utils/data.js";
import {
  generateSelectOptionsTemplate,
  getTrInfo,
  insertTemplateToElement,
  select,
  selectAll,
} from "../../../utils/elem.js";
import { createReq, deleteReq, editReq } from "../../../utils/request.js";
import { fetchCoverages } from "../../catalog/coverages/coverages.js";
import { fetchPlans } from "../../catalog/plans/plans.js";
import { generateQuestionEditFormTemplate } from "./template.js";
import { fetchQuestions, insertQuestions } from "./utils.js";

export function showQuestionCreateModal() {
  document.querySelector(".question-create-modal").classList.add("show");
}

let allPlans = [];
let allCoverages = [];

const editModalEl = select(".question-edit-modal");
const editModalForm = select("#edit-question-form");
export function showQuestionEditModal(event) {
  const trInfo = getTrInfo(event);

  editModalEl.classList.add("show");
  editModalEl.dataset.id = trInfo.id;

  const template = generateQuestionEditFormTemplate(
    trInfo,
    allPlans,
    allCoverages
  );

  insertTemplateToElement(template, editModalForm);
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
  const createCoverageSelects = [...selectAll(".create-coverage-select")];
  const createPlanSelects = [...selectAll(".create-plan-select")];
  objData.plans = createPlanSelects.map((select) => select.value);
  objData.coverages = createCoverageSelects.map((select) => select.value);

  try {
    const response = await createReq({
      data: objData,
      path: "/questionary/questions/",
      name: "سوال",
    });
    await renderQuestions();
    swal(response, "", "success");
    closeQuestionModals();
  } catch (error) {
    swal(error.message, "", "error");
  }
}

export async function editQuestion(event) {
  event.preventDefault();

  const id = editModalEl.dataset.id;
  const formData = new FormData(event.target);
  const objData = convertFormDataToObj(formData);
  const editCoverageSelects = [...selectAll(".edit-coverage-select")];
  const editPlanSelects = [...selectAll(".edit-plan-select")];
  objData.plans = editPlanSelects.map((select) => select.value);
  objData.coverages = editCoverageSelects.map((select) => select.value);
  try {

    const response = await editReq({
      data: objData,
      path: `/questionary/questions/${id}/`,
      name: "سوال",
    });
    await renderQuestions();
    swal(response, "", "success");
    closeQuestionModals();
  } catch (error) {
    swal(error.message, "", "error");
  }
}


export function deleteQuestion(event) {
  const trInfo = getTrInfo(event);
  swal(`آیا مطمئن از حذف ${trInfo.text} هستید ؟`, "", "question").then(
    async (res) => {
      if (res) {
        try {
          const response = await deleteReq({
            path: `/questionary/questions/${trInfo.id}/`,
            name: "سوال",
          });
          await renderQuestions();
          swal(response, "", "success");
        } catch (error) {
          swal(error.message, "", "error");
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
          const promices = infos.map((id) =>
            deleteReq({
              path: `/questionary/questions/${id}/`,
            })
          );
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
  allPlans = plans;
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
  allCoverages = coverages;
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

export function addPlanSelect(button) {
  const container = button
    .closest(".form-group")
    .querySelector("#plan-select-wrapper");
  const newRow = button.closest(".plan-select-row").cloneNode(true);
  newRow.querySelector("select").value = "";
  container.appendChild(newRow);
}

export function removePlanSelect(button) {
  const container = button
    .closest(".form-group")
    .querySelectorAll(".plan-select-row");
  if (container.length > 1) {
    button.closest(".plan-select-row").remove();
  }
}

export function addCoverageSelect(button) {
  const container = button
    .closest(".form-group")
    .querySelector("#coverage-select-wrapper");
  const newRow = button.closest(".coverage-select-row").cloneNode(true);
  newRow.querySelector("select").value = "";
  container.appendChild(newRow);
}

export function removeCoverageSelect(button) {
  const container = button
    .closest(".form-group")
    .querySelectorAll(".coverage-select-row");
  if (container.length > 1) {
    button.closest(".coverage-select-row").remove();
  }
}
