import {
  fetchAccountTypes,
  createAccountType,
  deleteAccountType,
  updateAccountType,
} from "./account type.js";

const listEl = document.querySelector("#render-account-types");

const inputEl = document.querySelector("#account-type-name");
const editInputEl = document.querySelector(".edit-account-type");

const saveAccountBtn = document.querySelector(".save-account-type");
const saveEditBtn = document.querySelector(".sava-edit-btns");

const createModal = document.querySelector(".account-type-create-modal");
const editModal = document.querySelector(".account-type-edit-modal");

let editingId = null;

const renderList = (data) => {
  listEl.innerHTML = "";
  const items = data.results.results || data;

  items.forEach((item) => {
    listEl.insertAdjacentHTML(
      "beforeend",
      `
      <tr data-id="${item.id}">
        <td><input type="checkbox" class="row-checkbox" /></td>
        <td>${item.id}</td>
        <td>${item.title}</td>
        <td>
          <button class="btn btn-info btn-sm" onclick="showAccountTypeEditModal(${item.id}, '${item.title}')">ویرایش</button>
          <button class="btn btn-danger btn-sm" onclick="deleteAccountTypeHandler(${item.id})">حذف</button>
        </td>
      </tr>
      `
    );
  });
};

window.showAccountTypeEditModal = (id, title) => {
  editingId = id;
  editInputEl.value = title;

  editModal.classList.add("show");
  createModal.classList.remove("show");
};

window.closeAccountTypeModals = () => {
  createModal.classList.remove("show");
  editModal.classList.remove("show");
  editingId = null;
  inputEl.value = "";
  editInputEl.value = "";
};

window.deleteAccountTypeHandler = async (id) => {
  const result = await Swal.fire({
    title: "حذف نوع حساب",
    text: "آیا از حذف این نوع حساب مطمئن هستید؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "بله، حذف شود",
    cancelButtonText: "لغو",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {
    await deleteAccountType(id);
    await Swal.fire({
      title: "موفقیت",
      text: "نوع حساب با موفقیت حذف شد.",
      icon: "success",
      confirmButtonText: "تایید",
    });
    await loadAccountTypes();
  } catch (err) {
    Swal.fire({
      title: "خطا در حذف",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
  }
};

const loadAccountTypes = async () => {
  try {
    const data = await fetchAccountTypes();
    renderList(data);
  } catch (err) {
    Swal.fire({
      title: "خطا در دریافت اطلاعات",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
  }
};

const createAccountTypeHandler = async () => {
  const title = inputEl.value.trim();
  if (!title)
    return Swal.fire({
      title: "هشدار",
      text: "لطفاً نام نوع حساب را وارد کنید.",
      icon: "warning",
      confirmButtonText: "تایید",
    });

  try {
    await createAccountType({ title });
    await Swal.fire({
      title: "موفقیت",
      text: "نوع حساب جدید با موفقیت ثبت شد.",
      icon: "success",
      confirmButtonText: "تایید",
    });
    inputEl.value = "";
    closeAccountTypeModals();
    await loadAccountTypes();
  } catch (err) {
    Swal.fire({
      title: "خطا",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
  }
};

const updateAccountTypeHandler = async () => {
  const title = editInputEl.value.trim();
  if (!title)
    return Swal.fire({
      title: "هشدار",
      text: "لطفاً نام نوع حساب را وارد کنید.",
      icon: "warning",
      confirmButtonText: "تایید",
    });

  if (!editingId)
    return Swal.fire({
      title: "هشدار",
      text: "هیچ نوع حسابی برای ویرایش انتخاب نشده است.",
      icon: "warning",
      confirmButtonText: "تایید",
    });

  try {
    await updateAccountType(editingId, { title });
    await Swal.fire({
      title: "موفقیت",
      text: "نوع حساب با موفقیت به‌روزرسانی شد.",
      icon: "success",
      confirmButtonText: "تایید",
    });
    closeAccountTypeModals();
    await loadAccountTypes();
  } catch (err) {
    Swal.fire({
      title: "خطا",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
  }
};

window.deleteSelectedAccountTypes = async () => {
  const checkboxes = document.querySelectorAll(".row-checkbox:checked");
  if (checkboxes.length === 0)
    return Swal.fire({
      title: "هشدار",
      text: "هیچ نوع حسابی انتخاب نشده است.",
      icon: "warning",
      confirmButtonText: "تایید",
    });

  const result = await Swal.fire({
    title: "حذف گروهی نوع حساب",
    text: `آیا از حذف ${checkboxes.length} نوع حساب انتخاب شده مطمئن هستید؟`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "بله، حذف شود",
    cancelButtonText: "لغو",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  const ids = Array.from(checkboxes).map((checkbox) => {
    const row = checkbox.closest("tr");
    return row.dataset.id;
  });

  try {
    for (const id of ids) {
      await deleteAccountType(id);
    }
    await Swal.fire({
      title: "موفقیت",
      text: "نوع حساب‌های انتخاب شده با موفقیت حذف شدند.",
      icon: "success",
      confirmButtonText: "تایید",
    });
    await loadAccountTypes();
  } catch (err) {
    Swal.fire({
      title: "خطا در حذف",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
  }
};

window.addEventListener("DOMContentLoaded", () => {
  loadAccountTypes();

  if (saveAccountBtn) {
    saveAccountBtn.addEventListener("click", (e) => {
      e.preventDefault();
      createAccountTypeHandler();
    });
  }

  if (saveEditBtn) {
    saveEditBtn.addEventListener("click", (e) => {
      e.preventDefault();
      updateAccountTypeHandler();
    });
  }
});
