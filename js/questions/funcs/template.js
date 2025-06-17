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
    