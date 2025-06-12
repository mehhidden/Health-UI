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
  swal("آیا مطمئن هستید که می‌خواهید حذف کنید؟", "", "question").then(async (willDelete) => {
    if (!willDelete) return;

    try {
      await deleteBank(id);
      swal("بانک با موفقیت حذف شد", "", "success");
      await FetchBankInfo();
    } catch (err) {
      swal("خطا در حذف", err.message, "error");
    }
  });
};

const FetchBankInfo = async () => {
  try {
    const data = await fetchBanks();
    ShowInformationBank(data);
  } catch (err) {
    swal("خطا در دریافت اطلاعات", err.message, "error");
  }
};

const handleCreateBank = async () => {
  const name = BankNameInput.value.trim();
  if (!name) {
    return swal("لطفاً نام بانک را وارد کنید.", "", "warning");
  }

  try {
    await createBank({ name });
    swal("بانک جدید با موفقیت ثبت شد", "", "success");
    BankNameInput.value = "";
    ModalCreate.classList.remove("show");
    await FetchBankInfo();
  } catch (err) {
    swal("خطا", err.message, "error");
  }
};

const handleEditBank = async () => {
  const name = BankEditInput.value.trim();
  if (!name) {
    return swal("لطفاً نام بانک را وارد کنید.", "", "warning");
  }
  if (!editingBankId) {
    return swal("هیچ بانکی برای ویرایش انتخاب نشده است.", "", "warning");
  }

  try {
    await updateBank(editingBankId, { name });
    swal("بانک با موفقیت ویرایش شد.", "", "success");
    BankEditInput.value = "";
    editingBankId = null;
    ModalEdit.classList.remove("show");
    await FetchBankInfo();
  } catch (err) {
    swal("خطا", err.message, "error");
  }
};

window.deleteSelectedBanks = async () => {
  const checkboxes = document.querySelectorAll(".row-checkbox:checked");
  if (checkboxes.length === 0) {
    return swal("هشدار", "هیچ بانکی انتخاب نشده است.", "question");
  }

  swal("آیا مطمئن هستید که می‌خواهید بانک‌های انتخاب‌شده را حذف کنید؟", "", "question").then(async (confirm) => {
    if (!confirm) return;

    const ids = Array.from(checkboxes).map((checkbox) => {
      const row = checkbox.closest("tr");
      return row.dataset.id;
    });

    try {
      for (const id of ids) {
        await deleteBank(id);
      }
      swal("بانک‌ها با موفقیت حذف شدند", "", "success");
      await FetchBankInfo();
    } catch (err) {
      swal("خطا در حذف", err.message, "error");
    }
  });
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
  