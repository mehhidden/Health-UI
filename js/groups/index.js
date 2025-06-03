import { protectDashboard } from "../../utils/protect.js";
import {
  addSelect,
  getAllPermissions,
  hideCreateModal,
  hideEditModal,
  removeSelect,
  showCreateModal,
  showEditModal,
  showGroups,
  submitGroup,
} from "./funcs/shared.js";

window.addEventListener("load", async () => {
  await protectDashboard()

  showGroups();
  getAllPermissions()

  window.addSelect = addSelect;
  window.removeSelect = removeSelect;


  window.showEditModal = showEditModal;
  window.hideEditModal = hideEditModal;
  

  window.showCreateModal = showCreateModal;
  window.hideCreateModal = hideCreateModal;
  window.submitGroup = submitGroup;
});
