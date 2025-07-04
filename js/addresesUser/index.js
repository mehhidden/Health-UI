import {
  closeAddressModals,
  renderAddress,
  renderProvincesSelectBox,
  showAddressCreateModal,
  showAddressEditModal,
} from "./funcs/shared.js";

window.addEventListener("load", () => {
  renderAddress();
  renderProvincesSelectBox();

  const addBtn = document.querySelector(
    '.btn-success[onclick="showAddressCreateModal()"]'
  );
  if (addBtn) {
    addBtn.addEventListener("click", showAddressCreateModal);
  }

  document.querySelectorAll(".edit-address-btn").forEach((btn) => {
    btn.addEventListener("click", showAddressEditModal);
  });

  document.querySelectorAll(".modal-close").forEach((span) => {
    span.addEventListener("click", closeAddressModals);
  });

  window.showAddressCreateModal = showAddressCreateModal;
  window.showAddressEditModal = showAddressEditModal;
  window.closeAddressModals = closeAddressModals;
});
