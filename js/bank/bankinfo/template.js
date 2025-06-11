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
    ShowInfoTableElam.insertAdjacentHTML(
      "beforeend",
      `
      <tr data-id="${info.id}">
        <td><input type="checkbox" class="row-checkbox" /></td>
        <td>${info.id}</td>
        <td>${info.name}</td>
        <td>
          <button class="btn btn-info btn-sm" onclick="showBankEditModal(${info.id}, '${info.name}')">ویرایش</button>
          <button class="btn btn-danger btn-sm" onclick="handleDelete(${info.id})">حذف</button>
        </td>
      </tr>
    `
    );
  });
};

window.showBankEditModal = (id, name) => {
  editingBankId = id;
  BankEditInput.value = name;
  ModalEdit.classList.add("show");
};

window.handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "حذف بانک",
    text: "آیا از حذف این بانک مطمئن هستید؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "بله، حذف شود",
    cancelButtonText: "لغو",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {
    await deleteBank(id);
    await Swal.fire({
      title: "موفقیت",
      text: "بانک با موفقیت حذف شد.",
      icon: "success",
      confirmButtonText: "تایید",
    });
    await FetchBankInfo();
  } catch (err) {
    Swal.fire({
      title: "خطا",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
  }
};

const FetchBankInfo = async () => {
  try {
    const data = await fetchBanks();
    ShowInformationBank(data);
  } catch (err) {
    Swal.fire({
      title: "خطا در دریافت اطلاعات",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
  }
};

const handleCreateBank = async () => {
  const name = BankNameInput.value.trim();
  if (!name) {
    return Swal.fire({
      title: "هشدار",
      text: "لطفاً نام بانک را وارد کنید.",
      icon: "warning",
      confirmButtonText: "تایید",
    });
  }

  try {
    await createBank({ name });
    await Swal.fire({
      title: "موفقیت",
      text: "بانک جدید با موفقیت ثبت شد.",
      icon: "success",
      confirmButtonText: "تایید",
    });
    BankNameInput.value = "";
    ModalCreate.classList.remove("show");
    await FetchBankInfo();
  } catch (err) {
    Swal.fire({
      title: "خطا",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
  }
};

const handleEditBank = async () => {
  const name = BankEditInput.value.trim();
  if (!name) {
    return Swal.fire({
      title: "هشدار",
      text: "لطفاً نام بانک را وارد کنید.",
      icon: "warning",
      confirmButtonText: "تایید",
    });
  }
  if (!editingBankId) {
    return Swal.fire({
      title: "هشدار",
      text: "هیچ بانکی برای ویرایش انتخاب نشده است.",
      icon: "warning",
      confirmButtonText: "تایید",
    });
  }

  try {
    await updateBank(editingBankId, { name });
    await Swal.fire({
      title: "موفقیت",
      text: "بانک با موفقیت ویرایش شد.",
      icon: "success",
      confirmButtonText: "تایید",
    });
    BankEditInput.value = "";
    editingBankId = null;
    ModalEdit.classList.remove("show");
    await FetchBankInfo();
  } catch (err) {
    Swal.fire({
      title: "خطا",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
  }
};

window.deleteSelectedBanks = async () => {
  const checkboxes = document.querySelectorAll(".row-checkbox:checked");
  if (checkboxes.length === 0) {
    return Swal.fire({
      title: "هشدار",
      text: "هیچ بانکی انتخاب نشده است.",
      icon: "warning",
      confirmButtonText: "تایید",
    });
  }

  const confirm = await Swal.fire({
    title: "حذف گروهی بانک‌ها",
    text: `آیا مطمئن هستید که می‌خواهید ${checkboxes.length} بانک انتخاب‌شده را حذف کنید؟`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "بله، حذف شود",
    cancelButtonText: "لغو",
    reverseButtons: true,
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
    await Swal.fire({
      title: "موفقیت",
      text: "بانک‌های انتخاب‌شده با موفقیت حذف شدند.",
      icon: "success",
      confirmButtonText: "تایید",
    });
    await FetchBankInfo();
  } catch (err) {
    Swal.fire({
      title: "خطا در حذف",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
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
 