import {
  RenderHealth,
  showHealthCreateModal,
  closeProcessModals,
  RenderCreateHealth,
  showHealthEditModal,
  RenderEditHealth,
  deleteHealth,
  deleteSelectedHealth,
  addProductSelect,
  removeProductSelect,
} from "./funcs/shared.js";

window.addEventListener("DOMContentLoaded", () => {
  RenderHealth();
});

window.createHealthForm = RenderCreateHealth;
window.editHealthForm = RenderEditHealth;

window.showHealthFormCreateModal = showHealthCreateModal;
window.closeHealthFormModals = closeProcessModals;

window.deleteHealth = deleteHealth;
window.deleteSelectedHealth = deleteSelectedHealth;
window.deleteSelectedHealthForms = deleteSelectedHealth;
window.showHealthEditModal = showHealthEditModal;


window.addProductSelect = addProductSelect;
window.removeProductSelect = removeProductSelect;
