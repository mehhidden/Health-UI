import {
  addQuestionToTable,
  closeQuestionModals,
  createQuestion,
  deleteQuestion,
  deleteSelectedQuestions,
  editQuestion,
  renderQuestions,
  renderSelectBoxes,
  showQuestionCreateModal,
  showQuestionEditModal,
} from "./funcs/shared.js";

window.addEventListener("load", () => {
  renderQuestions()
  renderSelectBoxes()

  window.showQuestionCreateModal = showQuestionCreateModal;
  window.showQuestionEditModal = showQuestionEditModal;
  window.closeQuestionModals = closeQuestionModals;
  window.createQuestion = createQuestion;
  window.editQuestion = editQuestion;
  window.addQuestionToTable = addQuestionToTable;
  window.deleteQuestion = deleteQuestion;
  window.deleteSelectedQuestions = deleteSelectedQuestions;
});
