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
  if (!confirm("آیا مطمئن هستید که می‌خواهید حذف کنید؟")) return;

  try {
    await deleteAccountType(id);
    alert("حذف شد");
    loadAccountTypes();
  } catch (err) {
    alert("خطا در حذف: " + err.message);
  }
};


const loadAccountTypes = async () => {
  try {
    const data = await fetchAccountTypes();
    renderList(data);
  } catch (err) {
    alert("خطا در دریافت اطلاعات: " + err.message);
  }
};


const createAccountTypeHandler = async () => {
  const title = inputEl.value.trim();
  if (!title) return alert("نام را وارد کنید");

  try {
    await createAccountType({ title });
    alert("ثبت شد");
    inputEl.value = "";
    closeAccountTypeModals();
    loadAccountTypes();
  } catch (err) {
    alert("خطا: " + err.message);
  }
};


const updateAccountTypeHandler = async () => {
  const title = editInputEl.value.trim();
  if (!title) return alert("نام را وارد کنید");

  if (!editingId) return alert("شناسه برای ویرایش انتخاب نشده است.");

  try {
    await updateAccountType(editingId, { title });
    alert("بروزرسانی شد");
    closeAccountTypeModals();
    loadAccountTypes();
  } catch (err) {
    alert("خطا: " + err.message);
  }
};

window.deleteSelectedAccountTypes = async () => {
  const checkboxes = document.querySelectorAll(".row-checkbox:checked");
  if (checkboxes.length === 0) {
    return alert("هیچ بانکی انتخاب نشده است.");
  }

  if (!confirm("آیا مطمئن هستید که می‌خواهید بانک‌های انتخاب‌شده را حذف کنید؟")) return;

  const ids = Array.from(checkboxes).map((checkbox) => {
    const row = checkbox.closest("tr");
    return row.dataset.id;
  });

  try {
    for (const id of ids) {
      await deleteBank(id);
    }

    alert("اکانت های انتخاب‌شده با موفقیت حذف شدند.");
    await FetchBankInfo();
  } catch (err) {
    alert("خطا در حذف: " + err.message);
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
