import {
  closeBankModals,
  createBank,
  renderAccountSelectBoxes,
  renderBankSelectBoxes,
  showBankCreateModal,
  showBankEditModal,
} from "./funcs/shared.js";

window.addEventListener("load", () => {
  renderBankSelectBoxes();
  renderAccountSelectBoxes();
  window.createBank = createBank;
  window.showBankCreateModal = showBankCreateModal;
  window.showBankEditModal = showBankEditModal;
  window.closeBankModals = closeBankModals;
});
