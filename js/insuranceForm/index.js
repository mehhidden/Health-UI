import {
  renderInsureds,
  renderBasicOptions,
  showInsuredCreateModal,
  closeInsuredModals,
  saveInsured,
  showEditInsured,
  deleteInsured,
  deleteSelectedInsureds,
} from "./funcs/shared.js";

window.addEventListener("DOMContentLoaded", async () => {
  await renderBasicOptions();
  await renderInsureds();
});


window.showInsuredCreateModal = showInsuredCreateModal;
window.closeInsuredModals = closeInsuredModals;
window.showEditInsured = showEditInsured;
window.deleteInsured = deleteInsured;
window.deleteSelectedInsureds = deleteSelectedInsureds;
window.saveInsured = saveInsured;
