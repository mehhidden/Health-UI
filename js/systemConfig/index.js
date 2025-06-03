import { protectDashboard } from "../../utils/protect.js";
import { loadPageSystemConfig, previewImage, submitEdit } from "./funcs/shared.js";

window.addEventListener("load", async () => {
  await protectDashboard();

  loadPageSystemConfig()

  window.previewImage = previewImage
  window.submitEdit = submitEdit
});
