import {
  fetchPlans,
  createPlan,
  deletePlan,
  updatePlan,
  fetchProducts,
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
let allPlans = [];
let productMap = new Map();

const ShowInformationPlan = (data) => {
  ShowInfoTableElam.innerHTML = "";
  allPlans = data.results?.results || data;

  allPlans.forEach((info) => {
    ShowInfoTableElam.insertAdjacentHTML(
      "beforeend",
      `<tr data-id="${info.id}">
        <td><input type="checkbox" class="row-checkbox" /></td>
        <td>${info.id}</td>
        <td>${productMap.get(info.product) || ""}</td>
        <td>${info.name}</td>
        <td><img src="${info.icon || "icons/default.png"}" alt="آیکون" style="max-width: 32px;" /></td>
        <td>${info.franchise_percent || ""}٪</td>
        <td>
          <button class="btn btn-sm edit-btn" onclick="showPlanEditModal(${info.id})">ویرایش</button>
          <button class="btn btn-sm delete-btn" onclick="handleDelete(${info.id})">حذف</button>
        </td>
      </tr>`
    );
  });
};

window.showPlanEditModal = (id) => {
  editingPlanId = id;
  const plan = allPlans.find((p) => p.id === id);
  if (!plan) return swal("خطا", "پلن پیدا نشد", "error");

  EditPlanNameInput.value = plan.name || "";
  EditFranchiseInput.value = plan.franchise_percent !== undefined ? plan.franchise_percent : "";
  EditProductSelect.value = plan.product || "";
  EditIconPreview.src = plan.icon || "icons/default.png";
  EditIconPreview.style.display = plan.icon ? "inline-block" : "none";
  EditIconInput.value = "";

  ModalEdit.classList.add("show");
};

window.handleDelete = async (id) => {
  swal("آیا مطمئن هستید که می‌خواهید حذف کنید؟", "", "question").then(async (willDelete) => {
    if (!willDelete) return;

    try {
      await deletePlan(id);
      swal("پلن با موفقیت حذف شد", "", "success");
      await FetchPlanInfo();
    } catch (err) {
      swal("خطا در حذف", err.message, "error");
    }
  });
};

const FetchPlanInfo = async () => {
  try {
    const data = await fetchPlans();
    ShowInformationPlan(data);
  } catch (err) {
    swal("خطا در دریافت اطلاعات", err.message, "error");
  }
};

const handleCreatePlan = async () => {
  const name = PlanNameInput.value.trim();
  const franchise_percent = PlanDeductionInput.value.trim().replace("%", "");
  const product = parseInt(PlanProductSelect.value);
  const iconFile = document.querySelector("#plan-icon-create").files[0];

  if (!name || !franchise_percent || isNaN(product) || !iconFile) {
    return swal("هشدار", "لطفاً تمام فیلدها را کامل کنید", "warning");
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("franchise_percent", franchise_percent);
  formData.append("product", product);
  formData.append("icon", iconFile);

  try {
    await createPlan(formData);
    swal("پلن جدید با موفقیت ثبت شد", "", "success");

    PlanNameInput.value = "";
    PlanDeductionInput.value = "";
    PlanProductSelect.value = "";
    document.querySelector("#plan-icon-create").value = "";
    document.querySelector("#preview-icon-create").style.display = "none";
    ModalCreate.classList.remove("show");

    await FetchPlanInfo();
  } catch (err) {
    swal("خطا", err.message, "error");
  }
};

const handleEditPlan = async () => {
  const name = EditPlanNameInput.value.trim();
  const franchise_percent = EditFranchiseInput.value.trim().replace("%", "");
  const product = parseInt(EditProductSelect.value);
  const iconFile = EditIconInput.files[0];

  if (!name || !franchise_percent || isNaN(product)) {
    return swal("هشدار", "لطفاً تمام فیلدها را به درستی پر کنید.", "warning");
  }

  if (!editingPlanId) {
    return swal("هشدار", "شناسه پلن برای ویرایش مشخص نشده است.", "warning");
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("franchise_percent", franchise_percent);
  formData.append("product", product.toString());
  if (iconFile) {
    formData.append("icon", iconFile);
  }

  try {
    await updatePlan(editingPlanId, formData);
    swal("پلن با موفقیت ویرایش شد.", "", "success");

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
    swal("خطا", err.message || "خطا در ویرایش پلن", "error");
  }
};

const loadProductOptions = async () => {
  try {
    const data = await fetchProducts();
    const products = Array.isArray(data) ? data : Array.isArray(data.results) ? data.results : Array.isArray(data.results?.results) ? data.results.results : [];

    if (!products.length) throw new Error("محصولی یافت نشد.");

    productMap.clear();
    products.forEach((p) => productMap.set(p.id, p.name));

    PlanProductSelect.innerHTML = '<option value="">انتخاب کنید...</option>';
    EditProductSelect.innerHTML = '<option value="">انتخاب کنید...</option>';

    products.forEach((product) => {
      const option1 = document.createElement("option");
      option1.value = product.id;
      option1.textContent = product.name;
      PlanProductSelect.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = product.id;
      option2.textContent = product.name;
      EditProductSelect.appendChild(option2);
    });
  } catch (error) {
    swal("خطا در بارگذاری محصولات", error.message, "error");
  }
};

window.deleteSelectedPlans = async () => {
  const checkboxes = document.querySelectorAll(".row-checkbox:checked");
  if (checkboxes.length === 0) {
    return swal("هشدار", "هیچ پلنی انتخاب نشده است.", "question");
  }

  swal("آیا مطمئن هستید که می‌خواهید پلن‌های انتخاب‌شده را حذف کنید؟", "", "question").then(async (confirm) => {
    if (!confirm) return;

    const ids = Array.from(checkboxes).map((checkbox) => {
      const row = checkbox.closest("tr");
      return row.dataset.id;
    });

    try {
      for (const id of ids) {
        await deletePlan(id);
      }
      swal("پلن‌ها با موفقیت حذف شدند", "", "success");
      await FetchPlanInfo();
    } catch (err) {
      swal("خطا در حذف", err.message, "error");
    }
  });
};

window.closePlanModals = () => {
  ModalCreate.classList.remove("show");
  ModalEdit.classList.remove("show");
};

window.addEventListener("DOMContentLoaded", () => {
  loadProductOptions();
  FetchPlanInfo();
});

createSavePlan.addEventListener("click", (event) => {
  event.preventDefault();
  handleCreatePlan();
});

BtnEdits.addEventListener("click", (event) => {
  event.preventDefault();
  handleEditPlan();
});
  