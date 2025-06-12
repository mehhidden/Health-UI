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
  const items = data.results?.results || data;

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
  swal("آیا مطمئن هستید که می‌خواهید حذف کنید؟", "", "question").then(
    async (willDelete) => {
      if (!willDelete) return;

      try {
        await deleteAccountType(id);
        swal("نوع حساب با موفقیت حذف شد", "", "success");
        await loadAccountTypes();
      } catch (err) {
        swal("خطا در حذف", err.message, "error");
      }
    }
  );
};

const loadAccountTypes = async () => {
  try {
    const data = await fetchAccountTypes();
    renderList(data);
  } catch (err) {
    swal("خطا در دریافت اطلاعات", err.message, "error");
  }
};

const createAccountTypeHandler = async () => {
  const title = inputEl.value.trim();
  if (!title) {
    return swal("لطفاً نام نوع حساب را وارد کنید.", "", "warning");
  }

  try {
    await createAccountType({ title });
    swal("نوع حساب جدید با موفقیت ثبت شد", "", "success");
    inputEl.value = "";
    closeAccountTypeModals();
    await loadAccountTypes();
  } catch (err) {
    swal("خطا", err.message, "error");
  }
};

const updateAccountTypeHandler = async () => {
  const title = editInputEl.value.trim();
  if (!title) {
    return swal("لطفاً نام نوع حساب را وارد کنید.", "", "warning");
  }
  if (!editingId) {
    return swal("هیچ نوع حسابی برای ویرایش انتخاب نشده است.", "", "warning");
  }

  try {
    await updateAccountType(editingId, { title });
    swal("نوع حساب با موفقیت ویرایش شد.", "", "success");
    closeAccountTypeModals();
    await loadAccountTypes();
  } catch (err) {
    swal("خطا", err.message, "error");
  }
};

window.deleteSelectedAccountTypes = async () => {
  const checkboxes = document.querySelectorAll(".row-checkbox:checked");
  if (checkboxes.length === 0) {
    return swal("هشدار", "هیچ نوع حسابی انتخاب نشده است.", "question");
  }

  swal(
    `آیا مطمئن هستید که می‌خواهید ${checkboxes.length} نوع حساب انتخاب‌شده را حذف کنید؟`,
    "",
    "question"
  ).then(async (confirm) => {
    if (!confirm) return;

    const ids = Array.from(checkboxes).map((checkbox) => {
      const row = checkbox.closest("tr");
      return row.dataset.id;
    });

    try {
      for (const id of ids) {
        await deleteAccountType(id);
      }
      swal("نوع حساب‌ها با موفقیت حذف شدند", "", "success");
      await loadAccountTypes();
    } catch (err) {
      swal("خطا در حذف", err.message, "error");
    }
  });
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
 