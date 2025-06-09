import {
  getTrInfo,
  insertTemplateToElement,
  select,
  setStyleToEl,
} from "../../../utils/elem.js";
import { generateCategoriesTemplate } from "./template.js";
import { createReq, editReq, fetchCategories } from "./utils.js";

export function previewInsuranceIcon(input, previewSelector) {
  const preview = document.querySelector(previewSelector);
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
}

export function showInsuranceFieldCreateModal() {
  document.querySelector(".insurance-create-modal").classList.add("show");
}

export function closeInsuranceModals() {
  document
    .querySelectorAll(".modal")
    .forEach((modal) => modal.classList.remove("show"));
}

const nameInput = select("#insurance-name");
const iconInput = select("#insurance-icon-create");
export async function createInsuranceField(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append("name", nameInput.value.trim());
  formData.append("icon", iconInput.files[0]);

  const name = nameInput.value.trim();
  const iconFile = iconInput.files[0];

  if (!name || !iconFile) {
    swal("نام رشته و آیکون الزامی هستند.", "", "error");
    return;
  }

  try {
    const response = await createReq(formData);
    await renderCategories();
    swal("رشته مورد نظر با موفقیت ساخته شد.", response, "success");
  } catch (error) {
    swal("رشته مورد نظر ساخته نشد.", error.message, "error");
  } finally {
    closeInsuranceModals();
    nameInput.value = "";
    iconInput.value = "";
    setStyleToEl(select(".icon-preview"), {
      display: "none",
    });
  }
}

const editModalEl = select(".insurance-edit-modal");
const editModalInput = select("#edit-insurance-name");

export function showEditInsuranceField(event) {
  const trInfo = getTrInfo(event);
  editModalEl.dataset.id = trInfo.id;

  editModalInput.value = trInfo.name;
  editModalEl.classList.add("show");
}

export async function editInsuranceField(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formObj = Object.fromEntries(formData.entries());
  if (!formObj.name) {
    swal("نام رشته الزامی است.", "", "error");
    return;
  }

  try {
    const response = await editReq(editModalEl.dataset.id, formObj);
    await renderCategories();
    swal("رشته مورد نظر با موفقیت ویرایش شد.", response, "success");
  } catch (error) {
    swal("رشته مورد نظر ویرایش نشد.", error.message, "error");
  } finally {
    closeInsuranceModals();
  }
}

export function deleteInsuranceField(button) {
  if (confirm("آیا از حذف این رشته مطمئن هستید؟")) {
    const row = button.closest("tr");
    row.remove();
  }
}

document
  .getElementById("insurance-check-all")
  .addEventListener("change", function () {
    const checked = this.checked;
    document
      .querySelectorAll("#insurance-fields-table-body .row-checkbox")
      .forEach((cb) => (cb.checked = checked));
  });

export function deleteSelectedInsuranceFields() {
  const selected = document.querySelectorAll(
    "#insurance-fields-table-body .row-checkbox:checked"
  );
  if (selected.length === 0) {
    swal("هیچ ردیفی انتخاب نشده است.", "", "error");
    return;
  }
  if (confirm("آیا از حذف موارد انتخاب‌شده مطمئن هستید؟")) {
    selected.forEach((cb) => cb.closest("tr").remove());
  }
}

const categoriesWrapper = select("#insurance-fields-table-body");
export const renderCategories = async () => {
  const categories = await fetchCategories();
  const template = generateCategoriesTemplate(categories);
  insertTemplateToElement(template, categoriesWrapper);
};
