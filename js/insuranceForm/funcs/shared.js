import {
  getTrInfo,
  insertTemplateToElement,
  select,
} from "../../../utils/elem.js";
import {
  fetchInsureds,
  createReq,
  editReq,
  deleteReq,
  fetchBasics,
} from "./utils.js";
import { generateInsuredsTemplate } from "./template.js";

const insuredWrapper = select("#insured-body");

const formInputs = {
  firstname: select("#insured-firstname"),
  lastname: select("#insured-lastname"),
  code: select("#insured-code"),
  phone: select("#insured-phone"),
  basic: select("#insured-basic"),
  married: select("#insured-married"),
  primary: select("#insured-primary"),
  birth: select("#insured-birth"),
  editIndex: select("#insured-edit-index"),
};

const editFormInputs = {
  firstname: select("#edit-insured-firstname"),
  lastname: select("#edit-insured-lastname"),
  code: select("#edit-insured-code"),
  phone: select("#edit-insured-phone"),
  basic: select("#edit-insured-basic"),
  married: select("#edit-insured-married"),
  primary: select("#edit-insured-primary"),
  birth: select("#edit-insured-birth"),
  editIndex: select("#edit-insured-index"),
};

const createModal = select(".insured-create-modal");
const editModal = select(".insured-edit-modal");

let insureds = [];
let basicsMap = {};

const fillSelect = (selectEl, options) => {
  selectEl.innerHTML = "";
  options.forEach(({ value, text, disabled, selected }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    if (disabled) option.disabled = true;
    if (selected) option.selected = true;
    selectEl.appendChild(option);
  });
};

export const renderInsureds = async () => {
  try {
    insureds = await fetchInsureds();
    const template = generateInsuredsTemplate(insureds.slice().reverse(), basicsMap);
    insertTemplateToElement(template, insuredWrapper);
  } catch {
    swal("خطا", "دریافت بیمه‌گذاران با مشکل مواجه شد", "error");
  }
};

export const renderBasicOptions = async () => {
  try {
    const basics = await fetchBasics();
    basicsMap = {};
    basics.forEach(({ id, name }) => (basicsMap[id] = name));

    const selectEls = [formInputs.basic, editFormInputs.basic];
    selectEls.forEach((el) => {
      fillSelect(el, [
        { value: "", text: "انتخاب کنید", disabled: true, selected: true },
        ...basics.map(({ id, name }) => ({ value: id, text: name })),
      ]);
    });

    const marriedOptions = [
      { value: "", text: "انتخاب کنید", disabled: true, selected: true },
      { value: "true", text: "متأهل" },
      { value: "false", text: "مجرد" },
    ];
    const primaryOptions = [
      { value: "", text: "انتخاب کنید", disabled: true, selected: true },
      { value: "true", text: "بله" },
      { value: "false", text: "خیر" },
    ];

    [formInputs.married, editFormInputs.married].forEach(el => fillSelect(el, marriedOptions));
    [formInputs.primary, editFormInputs.primary].forEach(el => fillSelect(el, primaryOptions));
  } catch {
    swal("خطا", "بارگذاری بیمه‌گرهای پایه با مشکل مواجه شد", "error");
  }
};

export const showInsuredCreateModal = () => {
  createModal.classList.add("show");
  editModal.classList.remove("show");

  Object.values(formInputs).forEach(input => input && (input.value = ""));
};

export const closeInsuredModals = () => {
  createModal.classList.remove("show");
  editModal.classList.remove("show");

  [...Object.values(formInputs), ...Object.values(editFormInputs)].forEach(input => input && (input.value = ""));
};

export const saveInsured = async (event) => {
  event.preventDefault();

  const isEdit = editFormInputs.editIndex.value.trim() !== "";
  const source = isEdit ? editFormInputs : formInputs;

  const required = ["firstname", "lastname", "code", "phone"];
  for (const key of required) {
    if (!source[key].value.trim()) {
      swal("خطا", "لطفا تمام فیلدهای ضروری را پر کنید", "error");
      return;
    }
  }

  const basicVal = Number(source.basic.value);
  if (!basicVal || isNaN(basicVal)) {
    swal("خطا", "لطفا بیمه‌گر پایه را انتخاب کنید", "error");
    return;
  }

  if (!["true", "false"].includes(source.married.value)) {
    swal("خطا", "وضعیت تأهل را انتخاب کنید", "error");
    return;
  }

  if (!["true", "false"].includes(source.primary.value)) {
    swal("خطا", "وضعیت بیمه‌شده اصلی را انتخاب کنید", "error");
    return;
  }

  if (!source.birth.value.trim()) {
    swal("خطا", "تاریخ تولد نمی‌تواند خالی باشد", "error");
    return;
  }

  const dataObj = {
    first_name: source.firstname.value.trim(),
    last_name: source.lastname.value.trim(),
    national_code: source.code.value.trim(),
    phone_number: source.phone.value.trim(),
    basic_insurer: basicVal,
    is_married: source.married.value === "true",
    is_self_insured: source.primary.value === "true",
    birth_date: source.birth.value.trim(),
  };

  try {
    const message = isEdit
      ? await editReq(editFormInputs.editIndex.value, dataObj)
      : await createReq(dataObj);
    closeInsuredModals();
    await renderInsureds();
    swal("موفق", message, "success");
  } catch (err) {
    swal("خطا", err.message || "خطایی رخ داده است", "error");
  }
};

export const showEditInsured = async (event) => {
  event.preventDefault();
  createModal.classList.remove("show");

  const trInfo = getTrInfo(event);
  const insured = insureds.find(i => i.id === Number(trInfo.id));
  if (!insured) return swal("خطا", "بیمه‌گذار یافت نشد", "error");

  try {
    fillSelect(editFormInputs.basic, [
      { value: "", text: "انتخاب کنید", disabled: true },
      ...Object.entries(basicsMap).map(([id, name]) => ({
        value: id,
        text: name,
        selected: Number(id) === insured.basic_insurer,
      })),
    ]);

    editFormInputs.editIndex.value = insured.id;
    editFormInputs.firstname.value = insured.first_name || "";
    editFormInputs.lastname.value = insured.last_name || "";
    editFormInputs.code.value = insured.national_code || "";
    editFormInputs.phone.value = insured.phone_number || "";
    editFormInputs.birth.value = insured.birth_date || "";
    editFormInputs.married.value = insured.is_married ? "true" : "false";
    editFormInputs.primary.value = insured.is_self_insured ? "true" : "false";

    editModal.classList.add("show");
  } catch {
    swal("خطا", "بارگذاری اطلاعات برای ویرایش با مشکل مواجه شد", "error");
  }
};

export const deleteInsured = (event) => {
  const trInfo = getTrInfo(event);
  swal(
    `آیا می‌خواهید بیمه‌گذار "${trInfo.first_name} ${trInfo.last_name}" را حذف کنید؟`,
    "",
    "question"
  ).then(async (res) => {
    if (res) {
      try {
        const msg = await deleteReq(trInfo.id);
        await renderInsureds();
        swal("حذف شد", msg, "success");
      } catch (err) {
        swal("خطا", err.message, "error");
      }
    }
  });
};

export const deleteSelectedInsureds = () => {
  const selected = document.querySelectorAll("#insured-body .row-checkbox:checked");
  if (selected.length === 0) return swal("هیچ ردیفی انتخاب نشده است.", "", "error");

  swal(`آیا ${selected.length} بیمه‌گذار انتخاب‌شده حذف شوند؟`, "", "question").then(
    async (result) => {
      if (result) {
        try {
          const ids = [...selected].map(cb =>
            Number(JSON.parse(cb.closest("tr").dataset.info).id)
          );
          await Promise.all(ids.map(deleteReq));
          await renderInsureds();
          swal("حذف شد", "بیمه‌گذاران انتخاب شده حذف شدند", "success");
        } catch (err) {
          swal("خطا", err.message, "error");
        }
      }
    }
  );
};
