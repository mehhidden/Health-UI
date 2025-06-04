import { protectDashboard } from "../../utils/protect.js";
import {
  closeProvinceModals,
  createProvince,
  deleteProvince,
  deleteSelectedprovinces,
  editProvince,
  renderProcinces,
  showProvinceCreateModal,
  showProvinceEditModal,
} from "./funcs/shared.js";

window.addEventListener("load", async () => {
  await protectDashboard();
  renderProcinces();

  window.showProvinceCreateModal = showProvinceCreateModal;
  window.showProvinceEditModal = showProvinceEditModal;
  window.closeProvinceModals = closeProvinceModals;
  window.deleteProvince = deleteProvince;
  window.deleteSelectedprovinces = deleteSelectedprovinces;
  window.createProvince = createProvince;
  window.editProvince = editProvince
});
