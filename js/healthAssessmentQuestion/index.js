import {
  RenderHealthQuestions,
  showHealthQuestionCreateModal,
  closeEvaluationQuestionModals,
  createEvaluationQuestion,
  editEvaluationQuestions,
  deleteHealthQuestion,
  addQuestionTextInput,
  removeQuestionTextInput,
  showHealthQuestionEditModal,
  deleteSelectedEvaluationQuestions
} from "./funcs/shared.js";

window.addEventListener("DOMContentLoaded", () => {
  RenderHealthQuestions();
});

window.createEvaluationQuestion = createEvaluationQuestion;

window.editEvaluationQuestion = editEvaluationQuestions;

window.showEvaluationQuestionCreateModal = showHealthQuestionCreateModal;
window.closeEvaluationQuestionModals = closeEvaluationQuestionModals;

window.deleteHealthQuestion = deleteHealthQuestion;
window.showHealthQuestionEditModal = showHealthQuestionEditModal;

window.addQuestionTextInput = addQuestionTextInput;
window.removeQuestionTextInput = removeQuestionTextInput;
window.deleteSelectedEvaluationQuestions= deleteSelectedEvaluationQuestions