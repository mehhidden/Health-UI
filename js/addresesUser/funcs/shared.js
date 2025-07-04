import { extractObjFromFormEvent } from "../../../utils/data.js";
import {
  generateSelectOptionsTemplate,
  getTrInfo,
  insertTemplateToElement,
  selectAll,
} from "../../../utils/elem.js";
import { createReq, deleteReq, getReq } from "../../../utils/request.js";
import { fetchCities } from "../../cities/funcs/utils.js";
import { fetchProvinces } from "../../peovinces/funcs/utils.js";
import { generateAddressesTemplate } from "./template.js";

let map, marker;

let latitude = 0
let longitude = 0

let allCities = [];
let selectedProvinceCities = [];

function initMap() {
  if (map) return;

  map = L.map("map").setView([35.6892, 51.389], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  marker = L.marker([35.6892, 51.389], { draggable: true }).addTo(map);

  marker.on("dragend", function (e) {
    const pos = marker.getLatLng();
    latitude = pos.lat
    longitude = pos.lng
    console.log("مختصات انتخاب شده:", pos.lat, pos.lng);
  });

  map.on("click", function (e) {
    marker.setLatLng(e.latlng);
    latitude = e.latlng.lat
    longitude = e.latlng.lng
    console.log("مختصات انتخاب شده:", e.latlng.lat, e.latlng.lng);
  });
}

export function showAddressCreateModal() {
  document.querySelector(".address-create-modal").classList.add("show");
  document.body.classList.add("modal-open");
  setTimeout(() => {
    initMap();
  }, 300);
}

export function showAddressEditModal() {
  document.querySelector(".address-edit-modal").classList.add("show");
  document.body.classList.add("modal-open");
}
const allModals = document.querySelectorAll(".modal");
const allModalsInputs = [...allModals].map((modal) => [
  ...modal.querySelectorAll("select, input"),
]);
export function closeAddressModals() {
  allModals.forEach((modal) => modal.classList.remove("show"));
  allModalsInputs.forEach((inputs) =>
    inputs.forEach((input) => (input.value = ""))
  );
}

const addressesWrapper = document.querySelector("#addresses-table-body");
export const renderAddress = async () => {
  const addresses = (await getReq("/location/addresses/")).results.results;
  const template = generateAddressesTemplate(addresses);

  insertTemplateToElement(template, addressesWrapper);
};

const citiesSelectBoxes = selectAll(".city-select");
export const renderCitiesSelectBox = async () => {
  const template = generateSelectOptionsTemplate(
    selectedProvinceCities,
    "id",
    "name",
    {
      defaultItem: {
        includes: true,
        label: "شهر را انتخاب کنید ...",
      },
    }
  );
  citiesSelectBoxes.forEach((select) => {
    insertTemplateToElement(template, select);
  });
};
const provincesSelectBoxes = selectAll(".province-select");
export const renderProvincesSelectBox = async () => {
  const cities = await fetchCities();
  allCities = cities;
  selectedProvinceCities = cities;
  const provinces = await fetchProvinces();
  const template = generateSelectOptionsTemplate(provinces, "id", "name");
  provincesSelectBoxes.forEach((select) => {
    insertTemplateToElement(template, select, true);
    select.onchange = (event) => {
      const provinceId = event.target.value;
      const provinceCities = cities.filter(
        (city) => city.province == provinceId
      );
      selectedProvinceCities = provinceCities;
      console.log(cities, selectedProvinceCities);
      renderCitiesSelectBox();
    };
  });
  renderCitiesSelectBox();
};

export const createAddress = async (event) => {
  event.preventDefault();
  let objData = extractObjFromFormEvent(event);
  objData = {
    ...objData,
    is_default : objData.is_default ? true : false,
    latitude: Number(`${latitude}`.slice(0, 10)),
    longitude: Number(`${longitude}`.slice(0, 10))
  }

  try {
    const response = await createReq({
      data: objData,
      path: "/location/addresses/",
      name: "آدرس"
    });
    await renderAddress();
    swal(response, "", "success");
    closeAddressModals();
  } catch (error) {
    swal( error.message, "",  "error");
  }
};


export function deleteAddress(event) {
  const trInfo = getTrInfo(event);
  swal(`آیا آدرس "${trInfo.title}" حذف شود؟`, "", "question").then(
    async (result) => {
      if (result) {
        try {
          const response = await deleteReq({
            path: `/location/addresses/${trInfo.id}/`,
            name: "آدرس"
          });
          await renderAddress();
          console.log(response);
          swal(response, "", "success");
        } catch (error) {
          swal( error.message, "", "error");
        }
      }
    }
  );
}

export function deleteSelectedAddresses() {
  const selected = selectAll(".row-checkbox:checked");
  if (!selected.length) return swal("هیچ آیتمی انتخاب نشده است", "", "warning");
  swal(
    `آیا ${selected.length} آدرس انتخاب شده حذف شوند؟`,
    "",
    "question"
  ).then(async (result) => {
    if (result) {
      try {
        const infos = [...selected].map(
          (cb) => JSON.parse(cb.closest("tr").dataset.info).id
        );
        const promices = infos.map((id) => deleteReq({
            path: `/location/addresses/${id}/`,
            name: "آدرس"
          }));
        await Promise.all(promices);
        await renderAddress();
        swal("آدرسها با موفقیت حذف شدند", "", "success");
      } catch (error) {
        swal("خطا در حذف آدرس", error.message, "error");
      }
    }
  });
}