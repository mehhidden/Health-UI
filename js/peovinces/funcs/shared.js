import { getTrInfo, select, selectAll } from "../../../utils/elem.js";
import { deleteReq, fetchProvinces, insertProvinces } from "./utils.js";

const createModalEl = select(".province-create-modal")
export function showProvinceCreateModal() {
  createModalEl.classList.add("show");
}


const editModalEl = select(".province-edit-modal")
export function showProvinceEditModal(id) {
  editModalEl.classList.add("show");
}

const allModalEls = selectAll(".modal");
export function closeProvinceModals() {
  allModalEls.forEach((modal) => modal.classList.remove("show"));
}

export function deleteProvince(event) {
  const trInfo = getTrInfo(event)
  swal(
    `آیا شهر ${trInfo.name} حذف شود؟`
  ).then( async result => {
    if (result) {
      try {
        const response =  deleteReq(trInfo.id)
        swal(response, "", "success")
      } catch (error) {
        swal("خطا در حذف شهر", error.message, "error")
      }
    }
  })
}

export function deleteSelectedprovinces() {
  const selected = selectAll(".row-checkbox:checked");
  if (!selected.length) return swal("هیچ آیتمی انتخاب نشده است", "", "warning");
  if (confirm("همه موارد انتخاب‌شده حذف شوند؟")) {
    selected.forEach((cb) => cb.closest("tr").remove());
  }
}

export const renderProcinces = async () => {
  const procinces = await fetchProvinces();
  insertProvinces(procinces);
};
