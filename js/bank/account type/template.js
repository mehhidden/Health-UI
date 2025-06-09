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
    title: 'حذف اکانت تایپ',
    text: 'آیا مطمئن هستید که می‌خواهید حذف کنید؟',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'بله، حذف کن',
    cancelButtonText: 'لغو',
  });

  if (!result.isConfirmed) return;

  try {
    await deleteAccountType(id);
    await Swal.fire('موفقیت', 'با موفقیت حذف شد', 'success');
    await loadAccountTypes();
  } catch (err) {
    Swal.fire('خطا در حذف', err.message, 'error');
  }
};

const loadAccountTypes = async () => {
  try {
    const data = await fetchAccountTypes();
    renderList(data);
  } catch (err) {
    Swal.fire('خطا در دریافت اطلاعات', err.message, 'error');
  }
};

const createAccountTypeHandler = async () => {
  const title = inputEl.value.trim();
  if (!title) return Swal.fire('خطا', 'نام را وارد کنید', 'warning');

  try {
    await createAccountType({ title });
    await Swal.fire('موفقیت', 'ثبت شد', 'success');
    inputEl.value = "";
    closeAccountTypeModals();
    await loadAccountTypes();
  } catch (err) {
    Swal.fire('خطا', err.message, 'error');
  }
};

const updateAccountTypeHandler = async () => {
  const title = editInputEl.value.trim();
  if (!title) return Swal.fire('خطا', 'نام را وارد کنید', 'warning');

  if (!editingId) return Swal.fire('خطا', 'شناسه برای ویرایش انتخاب نشده است.', 'warning');

  try {
    await updateAccountType(editingId, { title });
    await Swal.fire('موفقیت', 'بروزرسانی شد', 'success');
    closeAccountTypeModals();
    await loadAccountTypes();
  } catch (err) {
    Swal.fire('خطا', err.message, 'error');
  }
};

window.deleteSelectedAccountTypes = async () => {
  const checkboxes = document.querySelectorAll(".row-checkbox:checked");
  if (checkboxes.length === 0) {
    return Swal.fire('خطا', 'هیچ اکانتی انتخاب نشده است.', 'warning');
  }

  const result = await Swal.fire({
    title: 'حذف اکانت‌ها',
    text: 'آیا مطمئن هستید که می‌خواهید اکانت‌های انتخاب‌شده را حذف کنید؟',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'بله، حذف کن',
    cancelButtonText: 'لغو',
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
    await Swal.fire('موفقیت', 'اکانت‌های انتخاب‌شده با موفقیت حذف شدند.', 'success');
    await loadAccountTypes();
  } catch (err) {
    Swal.fire('خطا در حذف', err.message, 'error');
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
 