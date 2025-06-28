import {
  getTrInfo,
  insertTemplateToElement,
  select,
  setStyleToEl,
} from "../../../utils/elem.js";

import {
  fetchInsureds,
  createReq,
  deleteReq,
  editReq,
} from "./utils.js";

import { generateInsuredsTemplate } from "./template.js";

const nameInput = select("#insurer-name");
const insuredWrapper = select("#render-api");
const editModalEl = select(".insurer-edit-modal");
const editModalInput = select(".input-set-save");

const saveBtn = select(".insurer-create-modal .save-input");
const editSaveBtn = select(".insurer-edit-modal .sava-edits");

export const showInsurerCreateModal = () => {
  document.querySelector(".insurer-create-modal").classList.add("show");
};

export const closeInsurerModals = () => {
  document.querySelectorAll(".modal").forEach((modal) =>
    modal.classList.remove("show")
  );
  document.querySelectorAll("input, select").forEach((input) => (input.value = ""));
};

export const renderInsureds = async () => {
  try {
    const insureds = await fetchInsureds();
    const template = generateInsuredsTemplate(insureds);
    insertTemplateToElement(template, insuredWrapper);
  } catch {
    swal("خطا", "دریافت اطلاعات بیمه‌گرها با مشکل مواجه شد", "error");
  }
};

export const createInsurer = async (event) => {
  event.preventDefault();
  event.stopPropagation();

  const name = nameInput.value.trim();
  if (!name) return swal("نام بیمه‌گر الزامی است", "", "error");

  const formData = new FormData();
  formData.append("name", name);

  try {
    const msg = await createReq(formData);
    await renderInsureds();
    swal("موفقیت", msg, "success");
  } catch (err) {
    swal("خطا", err.message, "error");
  } finally {
    closeInsurerModals();
  }
};

export const editInsurer = async (event) => {
  event.preventDefault();
  event.stopPropagation();

  const id = editModalEl.dataset.id;
  const name = editModalInput.value.trim();

  if (!name) return swal("نام بیمه‌گر الزامی است", "", "error");

  const formData = new FormData();
  formData.append("name", name);

  try {
    const msg = await editReq(id, formData);
    await renderInsureds();
    swal("موفقیت", msg, "success");
  } catch (err) {
    swal("خطا", err.message, "error");
  } finally {
    closeInsurerModals();
  }
};

saveBtn.addEventListener("click", createInsurer);
editSaveBtn.addEventListener("click", editInsurer);

export const showEditInsurer = (event) => {
  const trInfo = getTrInfo(event);
  editModalEl.dataset.id = trInfo.id;
  editModalInput.value = trInfo.name;
  editModalEl.classList.add("show");
};

export const deleteInsurer = (event) => {
  const trInfo = getTrInfo(event);
  swal(`حذف بیمه‌گر "${trInfo.name}"؟`, "", "question").then(async (res) => {
    if (res) {
      try {
        const msg = await deleteReq(trInfo.id);
        await renderInsureds();
        swal("موفقیت", msg, "success");
      } catch (err) {
        swal("خطا", err.message, "error");
      }
    }
  });
};

export function deleteSelectedInsurers() {
  const selected = document.querySelectorAll("#render-api .insurer-checkbox:checked");

  if (selected.length === 0) {
    swal("هیچ ردیفی انتخاب نشده است.", "", "error");
    return;
  }

  swal(`آیا ${selected.length} بیمه‌گر انتخاب‌شده حذف شوند؟`, "", "question").then(
    async (result) => {
      if (result) {
        try {
          const ids = [...selected].map((cb) =>
            JSON.parse(cb.closest("tr").dataset.info).id
          );
          const requests = ids.map((id) => deleteReq(id));
          await Promise.all(requests);
          await renderInsureds();
          swal("بیمه‌گرها با موفقیت حذف شدند", "", "success");
        } catch (err) {
          swal("خطا در حذف بیمه‌گرها", err.message, "error");
        }
      }
    }
  );
}
