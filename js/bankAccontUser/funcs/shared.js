
function showBankCreateModal() {
  const modal = document.querySelector(".bank-create-modal");
  if (modal) modal.classList.add("show");
}


function showBankEditModal() {
  const modal = document.querySelector(".bank-edit-modal");
  if (modal) modal.classList.add("show");
}


function closeBankModals() {
  document.querySelectorAll(".modal.show").forEach((modal) => {
    modal.classList.remove("show");
  });
}


