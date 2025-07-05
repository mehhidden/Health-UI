import {
  closeBankModals,
  createBank,
  deleteBankAccount,
  deleteSelectedBankAccounts,
  renderAccountSelectBoxes,
  renderBankAccounts,
  renderBankSelectBoxes,
  showBankCreateModal,
  showBankEditModal,
} from "./funcs/shared.js";

window.addEventListener("load", () => {
  renderBankAccounts();
  renderBankSelectBoxes();
  renderAccountSelectBoxes();
  window.createBank = createBank;
  window.showBankCreateModal = showBankCreateModal;
  window.showBankEditModal = showBankEditModal;
  window.closeBankModals = closeBankModals;
  window.deleteBankAccount = deleteBankAccount;
  window.deleteSelectedBankAccounts = deleteSelectedBankAccounts;
});
