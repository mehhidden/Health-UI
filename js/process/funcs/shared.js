import {
  getTrInfo,
  insertTemplateToElement,
  select,
} from "../../../utils/elem.js";

import {
  FetchProcess,
  FetchProcessPlan,
  createProcess as apiCreateProcess,
  editReq,
  deleteReq,
} from "./utils.js";

import { generateInsuredsTemplate } from "./template.js";

const processWrapper = select("#process-table-body");
const createModal = select(".process-create-modal");
const editModal = select(".process-edit-modal");
const processPlanSelect = select("#process-plan");
const createForm = select(".process-create-modal form");
const editForm = select(".process-edit-modal form");

const editInputs = {
  name: select("#edit-process-name"),
  step: select("#edit-process-step"),
  plan: select("#edit-process-plan"),
};

export const RenderProcess = async () => {
  try {
    const processes = await FetchProcess();
    const plans = await FetchProcessPlan();
    
    const reversedProcesses = processes.slice().reverse();

    const template = generateInsuredsTemplate(reversedProcesses, plans);
    insertTemplateToElement(template, processWrapper);
  } catch (err) {
    console.error("خطا در دریافت لیست فرآیند:", err);
    swal("خطا", "دریافت لیست ناموفق بود", "error");
  }
};


export const showProcessCreateModal = async () => {
  createModal.classList.add("show");
  editModal.classList.remove("show");

  try {
    const plans = await FetchProcessPlan();
    processPlanSelect.innerHTML = '<option value="" disabled selected>طرح را انتخاب کنید</option>';
    plans.forEach(plan => {
      const option = document.createElement("option");
      option.value = plan.id;
      option.textContent = plan.name;
      processPlanSelect.appendChild(option);
    });
    createForm.reset();
  } catch (error) {
    console.error(error);
    swal("خطا", "دریافت طرح‌ها ناموفق بود", "error");
  }
};

export const closeProcessModals = () => {
  createModal.classList.remove("show");
  editModal.classList.remove("show");
  createForm.reset();
  editForm.reset();
};

export const createProcess = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  try {
    await apiCreateProcess(formData);
    createModal.classList.remove("show");
    event.target.reset();
    await RenderProcess();
    swal("موفق", "پردازش با موفقیت اضافه شد", "success");
  } catch (error) {
    console.error(error);
    swal("خطا", error.message || "ذخیره پردازش موفق نبود", "error");
  }
};

export const showProcessEditModal = async (id) => {
  try {
    const processes = await FetchProcess();
    const proc = processes[id];
    if (!proc) return swal("خطا", "پردازش یافت نشد", "error");

    const plans = await FetchProcessPlan();
    editInputs.plan.innerHTML = '<option disabled selected>طرح را انتخاب کنید</option>';
    plans.forEach(plan => {
      const opt = document.createElement("option");
      opt.value = plan.id;
      opt.textContent = plan.name;
      if (plan.id === proc.plan) opt.selected = true;
      editInputs.plan.appendChild(opt);
    });

    editInputs.name.value = proc.name || "";
    editInputs.step.value = proc.order || "";
    editForm.dataset.id = proc.id;

    createModal.classList.remove("show");
    editModal.classList.add("show");
  } catch (error) {
    console.error(error);
    swal("خطا", "باز کردن فرم ویرایش ناموفق بود", "error");
  }
};

export const editProcess = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const id = editForm.dataset.id;

  try {
    await editReq(id, formData);
    editModal.classList.remove("show");
    await RenderProcess();
    swal("موفق", "ویرایش با موفقیت انجام شد", "success");
  } catch (e) {
    console.error(e);
    swal("خطا", e.message || "ویرایش انجام نشد", "error");
  }
};

export const deleteProcess = async (id) => {
  try {
    const processes = await FetchProcess();
    const proc = processes[id];
    if (!proc) return swal("خطا", "پردازش یافت نشد", "error");

    swal(`آیا پردازش "${proc.name}" حذف شود؟`, "", "question").then(async (res) => {
      if (res) {
        try {
          const msg = await deleteReq(proc.id);
          await RenderProcess();
          swal("حذف شد", msg, "success");
        } catch (err) {
          swal("خطا", err.message || "خطا در حذف", "error");
        }
      }
    });
  } catch (error) {
    console.error(error);
    swal("خطا", "خطا در عملیات حذف", "error");
  }
};

export const deleteSelectedProcesses = () => {
  const selected = document.querySelectorAll("#process-table-body input[type='checkbox']:checked");
  if (selected.length === 0) return swal("هیچ ردیفی انتخاب نشده است.", "", "error");

  swal(`آیا ${selected.length} پردازش حذف شود؟`, "", "question").then(async (res) => {
    if (res) {
      try {
        const processes = await FetchProcess();
        const ids = [...selected].map(cb => {
          const index = cb.dataset.index;
          return processes[index]?.id;
        }).filter(Boolean);

        await Promise.all(ids.map(deleteReq));
        await RenderProcess();
        swal("حذف شد", "پردازش‌های انتخاب‌شده حذف شدند", "success");
      } catch (err) {
        swal("خطا", err.message || "خطا در حذف دسته‌ای", "error");
      }
    }
  });
};
