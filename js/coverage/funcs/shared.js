function showCoverageCreateModal() {
  document.querySelector(".coverage-create-modal").classList.add("show");
}

function showEditCoverageModal(id) {
  document.querySelector(".coverage-edit-modal").classList.add("show");
}

function closeCoverageModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.classList.remove("show");
  });
}

function createCoverage(event) {
  event.preventDefault();
  alert("پوشش جدید با موفقیت ثبت شد.");
  closeCoverageModals();
}

function editCoverage(event) {
  event.preventDefault();
  alert("تغییرات پوشش ذخیره شد.");
  closeCoverageModals();
}

function deleteCoverage(id) {
  if (confirm("آیا از حذف این پوشش اطمینان دارید؟")) {
    alert("پوشش با موفقیت حذف شد.");
  }
}

function deleteSelectedCoverages() {
  if (
    confirm("آیا مطمئن هستید که می‌خواهید پوشش‌های انتخاب‌شده را حذف کنید؟")
  ) {
    // حذف چندگانه
    alert("پوشش‌های انتخاب‌شده حذف شدند.");
  }
}
