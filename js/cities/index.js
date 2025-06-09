import { protectDashboard } from "../../utils/protect.js";
import {
  closeCityModals,
  createCity,
  deleteCity,
  deleteSelectedCities,
  editCity,
  renderCities,
  renderProvincesToSelectBoxes,
  showCityCreateModal,
  showCityEditModal,
} from "./funcs/shared.js";

window.addEventListener("load", async () => {
  await protectDashboard();
  renderProvincesToSelectBoxes()
  renderCities();

  window.showCityCreateModal = showCityCreateModal;
  window.showCityEditModal = showCityEditModal;
  window.closeCityModals = closeCityModals;
  window.deleteCity = deleteCity;
  window.deleteSelectedCities = deleteSelectedCities;
  window.createCity = createCity;
  window.editCity = editCity
});
