import {
  fetchCoverages,
  createCoverages,
  deleteCoverages,
  updateCoverages,
} from "./coverages.js";

const CoverageTableBody = document.querySelector("#coverage-table-body");
const CreateModal = document.querySelector(".coverage-create-modal");
const EditModal = document.querySelector(".coverage-edit-modal");

const CreatePlanSelect = document.querySelector("#plan-select");
const CreateNameInput = document.querySelector("#coverage-name");
const CreateAmountInput = document.querySelector("#coverage-amount");

const EditPlanSelect = document.querySelector("#edit-plan-select");
const EditNameInput = document.querySelector("#edit-coverage-name");
const EditAmountInput = document.querySelector("#edit-coverage-amount");

const createCoverageBtn = document.querySelector(".create-coverage-btn");
const editCoverageBtn = document.querySelector(".edit-coverage-btn");

const bulkDeleteBtn = document.querySelector(".bulk-delete-btn");

let editingCoverageId = null;


const renderCoverageTable = (data) => {
  CoverageTableBody.innerHTML = "";

  const coverages = data.results?.results || data;

  coverages.forEach((item) => {
    CoverageTableBody.insertAdjacentHTML(
      "beforeend",
      `
      <tr data-id="${item.id}">
        <td><input type="checkbox" class="row-checkbox" /></td>
        <td>${item.id}</td>
        <td>${item.plan}</td>
        <td>${item.name}</td>
        <td>${parseInt(item.amount).toLocaleString()}</td>
        <td>
          <button class="btn btn-sm edit-btn" onclick="showEditCoverageModal(${item.id})">ویرایش</button>
          <button class="btn btn-sm delete-btn" onclick="deleteCoverage(${item.id})">حذف</button>
        </td>
      </tr>
      `
    );
  });
};


const fetchAndRenderCoverages = async () => {
  try {
    const data = await fetchCoverages();
    renderCoverageTable(data);
  } catch (err) {
    Swal.fire({
      title: "خطا",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
  }
};


window.deleteCoverage = async function (id) {
  const result = await Swal.fire({
    title: "حذف پوشش",
    text: "آیا مطمئن هستید که می‌خواهید این پوشش را حذف کنید؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "بله، حذف کن",
    cancelButtonText: "لغو",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteCoverages(id);
    await Swal.fire({
      title: "موفقیت",
      text: "پوشش با موفقیت حذف شد",
      icon: "success",
      confirmButtonText: "تایید",
    });
    await fetchAndRenderCoverages();
  } catch (err) {
    Swal.fire({
      title: "خطا",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
  }
};


window.deleteSelectedCoverages = async () => {
  const checkedBoxes = document.querySelectorAll(".row-checkbox:checked");

  if (checkedBoxes.length === 0) {
    return Swal.fire({
      title: "هشدار",
      text: "هیچ پوششی انتخاب نشده است.",
      icon: "warning",
      confirmButtonText: "تایید",
    });
  }

  const result = await Swal.fire({
    title: "حذف گروهی پوشش‌ها",
    text: `آیا مطمئن هستید که می‌خواهید ${checkedBoxes.length} پوشش را حذف کنید؟`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "بله، حذف کن",
    cancelButtonText: "لغو",
  });

  if (!result.isConfirmed) return;

  const ids = Array.from(checkedBoxes).map((checkbox) => {
    const tr = checkbox.closest("tr");
    return tr.dataset.id;
  });

  try {
    for (const id of ids) {
      await deleteCoverages(id);
    }
    await Swal.fire({
      title: "موفقیت",
      text: "پوشش‌های انتخاب‌شده حذف شدند",
      icon: "success",
      confirmButtonText: "تایید",
    });
    await fetchAndRenderCoverages();
  } catch (err) {
    Swal.fire({
      title: "خطا",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
  }
};


window.showEditCoverageModal = async function (id) {
  try {
    const allCoverages = await fetchCoverages();
    const target =
      allCoverages.results?.results?.find((item) => item.id === id) ||
      allCoverages.find((item) => item.id === id);

    if (!target) {
      return Swal.fire({
        title: "خطا",
        text: "پوشش پیدا نشد",
        icon: "error",
        confirmButtonText: "تایید",
      });
    }

    editingCoverageId = id;
    EditPlanSelect.value = target.plan;
    EditNameInput.value = target.name;
    EditAmountInput.value = target.amount;

    EditModal.classList.add("show");
  } catch (err) {
    Swal.fire({
      title: "خطا",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
  }
};


window.editCoverage = async function (e) {
  if (e) e.preventDefault();

  if (!editingCoverageId) {
    return Swal.fire({
      title: "خطا",
      text: "شناسه‌ای برای ویرایش مشخص نشده",
      icon: "error",
      confirmButtonText: "تایید",
    });
  }

  const formData = new FormData();
  formData.append("plan", EditPlanSelect.value);
  formData.append("name", EditNameInput.value.trim());
  formData.append("amount", EditAmountInput.value.trim());

  try {
    await updateCoverages(editingCoverageId, formData);
    await Swal.fire({
      title: "موفقیت",
      text: "پوشش ویرایش شد",
      icon: "success",
      confirmButtonText: "تایید",
    });

    editingCoverageId = null;
    EditModal.classList.remove("show");
    EditNameInput.value = "";
    EditAmountInput.value = "";
    EditPlanSelect.value = "";

    await fetchAndRenderCoverages();
  } catch (err) {
    Swal.fire({
      title: "خطا",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
  }
};


window.createCoverage = async function (e) {
  if (e) e.preventDefault();

  const formData = new FormData();
  formData.append("plan", CreatePlanSelect.value);
  formData.append("name", CreateNameInput.value.trim());
  formData.append("amount", CreateAmountInput.value.trim());

  try {
    await createCoverages(formData);
    await Swal.fire({
      title: "موفقیت",
      text: "پوشش با موفقیت ثبت شد",
      icon: "success",
      confirmButtonText: "تایید",
    });

    CreateModal.classList.remove("show");
    CreateNameInput.value = "";
    CreateAmountInput.value = "";
    CreatePlanSelect.value = "";

    await fetchAndRenderCoverages();
  } catch (err) {
    Swal.fire({
      title: "خطا",
      text: err.message,
      icon: "error",
      confirmButtonText: "تایید",
    });
  }
};


window.closeCoverageModals = () => {
  CreateModal.classList.remove("show");
  EditModal.classList.remove("show");
};


window.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderCoverages();

  bulkDeleteBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    deleteSelectedCoverages();
  });

  createCoverageBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    window.createCoverage(event);
  });

  editCoverageBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    window.editCoverage(event);
  });
});
