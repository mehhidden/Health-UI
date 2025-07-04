import { extractObjFromFormEvent } from "../../../utils/data.js";
import {
  generateSelectOptionsTemplate,
  getTrInfo,
  insertTemplateToElement,
  select,
  selectAll,
} from "../../../utils/elem.js";
import {
  createReq,
  deleteReq,
  editReq,
  getReq,
} from "../../../utils/request.js";
import { fetchCities } from "../../cities/funcs/utils.js";
import { fetchProvinces } from "../../peovinces/funcs/utils.js";
import {
  generateAddressesTemplate,
  generateEditAddressModalTemplate,
} from "./template.js";

let map, marker;

let latitude = 0;
let longitude = 0;

let allProvinces = [];
let allCities = [];
let selectedProvinceCities = [];

function initMap(mapId, lat, long) {
  console.log(lat, long);
  if (map && !mapId) return;
  if (mapId) {
    map = undefined;
  }

  map = L.map(`${mapId || "map"}`).setView(
    [long || 35.6892, lat || 51.389],
    13
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  marker = L.marker([long || 35.6892, lat || 51.389], {
    draggable: true,
  }).addTo(map);

  marker.on("dragend", function (e) {
    const pos = marker.getLatLng();
    latitude = pos.lat;
    longitude = pos.lng;
    console.log("مختصات انتخاب شده:", pos.lat, pos.lng);
  });

  map.on("click", function (e) {
    marker.setLatLng(e.latlng);
    latitude = e.latlng.lat;
    longitude = e.latlng.lng;
    console.log("مختصات انتخاب شده:", e.latlng.lat, e.latlng.lng);
  });
}

export function showAddressCreateModal() {
  document.querySelector(".address-create-modal").classList.add("show");
  document.body.classList.add("modal-open");
  setTimeout(() => {
    initMap();
  }, 300);
  renderProvincesSelectBox();
}

export const editAddressModalForm = select("#edit-address-form");
export const insertEditAddressModalContent = (address) => {
  const template = generateEditAddressModalTemplate(
    address,
    allProvinces,
    allCities,
    {
      latitude,
      longitude,
    }
  );

  insertTemplateToElement(template, editAddressModalForm);
};

const addressEditModal = document.querySelector(".address-edit-modal");

export function showAddressEditModal(event) {
  addressEditModal.classList.add("show");
  document.body.classList.add("modal-open");

  const trInfo = getTrInfo(event);
  addressEditModal.dataset.id = trInfo.id;
  latitude = trInfo["latitude"];
  longitude = trInfo["longitude"];

  insertEditAddressModalContent(trInfo);
  renderProvincesSelectBox(trInfo.province, trInfo.city);
  initMap(trInfo.id, trInfo.longitude, trInfo.latitude);
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

export const renderCitiesSelectBox = async (defaultC) => {
  const citiesSelectBoxes = selectAll(".city-select");

  const template = generateSelectOptionsTemplate(
    selectedProvinceCities,
    "id",
    "name",
    {
      selectedValues: [defaultC],
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
export const renderProvincesSelectBox = async (defaultP, defaultC) => {
  const provincesSelectBoxes = selectAll(".province-select");

  allCities = allCities?.length ? allCities : await fetchCities();
  selectedProvinceCities = allCities;
  allProvinces = allProvinces?.length ? allProvinces : await fetchProvinces();
  const template = generateSelectOptionsTemplate(allProvinces, "id", "name", {
    selectedValues: [defaultP],
    defaultItem: {
      includes: true,
      label: "استان را انتخاب کنید ...",
    },
  });
  provincesSelectBoxes.forEach((select) => {
    insertTemplateToElement(template, select);
    select.onchange = (event) => {
      const provinceId = event.target.value;
      const provinceCities = allCities.filter(
        (city) => city.province == provinceId
      );
      selectedProvinceCities = provinceCities;
      console.log(allCities, selectedProvinceCities);
      renderCitiesSelectBox(defaultC);
    };
  });
  renderCitiesSelectBox(defaultC);
};

export const createAddress = async (event) => {
  event.preventDefault();
  let objData = extractObjFromFormEvent(event);
  objData = {
    ...objData,
    is_default: objData.is_default ? true : false,
    latitude: Number(`${latitude}`.slice(0, 10)),
    longitude: Number(`${longitude}`.slice(0, 10)),
  };

  try {
    const response = await createReq({
      data: objData,
      path: "/location/addresses/",
      name: "آدرس",
    });
    await renderAddress();
    swal(response, "", "success");
    closeAddressModals();
  } catch (error) {
    swal(error.message, "", "error");
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
            name: "آدرس",
          });
          await renderAddress();
          console.log(response);
          swal(response, "", "success");
        } catch (error) {
          swal(error.message, "", "error");
        }
      }
    }
  );
}

export function deleteSelectedAddresses() {
  const selected = selectAll(".row-checkbox:checked");
  if (!selected.length) return swal("هیچ آیتمی انتخاب نشده است", "", "warning");
  swal(`آیا ${selected.length} آدرس انتخاب شده حذف شوند؟`, "", "question").then(
    async (result) => {
      if (result) {
        try {
          const infos = [...selected].map(
            (cb) => JSON.parse(cb.closest("tr").dataset.info).id
          );
          const promices = infos.map((id) =>
            deleteReq({
              path: `/location/addresses/${id}/`,
              name: "آدرس",
            })
          );
          await Promise.all(promices);
          await renderAddress();
          swal("آدرسها با موفقیت حذف شدند", "", "success");
        } catch (error) {
          swal("خطا در حذف آدرس", error.message, "error");
        }
      }
    }
  );
}

export const editAddress = async (event) => {
  event.preventDefault();
  const objData = extractObjFromFormEvent(event);
  const data = {
    ...objData,
    is_default: objData.is_default ? true : false,
    latitude: Number(`${latitude}`.slice(0, 10)),
    longitude: Number(`${longitude}`.slice(0, 10)),
  };

  console.log("edit payload ->", data);

  const id = addressEditModal.dataset.id;

  try {
    const response = await editReq({
      data,
      path: `/location/addresses/${id}/`,
      name: "آدرس",
      method: "PATCH",
    });
    await renderAddress();
    swal(response, "", "success");
    closeAddressModals();
  } catch (error) {
    swal("خطا در ویرایش آدرس", error.message, "error");
  }
};
