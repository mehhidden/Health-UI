import {
  closeBankModals,
  createBank,
  deleteBankAccount,
  deleteSelectedBankAccounts,
  editBank,
  renderAccountSelectBoxes,
  renderBankAccounts,
  renderBankSelectBoxes,
  showBankAccountEditModal,
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
  window.showBankAccountEditModal  = showBankAccountEditModal
  window.editBank = editBank
});
    // Make a request to update the bank account
    // Render the bank accounts
    // Show a success message
    // Close the bank modals
    // Show an error message
