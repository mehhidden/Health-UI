import { extractObjFromFormEvent } from "../../../utils/data.js";
import {
  generateSelectOptionsTemplate,
  insertTemplateToElement,
  selectAll,
} from "../../../utils/elem.js";
import { getReq } from "../../../utils/request.js";
import { fetchCities } from "../../cities/funcs/utils.js";
import { fetchProvinces } from "../../peovinces/funcs/utils.js";
import { generateAddressesTemplate } from "./template.js";

let map, marker;

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
    console.log("مختصات انتخاب شده:", pos.lat, pos.lng);
  });

  map.on("click", function (e) {
    marker.setLatLng(e.latlng);
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

export const createAddress = (event) => {
  event.preventDefault();
  const objData = extractObjFromFormEvent(event);

  console.log(objData);
};

const citiesSelectBoxes = selectAll(".city-select");
export const renderCitiesSelectBox = async () => {
  const template = generateSelectOptionsTemplate(selectedProvinceCities, "id", "name", {
    defaultItem: {
      includes: true,
      label: "شهر را انتخاب کنید ..."
    }
  });
  console.log("selected p - s ->", selectedProvinceCities)
  citiesSelectBoxes.forEach((select) => {
    insertTemplateToElement(template, select);
  });
};
const provincesSelectBoxes = selectAll(".province-select");
export const renderProvincesSelectBox = async () => {
  const cities = await fetchCities();
  allCities = cities;
  selectedProvinceCities = cities
  const provinces = await fetchProvinces();
  const template = generateSelectOptionsTemplate(provinces, "id", "name");
  provincesSelectBoxes.forEach((select) => {
    insertTemplateToElement(template, select, true);
    console.log(select)
    select.onchange = (event) => {
      console.log(event)
      const provinceId = event.target.value;
      const provinceCities = cities.filter((city) => city.province == provinceId);
      selectedProvinceCities = provinceCities;
      console.log(cities, selectedProvinceCities)
      renderCitiesSelectBox();
    }
  });
  renderCitiesSelectBox()
};
