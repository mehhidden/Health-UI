import { insertTemplateToElement, select } from "../../../utils/elem.js";
import { fetchCategories, generateCategoriesTemplate } from "./utils.js";

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


export function showEditInsuranceField(button) {
  const row = button.closest('tr');
  const name = row.children[2].textContent;

  document.getElementById('edit-insurance-name').value = name;

  
  document.querySelector('.insurance-edit-modal').dataset.row = row.rowIndex;
  document.querySelector('.insurance-edit-modal').classList.add('show');
}

export function editInsuranceField(event) {
  event.preventDefault();

  const name = document.getElementById('edit-insurance-name').value.trim();
  if (!name) {
    alert('نام رشته الزامی است.');
    return;
  }

  const modal = document.querySelector('.insurance-edit-modal');
  const rowIndex = modal.dataset.row;

  const table = document.getElementById('insurance-field-table');
  const row = table.rows[rowIndex];

  row.children[2].textContent = name;

  closeInsuranceModals();
  delete modal.dataset.row;
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
