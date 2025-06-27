export const generateOptionsTemplate = (options) =>
  options.map(
    (option) =>
      `
      <tr data-info='${JSON.stringify(option)}' >
        <td><input type="checkbox" data-id="${option.id} class="form-check""></td>
        <td>${option.id}</td>
        <td>${option.question}</td>
        <td>${option.text}</td>
        <td>${option.impact_percent}%</td>
        <td>
          <button class="edit-btn" onclick="showQuestionOptionEditModal(event)">ویرایش</button>
          <button class="delete-btn" onclick="deleteQuestionOption(event)">حذف</button>
        </td>
      </tr>
    `
  ).join("");