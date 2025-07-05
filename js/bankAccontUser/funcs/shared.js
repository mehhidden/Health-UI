import { extractObjFromFormEvent } from "../../../utils/data.js";
import {
  generateSelectOptionsTemplate,
  getTrInfo,
  insertTemplateToElement,
  select,
  selectAll,
} from "../../../utils/elem.js";
import { createReq, deleteReq, editReq, getReq } from "../../../utils/request.js";
import { fetchAccountTypes } from "../../bank/account type/account type.js";
import { fetchBanks } from "../../bank/bankinfo/bankserver.js";
import { generateBankAccountsTemplate } from "./temaplte.js";

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
  console.log("closing modals");
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
    is_default: objData.is_default !== undefined,
  };
  try {
    const response = await createReq({
      data,
      path: "/bank_info/bank-accounts/",
      name: "حساب بانکی",
    });
    await renderBankAccounts();
    swal(response, "", "success");
    closeBankModals();
  } catch (error) {
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

const bankAccountsWrapper = select("#bank-table-body");
export const renderBankAccounts = async () => {
  const bankAccounts = (await getReq("/bank_info/bank-accounts/")).results
    .results;
  const template = generateBankAccountsTemplate(bankAccounts);
  insertTemplateToElement(template, bankAccountsWrapper);
};

export function deleteBankAccount(event) {
  const trInfo = getTrInfo(event);
  swal(`آیا حساب بانک "${trInfo.id}" حذف شود؟`, "", "question").then(
    async (result) => {
      if (result) {
        try {
          const response = await deleteReq({
            path: `/bank_info/bank-accounts/${trInfo.id}/`,
            name: "حساب بانک",
          });
          await renderBankAccounts();
          swal(response, "", "success");
        } catch (error) {
          swal(error.message, "", "error");
        }
      }
    }
  );
}

export function deleteSelectedBankAccounts() {
  const selected = selectAll(".row-checkbox:checked");
  if (!selected.length) return swal("هیچ آیتمی انتخاب نشده است", "", "warning");
  swal(
    `آیا ${selected.length} حساب بانک انتخاب شده حذف شوند؟`,
    "",
    "question"
  ).then(async (result) => {
    if (result) {
      try {
        const infos = [...selected].map(
          (cb) => JSON.parse(cb.closest("tr").dataset.info).id
        );
        const promices = infos.map((id) =>
          deleteReq({
            path: `/bank_info/bank-accounts/${id}/`,
            name: "حساب بانک",
          })
        );
        await Promise.all(promices);
        await renderBankAccounts();
        swal("حساب بانکها با موفقیت حذف شدند", "", "success");
      } catch (error) {
        swal("خطا در حذف حساب بانک", error.message, "error");
      }
    }
  });
}

const editModal = select(".bank-edit-modal");
const editModalInputs = selectAll(".bank-edit-modal input,select");
export const showBankAccountEditModal = (event) => {
  editModal.classList.add("show");
  const trInfo = getTrInfo(event);
  editModal.dataset.id = trInfo.id;

  editModalInputs.forEach((input) => {
    if (input.type === "checkbox") {
      input.checked = trInfo[input.name];
    } else {
      input.value = trInfo[input.name];
    }
  });
};

export const editBank = async (event) => {
  event.preventDefault();
  const objData = extractObjFromFormEvent(event);
  const data = {
    ...objData,
    is_default: objData.is_default !== undefined,
  };
  const id = editModal.dataset.id;
  try {
    const response = await editReq({
      data,
      path: `/bank_info/bank-accounts/${id}/`,
      name: "حساب بانکی",
      method: "PATCH",
    });
    await renderBankAccounts();
    swal(response, "", "success");
    closeBankModals();
  } catch (error) {
    swal(error.message, "", "error");
  }
};
