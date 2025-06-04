import { protectDashboard } from "../../utils/protect.js";
import {
  closeProvinceModals,
  createProvince,
  deleteProvince,
  deleteSelectedProvinces,
  editProvince,
  renderProvinces,
  showProvinceCreateModal,
  showProvinceEditModal,
} from "./funcs/shared.js";

window.addEventListener("load", async () => {
  await protectDashboard();
  renderProvinces();

  window.showProvinceCreateModal = showProvinceCreateModal;
  window.showProvinceEditModal = showProvinceEditModal;
  window.closeProvinceModals = closeProvinceModals;
  window.deleteProvince = deleteProvince;
  window.deleteSelectedProvinces = deleteSelectedProvinces;
  window.createProvince = createProvince;
  window.editProvince = editProvince
});
