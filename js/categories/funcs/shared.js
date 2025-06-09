import { getTrInfo, insertTemplateToElement, select } from "../../../utils/elem.js";
import { generateCategoriesTemplate } from "./template.js";
import { editReq, fetchCategories } from "./utils.js";

export function previewInsuranceIcon(input, previewSelector) {
  const preview = document.querySelector(previewSelector);
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    preview.src = '';
    preview.style.display = 'none';
  }
}


export function showInsuranceFieldCreateModal() {
  document.querySelector('.insurance-create-modal').classList.add('show');
}


export function closeInsuranceModals() {
  document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('show'));
}


export function createInsuranceField(event) {
  event.preventDefault();

  const nameInput = document.getElementById('insurance-name');
  const iconInput = document.getElementById('insurance-icon-create');

  const name = nameInput.value.trim();
  const iconFile = iconInput.files[0];

  if (!name || !iconFile) {
    alert('نام رشته و آیکون الزامی هستند.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const iconSrc = e.target.result;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td><input type="checkbox" class="row-checkbox" /></td>
      <td>${Date.now()}</td>
      <td>${name}</td>
      <td><img src="${iconSrc}" alt="آیکون" style="max-width:40px;" /></td>
      <td>
        <button class="btn btn-sm edit-btn" onclick="showEditInsuranceField(this)">ویرایش</button>
        <button class="btn btn-sm delete-btn" onclick="deleteInsuranceField(this)">حذف</button>
      </td>

    `;

    document.getElementById('insurance-fields-table-body').appendChild(newRow);
    closeInsuranceModals();
    event.target.reset();
    document.getElementById('preview-icon-create').style.display = 'none';
  };

  reader.readAsDataURL(iconFile);
}


const editModalEl = select(".insurance-edit-modal")
const editModalInput = select("#edit-insurance-name")

export function showEditInsuranceField(event) {
  const trInfo = getTrInfo(event);
  editModalEl.dataset.id = trInfo.id

  editModalInput.value = trInfo.name;
  editModalEl.classList.add("show");
}

export async function editInsuranceField(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formObj = Object.fromEntries(formData.entries());
  if (!formObj.name) {
    swal(
      'نام رشته الزامی است.',
      "",
      "error"
    );
    return;
  }

  try {
    const response = await editReq(editModalEl.dataset.id, formObj);
    await renderCategories()
    swal(
      'رشته مورد نظر با موفقیت ویرایش شد.',
      response,
      "success"
    )
  } catch (error) {
    swal(
      'رشته مورد نظر ویرایش نشد.',
      error.message,
      "error"
    )
  }

  

  closeInsuranceModals();
}


export function deleteInsuranceField(button) {
  if (confirm('آیا از حذف این رشته مطمئن هستید؟')) {
    const row = button.closest('tr');
    row.remove();
  }
}


document.getElementById('insurance-check-all').addEventListener('change', function () {
  const checked = this.checked;
  document.querySelectorAll('#insurance-fields-table-body .row-checkbox').forEach(cb => cb.checked = checked);
});


export function deleteSelectedInsuranceFields() {
  const selected = document.querySelectorAll('#insurance-fields-table-body .row-checkbox:checked');
  if (selected.length === 0) {
    alert('هیچ ردیفی انتخاب نشده است.');
    return;
  }
  if (confirm('آیا از حذف موارد انتخاب‌شده مطمئن هستید؟')) {
    selected.forEach(cb => cb.closest('tr').remove());
  }
}



const categoriesWrapper = select("#insurance-fields-table-body")
export const renderCategories = async () => {
  const categories = await fetchCategories();
  const template = generateCategoriesTemplate(categories);
  insertTemplateToElement(
    template,
    categoriesWrapper
  )
}
