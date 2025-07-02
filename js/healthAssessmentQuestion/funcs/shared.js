import {
  select,
  insertTemplateToElement
} from "../../../utils/elem.js";

import {
  FetchHealthQuestions,
  FetchHealthAssessments,
  CreateHealthQuestion,
  EditHealthQuestion,
  DeleteHealthQuestion,
} from "./utils.js";

import {
  generateHealthQuestionsTemplate,
  generateHealthQuestionFormTemplate,
} from "./template.js";

const questionWrapper = select("#evaluation-question-table-body");
const createModal = select(".evaluation-question-create-modal");
const editModal = select(".evaluation-question-edit-modal");
const createForm = select(".evaluation-question-create-modal form");
const editForm = select(".evaluation-question-edit-modal form");

export let cachedQuestions = [];

export const RenderHealthQuestions = async () => {
  try {
    const questions = await FetchHealthQuestions();
    const assessments = await FetchHealthAssessments();
    
    cachedQuestions = questions;
    
    const template = generateHealthQuestionsTemplate(questions, assessments);
    insertTemplateToElement(template, questionWrapper);
  } catch (error) {
    console.error("خطا در دریافت سوالات یا ارزیابی‌ها:", error);
    swal("دریافت سوالات ناموفق بود", "", "error");
  }
};

export const showHealthQuestionCreateModal = async () => {
  createModal.classList.add("show");
  editModal.classList.remove("show");

  try {
    const assessments = await FetchHealthAssessments();
    const formWrapper = createForm.querySelector("#evaluation-form-select");
    formWrapper.innerHTML =
      `<option value="" selected disabled>انتخاب فرم ...</option>` +
      assessments
        .map((a) => `<option value="${a.id}">${a.name}</option>`)
        .join("");
    createForm.reset();
  } catch {
    swal("بارگذاری فرم‌ها ناموفق بود", "", "error");
  }
};

export const showHealthQuestionEditModal = async (id) => {
  const question = cachedQuestions.find((q) => q.id == id);
  if (!question) return;

  try {
    const assessments = await FetchHealthAssessments();
    const formHTML = generateHealthQuestionFormTemplate(question, assessments);
    editForm.innerHTML = formHTML;
    editModal.classList.add("show");
    createModal.classList.remove("show");
  } catch (err) {
    console.error(err);
    swal("خطا در بارگذاری فرم ویرایش", "", "error");
  }
};

export const closeEvaluationQuestionModals = () => {
  createModal.classList.remove("show");
  editModal.classList.remove("show");
  createForm.reset();
  editForm.reset();
};

export const createEvaluationQuestion = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {
    assessment: Number(formData.get("form")),
    text: formData.get("title"),
    question_type: formData.get("type"),
    options: formData.getAll("text").filter((t) => t.trim()).map((t) => ({ text: t })),
  };

  try {
    await CreateHealthQuestion(data);
    closeEvaluationQuestionModals();
    await RenderHealthQuestions();
    swal("سوال با موفقیت اضافه شد", "", "success");
  } catch (err) {
    swal(err.message || "افزودن سوال ناموفق بود", "", "error");
  }
};

export const editEvaluationQuestions = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const id = formData.get("id");

  const data = {
    id: Number(id),
    assessment: Number(formData.get("form")),
    text: formData.get("title"),
    question_type: formData.get("type"),
    options: formData.getAll("text").filter((t) => t.trim()).map((t) => ({ text: t })),
  };

  try {
    await EditHealthQuestion(data, data.id);

    closeEvaluationQuestionModals();
    await RenderHealthQuestions();
    swal("سوال با موفقیت ویرایش شد", "", "success");
  } catch (err) {
    swal(err.message || "ویرایش ناموفق بود", "", "error");
  }
};

export const deleteHealthQuestion = (id) => {
  const question = cachedQuestions.find((q) => q.id === id);
  if (!question) return;

  swal(`آیا از حذف "${question.text}" مطمئن هستید؟`, "", "question").then(
    async (res) => {
      if (res) {
        try {
          await DeleteHealthQuestion(id);
          await RenderHealthQuestions();
          swal("سوال با موفقیت حذف شد", "", "success");
        } catch (err) {
          swal("حذف سوال ناموفق بود", "", "error");
        }
      }
    }
  );
};


export const deleteSelectedEvaluationQuestions = () => {
  const selectedCheckboxes = document.querySelectorAll(
    "input[type='checkbox']:checked[data-id]"
  );

  if (selectedCheckboxes.length === 0) {
    return swal("هیچ سوالی انتخاب نشده است", "", "warning");
  }

  swal(`آیا از حذف ${selectedCheckboxes.length} سوال مطمئن هستید؟`, "", "question")
    .then(async (confirmed) => {
      if (!confirmed) return;

      try {
        const ids = [...selectedCheckboxes].map(cb => Number(cb.dataset.id));
        await Promise.all(ids.map(id => DeleteHealthQuestion(id)));
        await RenderHealthQuestions();
        swal("سوال‌ها با موفقیت حذف شدند", "", "success");
      } catch {
        swal("حذف سوال‌ها ناموفق بود", "", "error");
      }
    });
};


export async function addQuestionTextInput(button) {
  const wrapper = button.closest("#question-text-edit-wrapper");

  if (!wrapper) return;

  const newRow = document.createElement("div");
  newRow.className = "d-flex align-items-center mb-2 question-text-row";
  newRow.innerHTML = `
    <input type="text" class="form-control me-2" name="text" required />
    <button type="button" class="btn btn-sm btn-success me-1" onclick="addQuestionTextInput(this)">
      <i class="fas fa-plus"></i>
    </button>
    <button type="button" class="btn btn-sm btn-danger" onclick="removeQuestionTextInput(this)">
      <i class="fas fa-minus"></i>
    </button>
  `;
  wrapper.appendChild(newRow);
}

export function removeQuestionTextInput(button) {
  const row = button.closest(".question-text-row");
  const wrapper = button.closest("#question-text-edit-wrapper");

  if (wrapper.querySelectorAll(".question-text-row").length > 1) {
    row.remove();
  }
}
