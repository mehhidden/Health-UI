import {
  fetchPlans,
  createPlan,
  deletePlan,
  updatePlan,
} from "./plans.js";

const ShowInfoTableElam = document.querySelector("#insurance-fields-table-body");
const PlanNameInput = document.querySelector("#plan-name");
const PlanDeductionInput = document.querySelector("#plan-deduction");
const PlanProductSelect = document.querySelector("#product-plan-select");
const ModalCreate = document.querySelector(".plan-create-modal");
const ModalEdit = document.querySelector(".plan-edit-modal");
const EditPlanNameInput = document.querySelector("#edit-plan-name");
const EditFranchiseInput = document.querySelector("#edit-plan-deduction");
const EditProductSelect = document.querySelector("#edit-product-plan-select");
const EditIconInput = document.querySelector("#plan-icon-edit");
const EditIconPreview = document.querySelector("#preview-icon-edit");
const createSavePlan = document.querySelector(".create-plan");
const BtnEdits = document.querySelector(".btn-edits");

let editingPlanId = null;

const ShowInformationPlan = (data) => {
  ShowInfoTableElam.innerHTML = "";

  const plans = data.results?.results || data;

  plans.forEach((info) => {
    ShowInfoTableElam.insertAdjacentHTML("beforeend", `
      <tr data-id="${info.id}">
        <td><input type="checkbox" class="row-checkbox" /></td>
        <td>${info.id}</td>
        <td>${info.product || ''}</td>
        <td>${info.name}</td>
        <td><img src="${info.icon || 'icons/default.png'}" alt="آیکون" style="max-width: 32px;" /></td>
        <td>${info.franchise_percent || ''}٪</td>
        <td>
          <button class="btn btn-sm edit-btn" onclick="showPlanEditModal(${info.id}, '${info.name}')">ویرایش</button>
          <button class="btn btn-sm delete-btn" onclick="handleDelete(${info.id})">حذف</button>
        </td>
      </tr>
    `);
  });
};

window.showPlanEditModal = (id, name) => {
  editingPlanId = id;
  EditPlanNameInput.value = name;
  ModalEdit.classList.add("show");
};

window.handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'حذف پلن',
    text: 'آیا مطمئن هستید که می‌خواهید حذف کنید؟',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'بله، حذف کن',
    cancelButtonText: 'لغو'
  });

  if (!result.isConfirmed) return;

  try {
    await deletePlan(id);
    await Swal.fire({
      title: 'موفقیت',
      text: 'پلن با موفقیت حذف شد',
      icon: 'success',
      confirmButtonText: 'تایید'
    });
    await FetchPlanInfo();
  } catch (err) {
    Swal.fire({
      title: 'خطا در حذف',
      text: err.message,
      icon: 'error',
      confirmButtonText: 'تایید'
    });
  }
};

const FetchPlanInfo = async () => {
  try {
    const data = await fetchPlans();
    ShowInformationPlan(data);
  } catch (err) {
    Swal.fire({
      title: 'خطا در دریافت اطلاعات',
      text: err.message,
      icon: 'error',
      confirmButtonText: 'تایید'
    });
  }
};

const handleCreatePlan = async () => {
  const name = PlanNameInput.value.trim();
  const franchise_percent = PlanDeductionInput.value.trim().replace('%', '');
  const product = parseInt(PlanProductSelect.value);
  const iconFile = document.querySelector("#plan-icon-create").files[0];

  if (!name || !franchise_percent || isNaN(product) || !iconFile) {
    return Swal.fire({
      title: "هشدار",
      text: "لطفاً تمام فیلدها را کامل کنید",
      icon: "warning",
      confirmButtonText: 'تایید'
    });
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("franchise_percent", franchise_percent);
  formData.append("product", product);
  formData.append("icon", iconFile);

  try {
    const newPlan = await createPlan(formData);
    await Swal.fire({
      title: "موفقیت",
      text: "پلن جدید با موفقیت ثبت شد",
      icon: "success",
      confirmButtonText: 'تایید'
    });

    PlanNameInput.value = "";
    PlanDeductionInput.value = "";
    PlanProductSelect.value = "";
    document.querySelector("#plan-icon-create").value = "";
    document.querySelector("#preview-icon-create").style.display = "none";
    ModalCreate.classList.remove("show");

    await FetchPlanInfo();

  } catch (err) {
    Swal.fire({
      title: "خطا",
      text: err.message,
      icon: "error",
      confirmButtonText: 'تایید'
    });
  }
};

const handleEditPlan = async () => {
  const name = EditPlanNameInput.value.trim();
  const franchise_percent = EditFranchiseInput.value.trim().replace('%', '');
  const product = parseInt(EditProductSelect.value);
  const iconFile = EditIconInput.files[0];

  if (!name || !franchise_percent || isNaN(product)) {
    return Swal.fire({
      title: 'هشدار',
      text: 'تمام فیلدها را کامل کنید',
      icon: 'warning',
      confirmButtonText: 'تایید'
    });
  }

  if (!editingPlanId) {
    return Swal.fire({
      title: 'هشدار',
      text: 'شناسه‌ای برای ویرایش انتخاب نشده است.',
      icon: 'warning',
      confirmButtonText: 'تایید'
    });
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("franchise_percent", franchise_percent);
  formData.append("product", product);
  if (iconFile) {
    formData.append("icon", iconFile);
  }

  try {
    await updatePlan(editingPlanId, formData);
    await Swal.fire({
      title: 'موفقیت',
      text: 'پلن با موفقیت ویرایش شد',
      icon: 'success',
      confirmButtonText: 'تایید'
    });

    // پاک‌سازی و بستن مدال
    EditPlanNameInput.value = "";
    EditFranchiseInput.value = "";
    EditProductSelect.value = "";
    EditIconInput.value = "";
    EditIconPreview.src = "";
    EditIconPreview.style.display = "none";
    editingPlanId = null;
    ModalEdit.classList.remove("show");

    await FetchPlanInfo();
  } catch (err) {
    Swal.fire({
      title: 'خطا',
      text: err.message,
      icon: 'error',
      confirmButtonText: 'تایید'
    });
  }
};

window.deleteSelectedPlans = async () => {
  const checkboxes = document.querySelectorAll(".row-checkbox:checked");
  if (checkboxes.length === 0) {
    return Swal.fire({
      title: 'هشدار',
      text: 'هیچ پلنی انتخاب نشده است.',
      icon: 'warning',
      confirmButtonText: 'تایید'
    });
  }

  const confirm = await Swal.fire({
    title: 'حذف گروهی',
    text: 'آیا مطمئن هستید که می‌خواهید پلن‌های انتخاب‌شده را حذف کنید؟',
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
      await deletePlan(id);
    }
    await Swal.fire({
      title: 'موفقیت',
      text: 'پلن‌های انتخاب‌شده با موفقیت حذف شدند.',
      icon: 'success',
      confirmButtonText: 'تایید'
    });
    await FetchPlanInfo();
  } catch (err) {
    Swal.fire({
      title: 'خطا در حذف',
      text: err.message,
      icon: 'error',
      confirmButtonText: 'تایید'
    });
  }
};

window.closePlanModals = () => {
  ModalCreate.classList.remove("show");
  ModalEdit.classList.remove("show");
};

window.addEventListener("DOMContentLoaded", FetchPlanInfo);

createSavePlan.addEventListener("click", (event) => {
  event.preventDefault();
  handleCreatePlan();
});

BtnEdits.addEventListener("click", (event) => {
  event.preventDefault();
  handleEditPlan();
});
