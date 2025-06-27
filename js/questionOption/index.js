import {
  closeQuestionOptionModals,
  createQuestionOption,
  deleteQuestionOption,
  deleteSelectedQuestionOptions,
  renderOptions,
  renderSelectBoxes,
  showQuestionOptionCreateModal,
} from "./funcs/shared.js";

window.addEventListener("load", () => {
  renderOptions()
  renderSelectBoxes()

  window.showQuestionOptionCreateModal = showQuestionOptionCreateModal
  window.createQuestionOption = createQuestionOption
  window.closeQuestionOptionModals = closeQuestionOptionModals
  window.deleteQuestionOption = deleteQuestionOption
  window.deleteSelectedQuestionOptions = deleteSelectedQuestionOptions
});
