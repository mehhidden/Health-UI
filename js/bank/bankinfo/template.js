import {
  fetchBanks,
  createBank,
  deleteBank,
  updateBank,
} from "./bankserver.js";

const ShowInfoTableElam = document.querySelector("#render-api");
const BankNameInput = document.querySelector("#bank-name"); 
const BankEditInput = document.querySelector(".input-set-save"); 
const createSavaBank = document.querySelector(".sava-input"); 
const ModalCreate = document.querySelector(".bank-create-modal");
const ModalEdit = document.querySelector(".bank-edit-modal");
const BtnEdits = document.querySelector(".btn-edits"); 

let editingBankId = null;


const ShowInformationBank = (data) => {
  ShowInfoTableElam.innerHTML = "";

  const banks = data.results?.results || data;

  banks.forEach((info) => {
    ShowInfoTableElam.insertAdjacentHTML("beforeend", `
      <tr data-id="${info.id}">
        <td><input type="checkbox" class="row-checkbox" /></td>
        <td>${info.id}</td>
        <td>${info.name}</td>
        <td>
          <button class="btn btn-info btn-sm" onclick="showBankEditModal(${info.id}, '${info.name}')">ویرایش</button>
          <button class="btn btn-danger btn-sm" onclick="handleDelete(${info.id})">حذف</button>
        </td>
      </tr>
    `);
  });
};


window.showBankEditModal = (id, name) => {
  editingBankId = id;
  BankEditInput.value = name;
  ModalEdit.classList.add("show");
};


window.handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'حذف بانک',
    text: 'آیا مطمئن هستید که می‌خواهید حذف کنید؟',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'بله، حذف کن',
    cancelButtonText: 'لغو'
  });

  if (!result.isConfirmed) return;

  try {
    await deleteBank(id);
    await Swal.fire('موفقیت', 'با موفقیت حذف شد', 'success');
    await FetchBankInfo();
  } catch (err) {
    Swal.fire('خطا در حذف', err.message, 'error');
  }
};


const FetchBankInfo = async () => {
  try {
    const data = await fetchBanks();
    ShowInformationBank(data);
  } catch (err) {
    Swal.fire('خطا در دریافت اطلاعات', err.message, 'error');
  }
};


const handleCreateBank = async () => {
  const name = BankNameInput.value.trim();
  if (!name) {
    return Swal.fire('هشدار', 'نام بانک را وارد کنید', 'warning');
  }

  try {
    await createBank({ name });
    await Swal.fire('موفقیت', 'بانک جدید با موفقیت ثبت شد', 'success');
    BankNameInput.value = "";
    ModalCreate.classList.remove("show");
    await FetchBankInfo();
  } catch (err) {
    Swal.fire('خطا', err.message, 'error');
  }
};


const handleEditBank = async () => {
  const name = BankEditInput.value.trim();
  if (!name) {
    return Swal.fire('هشدار', 'نام بانک را وارد کنید', 'warning');
  }
  if (!editingBankId) {
    return Swal.fire('هشدار', 'شناسه‌ای برای ویرایش انتخاب نشده است.', 'warning');
  }

  try {
    await updateBank(editingBankId, { name });
    await Swal.fire('موفقیت', 'بانک با موفقیت ویرایش شد', 'success');
    BankEditInput.value = "";
    editingBankId = null;
    ModalEdit.classList.remove("show");
    await FetchBankInfo();
  } catch (err) {
    Swal.fire('خطا', err.message, 'error');
  }
};


window.deleteSelectedBanks = async () => {
  const checkboxes = document.querySelectorAll(".row-checkbox:checked");
  if (checkboxes.length === 0) {
    return Swal.fire('هشدار', 'هیچ بانکی انتخاب نشده است.', 'warning');
  }

  const confirm = await Swal.fire({
    title: 'حذف گروهی',
    text: 'آیا مطمئن هستید که می‌خواهید بانک‌های انتخاب‌شده را حذف کنید؟',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'بله، حذف کن',
    cancelButtonText: 'لغو'
  });

  if (!confirm.isConfirmed) return;

  const ids = Array.from(checkboxes).map((checkbox) => {
    const row = checkbox.closest("tr");
    return row.dataset.id;
  });

  try {
    for (const id of ids) {
      await deleteBank(id);
    }
    await Swal.fire('موفقیت', 'بانک‌های انتخاب‌شده با موفقیت حذف شدند.', 'success');
    await FetchBankInfo();
  } catch (err) {
    Swal.fire('خطا در حذف', err.message, 'error');
  }
};


window.closeBankModals = () => {
  ModalCreate.classList.remove("show");
  ModalEdit.classList.remove("show");
};


window.addEventListener("DOMContentLoaded", FetchBankInfo);


createSavaBank.addEventListener("click", (event) => {
  event.preventDefault();
  handleCreateBank();
});


BtnEdits.addEventListener("click", (event) => {
  event.preventDefault();
  handleEditBank();
});
