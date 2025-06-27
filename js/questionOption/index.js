import {
  closeQuestionOptionModals,
  createQuestionOption,
  deleteQuestionOption,
  deleteSelectedQuestionOptions,
  editQuestionOption,
  renderOptions,
  renderSelectBoxes,
  showQuestionOptionCreateModal,
  showQuestionOptionEditModal,
} from "./funcs/shared.js";

window.addEventListener("load", () => {
  renderOptions()
  renderSelectBoxes()

  window.showQuestionOptionCreateModal = showQuestionOptionCreateModal
  window.createQuestionOption = createQuestionOption
  window.closeQuestionOptionModals = closeQuestionOptionModals
  window.deleteQuestionOption = deleteQuestionOption
  window.deleteSelectedQuestionOptions = deleteSelectedQuestionOptions
  window.showQuestionOptionEditModal = showQuestionOptionEditModal
  window.editQuestionOption = editQuestionOption
});
