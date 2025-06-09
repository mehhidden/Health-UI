import {
  closeInsuranceModals,
  createInsuranceField,
  deleteInsuranceField,
  deleteSelectedInsuranceFields,
  editInsuranceField,
  previewInsuranceIcon,
  renderCategoriesToSelectBoxes,
  renderProducts,
  showEditInsuranceField,
  showInsuranceFieldCreateModal,
} from "./funcs/shared.js";

window.addEventListener("load", () => {
  renderProducts()
renderCategoriesToSelectBoxes()

  window.previewInsuranceIcon = previewInsuranceIcon;
  window.showInsuranceFieldCreateModal = showInsuranceFieldCreateModal;
  window.closeInsuranceModals = closeInsuranceModals;
  window.createInsuranceField = createInsuranceField;
  window.showEditInsuranceField = showEditInsuranceField;
  window.editInsuranceField = editInsuranceField;
  window.deleteInsuranceField = deleteInsuranceField;
  window.deleteSelectedInsuranceFields = deleteSelectedInsuranceFields;
});
