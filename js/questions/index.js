import {
  addCoverageSelect,
  addPlanSelect,
  addQuestionToTable,
  closeQuestionModals,
  createQuestion,
  deleteQuestion,
  deleteSelectedQuestions,
  editQuestion,
  removeCoverageSelect,
  removePlanSelect,
  renderQuestions,
  renderSelectBoxes,
  showQuestionCreateModal,
  showQuestionEditModal,
} from "./funcs/shared.js";

window.addEventListener("load", () => {
  renderQuestions();
  renderSelectBoxes();

  window.showQuestionCreateModal = showQuestionCreateModal;
  window.showQuestionEditModal = showQuestionEditModal;
  window.closeQuestionModals = closeQuestionModals;
  window.createQuestion = createQuestion;
  window.editQuestion = editQuestion;
  window.addQuestionToTable = addQuestionToTable;
  window.deleteQuestion = deleteQuestion;
  window.deleteSelectedQuestions = deleteSelectedQuestions;
  window.addPlanSelect = addPlanSelect;
  window.removePlanSelect = removePlanSelect;
  window.addCoverageSelect = addCoverageSelect;
  window.removeCoverageSelect = removeCoverageSelect;
});
