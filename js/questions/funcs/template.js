import { generateSelectOptionsTemplate } from "../../../utils/elem.js";

export const generateQuestionsTemplate = (questions) =>
  questions
    .map(
      (question) => `
        <tr data-info='${JSON.stringify(question)}'>
          <td><input type="checkbox" data-id="${question.id}"></td>
          <td>${question.id}</td>
          <td>${question.plans[0] || "تعیین نشده"}</td>
          <td>${question.coverages[0] || "تعیین نشده"}</td>
          <td>${question.text}</td>
          <td>${question.type === "yes_no" ? "تک پاسخ" : "چند گزینه‌ای"}</td>
          <td>
            <button class="edit-btn" onclick='showQuestionEditModal(event)'>ویرایش</button>
            <button class="delete-btn" onclick='deleteQuestion(event)'>حذف</button>
          </td>
        </tr>
      `
    )
    .join("");

const generatePlanSelectTemplate = (planId, allPlans) => `
  <div class="d-flex align-items-center mb-2 plan-select-row">
    <select
      class="form-control me-2 plan-select edit-plan-select"
      required
    >
      <option value="">انتخاب طرح ...</option>
      ${
        generateSelectOptionsTemplate(
          allPlans,
          "id",
          "name",
          {
            selectedValues: [planId],
          }
        )
      }
    </select>
    <button
      type="button"
      class="btn btn-sm btn-success me-1"
      onclick="addPlanSelect(this)"
        >
      +
    </button>
    <button
      type="button"
      class="btn btn-sm btn-danger"
      onclick="removePlanSelect(this)"
        >
      -
    </button>
  </div>
`

const generateCoverageSelectTemplate = (coverageId, allCoverages) => `
  <div class="d-flex align-items-center mb-2 coverage-select-row">
    <select
      class="form-control me-2 coverage-select edit-coverage-select"
      required
    >
      <option value="">انتخاب پوشش ...</option>
      ${
        generateSelectOptionsTemplate(
          allCoverages,
          "id",
          "name",
          {
            selectedValues: [coverageId],
          }
        )
      }
    </select>
    <button
      type="button"
      class="btn btn-sm btn-success me-1"
      onclick="addCoverageSelect(this)"
    >
      +
    </button>
    <button
      type="button"
      class="btn btn-sm btn-danger"
      onclick="removeCoverageSelect(this)"
    >
      -
    </button>
  </div>
`

export const generateQuestionEditFormTemplate = (question, allPlans, allCoverages) => `
  <div class="form-group mb-3">
    <label for="edit-question-text">متن سوال:</label>
    <input name="text" type="text" id="edit-question-text" class="form-control" value="${question.text}" />
  </div>

  <div class="form-group mb-3">
    <label for="edit-question-type">نوع پاسخ:</label>
    <select name="type" id="edit-question-type" class="form-control" value="${question.type}">
      <option value="yes_no">تک پاسخ</option>
      <option value="multiple_choice">چند گزینه‌ای</option>
    </select>
  </div>

  <div class="form-group mb-3">
    <label>انتخاب طرح‌ها:</label>
    <div id="plan-select-wrapper">
      ${question.plans.map((plan) => generatePlanSelectTemplate(plan, allPlans)).join("")}
    </div>
  </div>

  <div class="form-group mb-3">
    <label>انتخاب پوشش‌ها:</label>
    <div id="coverage-select-wrapper">
      ${question.coverages.map((coverage) => generateCoverageSelectTemplate(coverage, allCoverages)).join("")}
    </div>
  </div>

  <button class="btn btn-primary mt-3">ذخیره تغییرات</button>

`