import { convertFormDataToObj } from "../../../utils/data.js";
import { getTrInfo, select, selectAll } from "../../../utils/elem.js";
import {
  createReq,
  deleteReq,
  editReq,
  fetchProvinces,
  insertProvinces,
} from "./utils.js";

const createModalEl = select(".province-create-modal");
export function showProvinceCreateModal() {
  createModalEl.classList.add("show");
}

const editModalEl = select(".province-edit-modal");
const editModalInput = select(".province-edit-modal input");
export function showProvinceEditModal(event) {
  const trInfo = getTrInfo(event);
  editModalEl.classList.add("show");
  editModalEl.dataset.id = trInfo.id;
  editModalInput.value = trInfo.name;
}

const allModalEls = selectAll(".modal");
export function closeProvinceModals() {
  allModalEls.forEach((modal) => modal.classList.remove("show"));
}

export function deleteProvince(event) {
  const trInfo = getTrInfo(event);
  swal(`آیا استان ${trInfo.name} حذف شود؟`, "", "question").then(
    async (result) => {
      if (result) {
        try {
          const response = await deleteReq(trInfo.id);
          await renderProcinces();
          console.log(response);
          swal(response, "", "success");
        } catch (error) {
          swal("خطا در حذف استان", error.message, "error");
        }
      }
    }
  );
}

export function deleteSelectedprovinces() {
  const selected = selectAll(".row-checkbox:checked");
  if (!selected.length) return swal("هیچ آیتمی انتخاب نشده است", "", "warning");
  swal(
    `آیا ${selected.length} استان انتخاب شده حذف شوند؟`,
    "",
    "question"
  ).then(async (result) => {
    if (result) {
      try {
        const infos = [...selected].map(
          (cb) => JSON.parse(cb.closest("tr").dataset.info).id
        );
        const promices = infos.map((id) => deleteReq(id));
        await Promise.all(promices);
        await renderProcinces();
        swal("استانها با موفقیت حذف شدند", "", "success");
      } catch (error) {
        swal("خطا در حذف استان", error.message, "error");
      }
    }
  });
}

export const createProvince = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = convertFormDataToObj(formData);
  try {
    const response = await createReq(data);
    await renderProcinces();
    swal(response, "", "success");
    closeProvinceModals();
  } catch (error) {
    swal("خطا در ایجاد استان", error.message, "error");
  }
};

export const editProvince = async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = convertFormDataToObj(formData);
  const id = editModalEl.dataset.id;
  try {
    const response = await editReq(id, data);
    await renderProcinces();
    swal(response, "", "success");
    closeProvinceModals();
  } catch (error) {
    swal("خطا در ویرایش استان", error.message, "error");
  }
};

export const renderProcinces = async () => {
  const procinces = await fetchProvinces();
  insertProvinces(procinces);
};
