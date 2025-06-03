import { protectDashboard } from "../../utils/protect.js";
import { showUsers, submitUser } from "./funcs/users.js";

window.addEventListener("load", async () => {
  await protectDashboard()
  showUsers();
  window.createUser = submitUser;
});
