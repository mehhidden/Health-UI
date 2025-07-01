function showHealthFormCreateModal() {
  document.querySelector(".health-form-create-modal").classList.add("show");
}

function showHealthFormEditModal() {
  document.querySelector(".health-form-edit-modal").classList.add("show");
}

function closeHealthFormModals() {
  document.querySelector(".health-form-create-modal").classList.remove("show");
  document.querySelector(".health-form-edit-modal").classList.remove("show");
}

function addProductSelect(button) {
  const currentRow = button.closest(".product-select-row");
  const wrapper = document.getElementById("product-select-wrapper");

  const newRow = currentRow.cloneNode(true);

  const select = newRow.querySelector("select");
  select.value = "";

  wrapper.appendChild(newRow);
}

function removeProductSelect(button) {
  const wrapper = document.getElementById("product-select-wrapper");
  const rows = wrapper.querySelectorAll(".product-select-row");

  if (rows.length > 1) {
    const row = button.closest(".product-select-row");
    row.remove();
  }
}
