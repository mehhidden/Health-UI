import {
  RenderProcess,
  showProcessCreateModal,
  showProcessEditModal,
  createProcess,
  editProcess,
  deleteProcess,
  deleteSelectedProcesses,
  closeProcessModals,
} from "./funcs/shared.js";

window.addEventListener("DOMContentLoaded", () => {
  RenderProcess();
});


window.showProcessCreateModal = showProcessCreateModal;
window.showProcessEditModal = showProcessEditModal;
window.createProcess = createProcess;
window.editProcess = editProcess;
window.deleteProcess = deleteProcess;
window.deleteSelectedProcesses = deleteSelectedProcesses;
window.closeProcessModals = closeProcessModals;
