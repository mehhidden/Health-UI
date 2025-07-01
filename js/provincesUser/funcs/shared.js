function showProvinceCreateModal() {
  document.querySelector('.province-create-modal').classList.add('show');
}

function showProvinceEditModal() {
  document.querySelector('.province-edit-modal').classList.add('show');
}

function closeProvinceModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('show');
  });
}
