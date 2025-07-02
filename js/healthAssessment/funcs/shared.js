import {
  getTrInfo,
  insertTemplateToElement,
  select,
} from "../../../utils/elem.js";

import {
  FetchHealth,
  FetchProducts,
  CreateHealth,
  EditHealth,
  DeleteHealth,
} from "./utils.js";

import {
  generateInsuredsTemplate,
  createProductSelectRow, 
} from "./template.js";

const HealthWrapper = select("#health-form-table-body");
const createModal = select(".health-form-create-modal");
const editModal = select(".health-form-edit-modal");
const createForm = select(".health-form-create-modal form");
const editForm = select(".health-form-edit-modal form");

export let cachedHealth = [];

export const RenderHealth = async () => {
  try {
    cachedHealth = await FetchHealth();
    const products = await FetchProducts();
    const template = generateInsuredsTemplate(cachedHealth, products);
    insertTemplateToElement(template, HealthWrapper);
  } catch {
    swal("دریافت لیست ناموفق بود", "", "error");
  }
};

export const showHealthCreateModal = async () => {
  createModal.classList.add("show");
  editModal.classList.remove("show");

  try {
    const products = await FetchProducts();
    const wrapper = document.getElementById("product-select-wrapper");
    wrapper.innerHTML = createProductSelectRow(products); // ✅ از template.js
    createForm.reset();
  } catch {
    swal("دریافت محصولات ناموفق بود", "", "error");
  }
};

export const showHealthEditModal = async (id) => {
  try {
    const healthItem = cachedHealth.find((h) => h.id == id);
    if (!healthItem) return;

    editModal.classList.add("show");
    createModal.classList.remove("show");

    const idInput = editForm.querySelector("input[name='id']");
    const nameInput = editForm.querySelector("input[name='name']");

    if (!idInput || !nameInput) {
      throw new Error("ورودی‌های فرم ویرایش یافت نشدند");
    }

    idInput.value = healthItem.id;
    nameInput.value = healthItem.name;

    const wrapper = document.getElementById("product-select-edit-wrapper");
    const products = await FetchProducts();

    if (Array.isArray(healthItem.products) && healthItem.products.length > 0) {
      wrapper.innerHTML = healthItem.products
        .map((pid) => createProductSelectRow(products, pid))
        .join("");
    } else {
      wrapper.innerHTML = createProductSelectRow(products);
    }
  } catch (err) {
    console.error("خطا در showHealthEditModal:", err);
    swal("بارگیری فرم ویرایش ناموفق بود", "", "error");
  }
};



export async function addProductSelect(button) {
  const wrapper =
    button.closest("#product-select-wrapper") ||
    button.closest("#product-select-edit-wrapper");
  if (!wrapper) return;
  const products = await FetchProducts();
  const newRowHTML = createProductSelectRow(products);
  wrapper.insertAdjacentHTML("beforeend", newRowHTML);
}

export function removeProductSelect(button) {
  const wrapper =
    button.closest("#product-select-wrapper") ||
    button.closest("#product-select-edit-wrapper");
  if (!wrapper) return;
  const rows = wrapper.querySelectorAll(".product-select-row");
  if (rows.length > 1) {
    button.closest(".product-select-row").remove();
  }
}

export const closeProcessModals = () => {
  createModal.classList.remove("show");
  editModal.classList.remove("show");
  createForm.reset();
  editForm.reset();
};

export const RenderCreateHealth = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const name = formData.get("name");
  const products = formData.getAll("products[]").filter((p) => p !== "");

  const data = {
    name,
    products: products.map(Number),
  };

  try {
    await CreateHealth(data);
    createModal.classList.remove("show");
    event.target.reset();
    await RenderHealth();
    swal("فرم سلامت با موفقیت ثبت شد", "", "success");
  } catch (error) {
    swal(error.message || "ذخیره موفق نبود", "", "error");
  }
};

export const RenderEditHealth = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const id = formData.get("id");
  const name = formData.get("name");
  const products = formData.getAll("products[]").filter((p) => p !== "");

  const data = {
    name,
    products: products.map(Number),
  };

  try {
    await EditHealth(data, id);
    editModal.classList.remove("show");
    event.target.reset();
    await RenderHealth();
    swal("فرم با موفقیت ویرایش شد", "", "success");
  } catch (error) {
    swal(error.message || "ویرایش موفق نبود", "", "error");
  }
};

export const deleteHealth = (id) => {
  const healthItem = cachedHealth.find((h) => h.id == id);
  if (!healthItem) return;

  swal(`آیا مطمئن از حذف "${healthItem.name}" هستید؟`, "", "question").then(
    async (res) => {
      if (res) {
        try {
          await DeleteHealth(id);
          await RenderHealth();
          swal("فرم با موفقیت حذف شد", "", "success");
        } catch (error) {
          swal(error.message || "حذف موفق نبود", "", "error");
        }
      }
    }
  );
};

export const deleteSelectedHealth = () => {
  const selected = document.querySelectorAll(
    "#health-form-table-body input[type='checkbox']:checked"
  );

  if (selected.length === 0) {
    return swal("هیچ موردی انتخاب نشده", "", "warning");
  }

  swal(`آیا ${selected.length} مورد حذف شوند؟`, "", "question").then(
    async (result) => {
      if (result) {
        try {
          const ids = [...selected].map((cb) => cb.dataset.id);
          await Promise.all(ids.map(DeleteHealth));
          await RenderHealth();
          swal("موارد با موفقیت حذف شدند", "", "success");
        } catch (error) {
          swal("حذف گروهی موفق نبود", error.message || "", "error");
        }
      }
    }
  );
};
