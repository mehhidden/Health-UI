import {
  closeInsuranceModals,
  createInsuranceField,
  deleteInsuranceField,
  deleteSelectedInsuranceFields,
  editInsuranceField,
  previewInsuranceIcon,
  showEditInsuranceField,
  showInsuranceFieldCreateModal,
} from "./funcs/shared.js";

window.addEventListener("load", () => {
  window.previewInsuranceIcon = previewInsuranceIcon;
  window.showInsuranceFieldCreateModal = showInsuranceFieldCreateModal;
  window.closeInsuranceModals = closeInsuranceModals;
  window.createInsuranceField = createInsuranceField;
  window.showEditInsuranceField = showEditInsuranceField;
  window.editInsuranceField = editInsuranceField;
  window.deleteInsuranceField = deleteInsuranceField;
  window.deleteSelectedInsuranceFields = deleteSelectedInsuranceFields;
});
