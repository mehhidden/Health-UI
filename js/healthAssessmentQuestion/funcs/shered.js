function addQuestionTextInput(button) {
  const row = button.closest(".question-text-row");
  const wrapper = document.getElementById("question-text-wrapper");
  const newRow = row.cloneNode(true);
  newRow.querySelector("input").value = "";
  wrapper.appendChild(newRow);
}

function removeQuestionTextInput(button) {
  const wrapper = document.getElementById("question-text-wrapper");
  const rows = wrapper.querySelectorAll(".question-text-row");
  if (rows.length > 1) {
    button.closest(".question-text-row").remove();
  }
}


function showEvaluationQuestionCreateModal() {
  document.querySelector(".evaluation-question-create-modal").classList.add("show");
}

function closeEvaluationQuestionModals() {
  document.querySelector(".evaluation-question-create-modal").classList.remove("show");
  document.querySelector(".evaluation-question-edit-modal").classList.remove("show");
}


