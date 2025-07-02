export const generateHealthQuestionsTemplate = (questions, assessments) =>
  questions
    .map((q) => {
      const assessmentName =
        assessments.find((a) => a.id === q.assessment)?.name || "-";
        const optionsHTML = q.options
        .map((opt) => opt.text)
        .filter(Boolean)
        .join("، ");


      return `
      <tr data-id="${q.id}">
        <td><input type="checkbox" data-id="${q.id}"></td>
        <td>${q.id}</td>
        <td>${assessmentName}</td>
        <td>${q.text}</td>
        <td>${q.question_type === "yes_no" ? "تک پاسخ" : "چند گزینه‌ای"}</td>
        <td>${optionsHTML}</td>
        <td>
          <button class="btn btn-sm edit-btn" onclick="showHealthQuestionEditModal(${
            q.id
          })">ویرایش</button>
          <button class="btn btn-sm btn-danger" onclick="deleteHealthQuestion(${
            q.id
          })">حذف</button>
        </td>
      </tr>`;
    })
    .join("");

export const generateHealthQuestionFormTemplate = (
  question = {},
  assessments = []
) => {
  const idInput = question.id
    ? `<input type="hidden" name="id" value="${question.id}" />`
    : "";
  const selectedAssessment = question.assessment || "";
  const text = question.text || "";
  const questionType = question.question_type || "yes_no";
  const options =
    Array.isArray(question.options) && question.options.length > 0
      ? question.options
      : [{ text: "" }];

  const optionsInputsHTML = options
    .map(
      (opt) => `
    <div class="d-flex align-items-center mb-2 question-text-row">
      <input
        type="text"
        class="form-control me-2"
        name="text"
        value="${opt.text || ""}"
        required
      />
      <button
        type="button"
        class="btn btn-sm btn-success me-1"
        onclick="addQuestionTextInput(this)"
        aria-label="افزودن گزینه"
      >
        <i class="fas fa-plus"></i>
      </button>
      <button
        type="button"
        class="btn btn-sm btn-danger"
        onclick="removeQuestionTextInput(this)"
        aria-label="حذف گزینه"
      >
        <i class="fas fa-minus"></i>
      </button>
    </div>`
    )
    .join("");

  const assessmentOptionsHTML = assessments
    .map(
      (a) =>
        `<option value="${a.id}" ${
          a.id === selectedAssessment ? "selected" : ""
        }>${a.name}</option>`
    )
    .join("");

  return `
    ${idInput}
    <div class="form-group mb-3">
      <label for="evaluation-form-select-edit">انتخاب فرم ارزیابی سلامت:</label>
      <select id="evaluation-form-select-edit" class="form-control" name="form" required>
        <option value="" disabled ${
          selectedAssessment ? "" : "selected"
        }>انتخاب فرم ...</option>
        ${assessmentOptionsHTML}
      </select>
    </div>

    <div class="form-group mb-3">
      <label for="question-title-edit">متن سوال:</label>
      <input
        type="text"
        class="form-control"
        id="question-title-edit"
        name="title"
        value="${text}"
        required
      />
    </div>

    <div class="form-group mb-3">
      <label for="question-type-edit">نوع سوال:</label>
      <select id="question-type-edit" name="type" class="form-control" required>
        <option value="yes_no" ${
          questionType === "yes_no" ? "selected" : ""
        }>تک پاسخ</option>
        <option value="multiple_choice" ${
          questionType === "multiple_choice" ? "selected" : ""
        }>چند گزینه‌ای</option>
      </select>
    </div>

    <div class="form-group mb-3">
      <label>متن گزینه‌ها:</label>
      <div id="question-text-edit-wrapper" class="d-flex flex-wrap gap-2">
            ${optionsInputsHTML}
        </div>


    </div>

    <button class="btn btn-primary mt-3">ذخیره</button>
  `;
};
