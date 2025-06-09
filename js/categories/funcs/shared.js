import { convertFormDataToObj } from "../../../utils/data.js";
import {
  getTrInfo,
  insertTemplateToElement,
  select,
  setStyleToEl,
} from "../../../utils/elem.js";
import { generateCategoriesTemplate } from "./template.js";
import { createReq, deleteReq, editReq, fetchCategories } from "./utils.js";

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

const allModals = document.querySelectorAll(".modal");
const allModalsInputs = [...allModals].map(modal => [...modal.querySelectorAll("select, input")]);
export function closeInsuranceModals() {
  allModals.forEach((modal) => modal.classList.remove("show"));
  allModalsInputs.forEach(inputs => inputs.forEach(input => input.value = ""));
}

const nameInput = select("#insurance-name");
const iconInput = select("#insurance-icon-create");
export async function createInsuranceField(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const iconFile = iconInput.files[0];

  const formData = new FormData();
  formData.append("name",name);
  formData.append("icon", iconFile);

  

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
  const formObj = convertFormDataToObj(formData);
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

export function deleteInsuranceField(event) {
  const trInfo = getTrInfo(event);
  swal(`آیا از حذف رشته ${trInfo.name} اطمینان دارید؟`, "", "question").then(
    async (res) => {
      if (res) {
        try {
          const response = await deleteReq(trInfo.id);
          await renderCategories();
          swal(response, "", "success");
        } catch (error) {
          swal("خطا در حذف رشته بیمه", error.message, "error");
        }
      }
    }
  );
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
  swal(`آیا ${selected.length} رشته انتخاب شده حذف شوند؟`, "", "question").then(
    async (result) => {
      if (result) {
        try {
          const infos = [...selected].map(
            (cb) => JSON.parse(cb.closest("tr").dataset.info).id
          );
          const promices = infos.map((id) => deleteReq(id));
          await Promise.all(promices);
          await renderCategories();
          swal("رشته ها با موفقیت حذف شدند", "", "success");
        } catch (error) {
          swal("خطا در حذف رشته ها", error.message, "error");
        }
      }
    }
  );
}

const categoriesWrapper = select("#insurance-fields-table-body");
export const renderCategories = async () => {
  const categories = await fetchCategories();
  const template = generateCategoriesTemplate(categories);
  insertTemplateToElement(template, categoriesWrapper);
};
