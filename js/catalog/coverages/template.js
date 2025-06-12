import {
  fetchPlans,
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

const renderCoverageTable = (coverages) => {
  CoverageTableBody.innerHTML = "";
  coverages.forEach((item) => {
    CoverageTableBody.insertAdjacentHTML(
      "beforeend",
      `
      <tr data-id="${item.id}">
        <td><input type="checkbox" class="row-checkbox" /></td>
        <td>${item.id}</td>
        <td>${item.plan} (${item.plan_name || "بدون نام"})</td>
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

const loadPlansToSelects = async () => {
  try {
    const plans = await fetchPlans();
    CreatePlanSelect.innerHTML = `<option value="">انتخاب طرح</option>`;
    EditPlanSelect.innerHTML = `<option value="">انتخاب طرح</option>`;
    plans.forEach((plan) => {
      const option = `<option value="${plan.id}">${plan.name}</option>`;
      CreatePlanSelect.insertAdjacentHTML("beforeend", option);
      EditPlanSelect.insertAdjacentHTML("beforeend", option);
    });
  } catch {
    swal("خطا در بارگذاری طرح‌ها", "", "error");
  }
};

const fetchAndRenderCoverages = async () => {
  try {
    const coverages = await fetchCoverages();
    const plans = await fetchPlans();
    const plansMap = {};
    plans.forEach((plan) => {
      plansMap[plan.id] = plan.name;
    });
    const allCoverages = coverages.map((cov) => ({
      ...cov,
      plan_name: plansMap[cov.plan] || "بدون نام",
    }));
    renderCoverageTable(allCoverages);
  } catch (err) {
    swal("خطا در دریافت پوشش‌ها", err.message, "error");
  }
};

window.deleteCoverage = async function (id) {
  swal(`آیا از حذف این پوشش اطمینان دارید؟`, "", "question").then(async (willDelete) => {
    if (!willDelete) return;
    try {
      await deleteCoverages(id);
      swal("پوشش با موفقیت حذف شد", "", "success");
      await fetchAndRenderCoverages();
    } catch (err) {
      swal("خطا در حذف پوشش", err.message, "error");
    }
  });
};

window.deleteSelectedCoverages = async () => {
  const checkedBoxes = document.querySelectorAll(".row-checkbox:checked");
  if (checkedBoxes.length === 0) {
    return swal("هیچ پوششی انتخاب نشده است", "", "error");
  }

  swal(
    `آیا مطمئن هستید که می‌خواهید ${checkedBoxes.length} پوشش را حذف کنید؟`,
    "",
    "question"
  ).then(async (willDelete) => {
    if (!willDelete) return;
    const ids = Array.from(checkedBoxes).map((checkbox) => {
      const tr = checkbox.closest("tr");
      return tr.dataset.id;
    });
    try {
      for (const id of ids) {
        await deleteCoverages(id);
      }
      swal("پوشش‌های انتخاب‌شده حذف شدند", "", "success");
      await fetchAndRenderCoverages();
    } catch (err) {
      swal("خطا در حذف گروهی پوشش‌ها", err.message, "error");
    }
  });
};

window.showEditCoverageModal = async function (id) {
  try {
    const coverages = await fetchCoverages();
    const plans = await fetchPlans();
    const plansMap = {};
    plans.forEach((plan) => {
      plansMap[plan.id] = plan.name;
    });
    const allCoverages = coverages.map((cov) => ({
      ...cov,
      plan_name: plansMap[cov.plan] || "بدون نام",
    }));
    const target = allCoverages.find((item) => item.id === id);
    if (!target) {
      return swal("پوشش مورد نظر پیدا نشد", "", "error");
    }
    editingCoverageId = id;
    EditPlanSelect.value = target.plan;
    EditNameInput.value = target.name;
    EditAmountInput.value = target.amount;
    EditModal.classList.add("show");
  } catch (err) {
    swal("خطا در باز کردن فرم ویرایش", err.message, "error");
  }
};

window.editCoverage = async function (e) {
  if (e) e.preventDefault();
  if (!editingCoverageId) {
    return swal("شناسه پوشش معتبر نیست", "", "error");
  }
  const formData = new FormData();
  formData.append("plan", EditPlanSelect.value);
  formData.append("name", EditNameInput.value.trim());
  formData.append("amount", EditAmountInput.value.trim());
  try {
    await updateCoverages(editingCoverageId, formData);
    swal("پوشش ویرایش شد", "", "success");
    editingCoverageId = null;
    EditModal.classList.remove("show");
    EditNameInput.value = "";
    EditAmountInput.value = "";
    EditPlanSelect.value = "";
    await fetchAndRenderCoverages();
  } catch (err) {
    swal("خطا در ویرایش پوشش", err.message, "error");
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
    swal("پوشش جدید با موفقیت ایجاد شد", "", "success");
    CreateModal.classList.remove("show");
    CreatePlanSelect.value = "";
    CreateNameInput.value = "";
    CreateAmountInput.value = "";
    await fetchAndRenderCoverages();
  } catch (err) {
    swal("خطا در ایجاد پوشش", err.message, "error");
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadPlansToSelects();
  await fetchAndRenderCoverages();

  if (createCoverageBtn) {
    createCoverageBtn.addEventListener("click", window.createCoverage);
  }
  if (editCoverageBtn) {
    editCoverageBtn.addEventListener("click", window.editCoverage);
  }
  if (bulkDeleteBtn) {
    bulkDeleteBtn.addEventListener("click", window.deleteSelectedCoverages);
  }
});
  