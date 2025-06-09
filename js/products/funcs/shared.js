import { convertFormDataToObj } from "../../../utils/data.js";
import {
  getTrInfo,
  insertTemplateToElement,
  select,
  selectAll,
  setStyleToEl,
} from "../../../utils/elem.js";
import { fetchCategories } from "../../categories/funcs/utils.js";
import { generateProductsTemplate } from "./template.js";
import { createReq, deleteReq, editReq, fetchProducts } from "./utils.js";


const categorySelectBoxes = selectAll(".category-select");
const createCategorySelectBox = select("#product-insurance-select");
const editCategorySelectBox = select("#edit-product-insurance-select");

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
  createCategorySelectBox.querySelector(`option[value='']`).selected = true;
}

const allModals = document.querySelectorAll(".modal");
const allModalsInputs = [...allModals].map(modal => [...modal.querySelectorAll("select, input")]);
export function closeInsuranceModals() {
  allModals.forEach((modal) => modal.classList.remove("show"));
  allModalsInputs.forEach(inputs => inputs.forEach(input => input.value = ""));
}



const iconInput = select("#insurance-icon-create");
export async function createInsuranceField(event) {
  event.preventDefault();
  const formDefaultData = new FormData(event.target);
  const objData = convertFormDataToObj(formDefaultData);

  const name = objData.name.trim();
  const category = objData.category;
  const iconFile = iconInput.files[0];

  const formData = new FormData();
  formData.append("name", name);
  formData.append("icon", iconFile);
  formData.append("category", category);

  

  console.log(objData)
  if (!name || !iconFile || !category) {
    swal("نام محصول و دسته بندی و آیکون الزامی هستند.", "", "error");
    return;
  }

  try {
    const response = await createReq(formData);
    await renderProducts();
    swal("محصول مورد نظر با موفقیت ساخته شد.", response, "success");
  } catch (error) {
    swal("محصول مورد نظر ساخته نشد.", error.message, "error");
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
  editCategorySelectBox.value = trInfo.category;
  editModalEl.classList.add("show");
}

export async function editInsuranceField(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formObj = convertFormDataToObj(formData);
  if (!formObj.name || !formObj.category
  ) {
    swal("نام محصول و دسته بندی الزامی هستند.", "", "error");
    return;
  }

  try {
    const response = await editReq(editModalEl.dataset.id, formObj);
    await renderProducts();
    swal("محصول مورد نظر با موفقیت ویرایش شد.", response, "success");
  } catch (error) {
    swal("محصول مورد نظر ویرایش نشد.", error.message, "error");
  } finally {
    closeInsuranceModals();
  }
}

export function deleteInsuranceField(event) {
  const trInfo = getTrInfo(event);
  swal(`آیا از حذف محصول ${trInfo.name} اطمینان دارید؟`, "", "question").then(
    async (res) => {
      if (res) {
        try {
          const response = await deleteReq(trInfo.id);
          await renderProducts();
          swal(response, "", "success");
        } catch (error) {
          swal("خطا در حذف محصول", error.message, "error");
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
  swal(`آیا ${selected.length} محصول انتخاب شده حذف شوند؟`, "", "question").then(
    async (result) => {
      if (result) {
        try {
          const infos = [...selected].map(
            (cb) => JSON.parse(cb.closest("tr").dataset.info).id
          );
          const promices = infos.map((id) => deleteReq(id));
          await Promise.all(promices);
          await renderProducts();
          swal("محصول ها با موفقیت حذف شدند", "", "success");
        } catch (error) {
          swal("خطا در حذف محصول ها", error.message, "error");
        }
      }
    }
  );
}

const productsWrapper = select("#insurance-fields-table-body");
export const renderProducts = async () => {
  const products = await fetchProducts();
  const template = generateProductsTemplate(products);
  insertTemplateToElement(template, productsWrapper);
};


export const renderCategoriesToSelectBoxes = async () => {
  const categories = await fetchCategories();
  const template = categories
    .map(
      (category) => `<option value="${category.id}">${category.name}</option>`
    )
    .join("");
    console.log(categorySelectBoxes)
  categorySelectBoxes.forEach((selectBox) => {
    insertTemplateToElement(template, selectBox, true);
  });
};
