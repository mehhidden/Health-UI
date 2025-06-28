import {
  closeInsurerModals,
  createInsurer,
  deleteInsurer,
  editInsurer,
  renderInsureds,
  showEditInsurer,
  showInsurerCreateModal,
  deleteSelectedInsurers, 
} from "./funcs/shared.js";

window.addEventListener("load", () => {
  renderInsureds();

  window.closeInsurerModals = closeInsurerModals;
  window.createInsurer = createInsurer;
  window.editInsurer = editInsurer;
  window.deleteInsurer = deleteInsurer;
  window.showEditInsurer = showEditInsurer;
  window.showInsurerCreateModal = showInsurerCreateModal;
  window.deleteSelectedInsurers = deleteSelectedInsurers; 
});
