
import {protectDashboard} from "../../utils/protect.js"
import {
  addSelect,
  editUser,
  getAllGroups,
  getAllPermissions,
  hideCreateModal,
  hideEditModal,
  hideInfoModal,
  removeSelect,
  renderSearch,
  showCreateModal,
  showDeleteSwal,
  showEditModal,
  showInfoModal,
  showUsers,
  submitUser,
} from "./funcs/shared.js";

window.addEventListener("load", async () => {
  await protectDashboard()

  getAllGroups()
  getAllPermissions()
  showUsers();

  window.addSelect = addSelect;
  window.removeSelect = removeSelect;

  window.showInfoModal = showInfoModal;
  window.hideInfoModal = hideInfoModal;

  window.showDeleteSwal = showDeleteSwal;

  window.showEditModal = showEditModal;
  window.hideEditModal = hideEditModal;
  window.editUser = editUser;

  window.showCreateModal = showCreateModal;
  window.hideCreateModal = hideCreateModal;
  window.submitUser = submitUser;

  renderSearch();
});
