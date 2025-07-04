import {
  closeAddressModals,
  createAddress,
  deleteAddress,
  deleteSelectedAddresses,
  editAddress,
  renderAddress,
  showAddressCreateModal,
  showAddressEditModal,
} from "./funcs/shared.js";

window.addEventListener("load", () => {
  renderAddress();

  const addBtn = document.querySelector(
    '.btn-success[onclick="showAddressCreateModal()"]'
  );
  if (addBtn) {
    addBtn.addEventListener("click", showAddressCreateModal);
  }

  document.querySelectorAll(".modal-close").forEach((span) => {
    span.addEventListener("click", closeAddressModals);
  });

  window.showAddressCreateModal = showAddressCreateModal;
  window.showAddressEditModal = showAddressEditModal;
  window.closeAddressModals = closeAddressModals;
  window.createAddress = createAddress;
  window.deleteAddress = deleteAddress
  window.deleteSelectedAddresses = deleteSelectedAddresses
  window.editAddress = editAddress
});
