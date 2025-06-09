import {
  closeInsuranceModals,
  createInsuranceField,
  deleteInsuranceField,
  deleteSelectedInsuranceFields,
  editInsuranceField,
  previewInsuranceIcon,
  renderCategories,
  showEditInsuranceField,
  showInsuranceFieldCreateModal,
} from "./funcs/shared.js";

window.addEventListener("load", () => {
  renderCategories()


  window.previewInsuranceIcon = previewInsuranceIcon;
  window.showInsuranceFieldCreateModal = showInsuranceFieldCreateModal;
  window.closeInsuranceModals = closeInsuranceModals;
  window.createInsuranceField = createInsuranceField;
  window.showEditInsuranceField = showEditInsuranceField;
  window.editInsuranceField = editInsuranceField;
  window.deleteInsuranceField = deleteInsuranceField;
  window.deleteSelectedInsuranceFields = deleteSelectedInsuranceFields;
});
