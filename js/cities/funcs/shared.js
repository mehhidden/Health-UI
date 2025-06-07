import { convertFormDataToObj } from "../../../utils/data.js";
import {
  getTrInfo,
  insertTemplateToElement,
  select,
  selectAll,
} from "../../../utils/elem.js";
import { fetchProvinces } from "../../peovinces/funcs/utils.js";
import {
  createReq,
  deleteReq,
  editReq,
  fetchCities,
  insertCities,
} from "./utils.js";

const provinceSelectBoxes = selectAll(".province-select");
const createProvinceSelectBox = select("#create-province-select");
const editProvinceSelectBox = select("#edit-province-select");

const createModalEl = select(".city-create-modal");
export function showCityCreateModal() {
  createModalEl.classList.add("show");
  createProvinceSelectBox.querySelector(`option[value='']`).selected = true;
}

const editModalEl = select(".city-edit-modal");
const editModalInput = select(".city-edit-modal input");
export function showCityEditModal(event) {
  const trInfo = getTrInfo(event);
  editModalEl.classList.add("show");
  editModalEl.dataset.id = trInfo.id;
  editModalInput.value = trInfo.name;

  editProvinceSelectBox.querySelector(
    `option[value='${trInfo.province}']`
  ).selected = true;
}

const allModalEls = selectAll(".modal");
export function closeCityModals() {
  allModalEls.forEach((modal) => modal.classList.remove("show"));
}

export function deleteCity(event) {
  const trInfo = getTrInfo(event);
  swal(`آیا شهر ${trInfo.name} حذف شود؟`, "", "question").then(
    async (result) => {
      if (result) {
        try {
          const response = await deleteReq(trInfo.id);
          await renderCities();
          console.log(response);
          swal(response, "", "success");
        } catch (error) {
          swal("خطا در حذف شهر", error.message, "error");
        }
      }
    }
  );
}

export function deleteSelectedCities() {
  const selected = selectAll(".row-checkbox:checked");
  if (!selected.length) return swal("هیچ آیتمی انتخاب نشده است", "", "warning");
  swal(`آیا ${selected.length} شهر انتخاب شده حذف شوند؟`, "", "question").then(
    async (result) => {
      if (result) {
        try {
          const infos = [...selected].map(
            (cb) => JSON.parse(cb.closest("tr").dataset.info).id
          );
          const promices = infos.map((id) => deleteReq(id));
          await Promise.all(promices);
          await renderCities();
          swal("شهرها با موفقیت حذف شدند", "", "success");
        } catch (error) {
          swal("خطا در حذف شهر", error.message, "error");
        }
      }
    }
  );
}

export const createCity = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = convertFormDataToObj(formData);
  try {
    const response = await createReq(data);
    await renderCities();
    swal(response, "", "success");
    closeCityModals();
  } catch (error) {
    swal("خطا در ایجاد شهر", error.message, "error");
  }
};

export const editCity = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = convertFormDataToObj(formData);
  const id = editModalEl.dataset.id;
  try {
    const response = await editReq(id, data);
    await renderCities();
    swal(response, "", "success");
    closeCityModals();
  } catch (error) {
    swal("خطا در ویرایش شهر", error.message, "error");
  }
};

export const renderCities = async () => {
  const cities = await fetchCities();
  insertCities(cities);
};

export const renderProvincesToSelectBoxes = async () => {
  const provinces = await fetchProvinces();
  const template = provinces
    .map(
      (province) => `<option value="${province.id}">${province.name}</option>`
    )
    .join("");
  provinceSelectBoxes.forEach((selectBox) => {
    insertTemplateToElement(template, selectBox, true);
  });
};
