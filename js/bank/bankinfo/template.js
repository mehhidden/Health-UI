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

  const banks = data.results.results || data;

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
  if (!confirm("آیا مطمئن هستید که می‌خواهید حذف کنید؟")) return;

  try {
    await deleteBank(id);
    alert("با موفقیت حذف شد");
    await FetchBankInfo();
  } catch (err) {
    alert("خطا در حذف: " + err.message);
  }
};


const FetchBankInfo = async () => {
  try {
    const data = await fetchBanks();
    ShowInformationBank(data);
  } catch (err) {
    alert("خطا در دریافت اطلاعات: " + err.message);
  }
};


const handleCreateBank = async () => {
  const name = BankNameInput.value.trim();
  if (!name) return alert("نام بانک را وارد کنید");

  try {
    await createBank({ name });
    alert("بانک جدید با موفقیت ثبت شد");
    BankNameInput.value = "";
    ModalCreate.classList.remove("show");
    await FetchBankInfo();
  } catch (err) {
    alert("خطا: " + err.message);
  }
};


const handleEditBank = async () => {
  const name = BankEditInput.value.trim();
  if (!name) return alert("نام بانک را وارد کنید");
  if (!editingBankId) return alert("شناسه‌ای برای ویرایش انتخاب نشده است.");

  try {
    await updateBank(editingBankId, { name });
    alert("بانک با موفقیت ویرایش شد");
    BankEditInput.value = "";
    editingBankId = null;
    ModalEdit.classList.remove("show");
    await FetchBankInfo();
  } catch (err) {
    alert("خطا: " + err.message);
  }
};


window.deleteSelectedBanks = async () => {
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

    alert("بانک‌های انتخاب‌شده با موفقیت حذف شدند.");
    await FetchBankInfo();
  } catch (err) {
    alert("خطا در حذف: " + err.message);
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
