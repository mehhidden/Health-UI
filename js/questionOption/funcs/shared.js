import { convertFormDataToObj } from "../../../utils/data.js";
import {
  generateSelectOptionsTemplate,
  getTrInfo,
  insertTemplateToElement,
  select,
  selectAll,
} from "../../../utils/elem.js";
import {
  createReq,
  deleteReq,
  editReq,
  getReq,
} from "../../../utils/request.js";
import { fetchQuestions } from "../../questions/funcs/utils.js";
import { generateOptionsTemplate } from "./template.js";

// نمایش مودال افزودن
export function showQuestionOptionCreateModal() {
  document.querySelector(".question-option-create-modal").classList.add("show");
}

const editModal = document.querySelector(".question-option-edit-modal");
const editModalInputs = [...editModal.querySelectorAll("input, select")];

export function showQuestionOptionEditModal(event) {
  editModal.classList.add("show");

  const trInfo = getTrInfo(event);
  editModal.dataset.id = trInfo.id;

  editModalInputs.forEach((input) => {
    input.value = trInfo[input.name];
  });
}

const allModals = document.querySelectorAll(".modal");
const allModalsInputs = [...allModals].map((modal) => [
  ...modal.querySelectorAll("select, input"),
]);
export function closeQuestionOptionModals() {
  allModals.forEach((modal) => modal.classList.remove("show"));
  allModalsInputs.forEach((inputs) =>
    inputs.forEach((input) => (input.value = ""))
  );
}

// ایجاد گزینه جدید
export async function createQuestionOption(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const objData = convertFormDataToObj(formData);

  try {
    const response = await createReq({
      data: objData,
      path: "/questionary/question-options/",
      name: objData.text,
    });
    closeQuestionOptionModals();

    swal(response, "", "success");
    renderOptions();
  } catch (error) {
    swal(error.messsage, "", "error");
  }
}

// ویرایش گزینه
export async function editQuestionOption(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const objData = convertFormDataToObj(formData);

  try {
    const response = await editReq({
      data: objData,
      path: `/questionary/question-options/${editModal.dataset.id}/`,
      name: objData.text,
    });
    swal(response, "", "success");
    closeQuestionOptionModals();
    renderOptions();
  } catch (error) {
    swal(error.messsage, "", "error");
  }
}

const optionsTable = select("#question-option-table-body");
export async function renderOptions() {
  const options = (await getReq("/questionary/question-options/")).results
    .results;
  const template = generateOptionsTemplate(options);

  insertTemplateToElement(template, optionsTable);
}

// حذف گزینه تکی
export function deleteQuestionOption(event) {
  const trInfo = getTrInfo(event);

  swal(`آیا از حذف "${trInfo.text}" اطمینان دارید؟`, "", "question").then(
    async (res) => {
      if (res) {
        try {
          const response = await deleteReq({
            path: `/questionary/question-options/${trInfo.id}/`,
            name: trInfo.text,
          });

          swal(response, "", "success");
          renderOptions();
        } catch (error) {
          swal(error.message, "", "error");
        }
      }
    }
  );
}

// حذف گروهی
export function deleteSelectedQuestionOptions() {
  const selected = selectAll(
    '#question-option-table-body input[type="checkbox"]:checked'
  );

  if (!selected.length) return swal("هیچ آیتمی انتخاب نشده است", "", "warning");

  swal(
    `آیا از حذف  ${selected.length} گزینه اطمینان دارید؟`,
    "",
    "question"
  ).then(async (res) => {
    if (res) {
      try {
        const infos = [...selected].map(
          (cb) => JSON.parse(cb.closest("tr").dataset.info).id
        );
        const promises = infos.map((id) =>
          deleteReq({
            path: `/questionary/question-options/${id}/`,
            name: "",
          })
        );

        await Promise.all(promises);

        swal(`حذف ${selected.length} گزینه با موفقیت انجام شد`, "", "success");
        renderOptions();
      } catch (error) {
        swal(error.message, "", "error");
      }
    }
  });
}

// انتخاب همه
// document
//   .getElementById("question-option-check-all")
//   .addEventListener("change", function () {
//     const checkboxes = document.querySelectorAll(
//       '#question-option-table-body input[type="checkbox"]'
//     );
//     checkboxes.forEach((c) => (c.checked = this.checked));
//   });
const selectBoxes = selectAll(".question-select");
export const renderSelectBoxes = async () => {
  const questions = await fetchQuestions();
  const template = generateSelectOptionsTemplate(questions, "id", "text");
  selectBoxes.forEach((select) =>
    insertTemplateToElement(template, select, true)
  );
};
