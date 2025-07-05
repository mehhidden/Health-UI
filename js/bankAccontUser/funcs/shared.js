import { extractObjFromFormEvent } from "../../../utils/data.js";
import {
  generateSelectOptionsTemplate,
  insertTemplateToElement,
  selectAll,
} from "../../../utils/elem.js";
import { createReq } from "../../../utils/request.js";
import { fetchAccountTypes } from "../../bank/account type/account type.js";
import { fetchBanks } from "../../bank/bankinfo/bankserver.js";

let allBanks = [];
let allAccounts = [];

export function showBankCreateModal() {
  const modal = document.querySelector(".bank-create-modal");
  if (modal) modal.classList.add("show");
}

export function showBankEditModal() {
  const modal = document.querySelector(".bank-edit-modal");
  if (modal) modal.classList.add("show");
}


const allModals = document.querySelectorAll(".modal");
const allModalsInputs = [...allModals].map((modal) => [
  ...modal.querySelectorAll("select, input"),
]);
export function closeBankModals() {
  console.log("closing modals")
  allModals.forEach((modal) => modal.classList.remove("show"));
  allModalsInputs.forEach((inputs) =>
    inputs.forEach((input) => (input.value = ""))
  );
}

export const createBank = async (event) => {
  event.preventDefault();
  const objData = extractObjFromFormEvent(event);
  const data = {
    ...objData,
    is_default: !!objData.is_default,
  };
  console.log(data)
  try {
    const response = await createReq({
      data,
      path: "/bank_info/bank-accounts/",
      name: "حساب بانکی",
    });
    console.log(response)
    // await ();
    swal(response, "", "success");
    closeBankModals();
  } catch (error) {
    console.log(error.message)
    swal(error.message, "", "error");
  }
};

const bankSelects = selectAll(".bank-select");
export const renderBankSelectBoxes = async () => {
  const banks = (await fetchBanks()).results.results;
  allBanks = banks;
  const template = generateSelectOptionsTemplate(banks, "id", "name", {
    defaultItem: {
      includes: true,
      label: "انتخاب بانک ...",
    },
  });
  bankSelects.forEach((select) => {
    insertTemplateToElement(template, select);
  });
};

const accountSelects = selectAll(".account-select");

export const renderAccountSelectBoxes = async () => {
  const accounts = (await fetchAccountTypes()).results.results;
  allAccounts = accounts;
  const template = generateSelectOptionsTemplate(accounts, "id", "title", {
    defaultItem: {
      includes: true,
      label: "انتخاب حساب ...",
    },
  });
  accountSelects.forEach((select) => {
    insertTemplateToElement(template, select);
  });
};
