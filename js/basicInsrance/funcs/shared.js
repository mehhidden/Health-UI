function showInsurerCreateModal() {
  document.querySelector('.insurer-create-modal').classList.add('show');
}

function closeInsurerModals() {
  document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('show'));
}


function deleteSelectedInsurers() {
  const checkboxes = document.querySelectorAll('.insurer-checkbox:checked');
  if (checkboxes.length === 0) {
    alert('لطفاً حداقل یک بیمه‌گر را انتخاب کنید.');
    return;
  }

  if (!confirm('آیا از حذف موارد انتخاب‌شده اطمینان دارید؟')) return;

  checkboxes.forEach(checkbox => {
    const row = checkbox.closest('tr');
    row.remove(); 
  });
}


document.getElementById('insurer-check-all').addEventListener('change', function () {
  const checkboxes = document.querySelectorAll('.insurer-checkbox');
  checkboxes.forEach(cb => cb.checked = this.checked);
});


document.querySelector('.insurer-create-modal form').addEventListener('submit', function (e) {
  e.preventDefault();
  const nameInput = document.getElementById('insurer-name');
  const name = nameInput.value.trim();

  if (!name) {
    alert('لطفاً نام بیمه‌گر را وارد کنید.');
    return;
  }

  const table = document.getElementById('render-api');
  const rowCount = table.rows.length + 1;

  const newRow = document.createElement('tr');
newRow.innerHTML = 
 ` <td><input type="checkbox" class="insurer-checkbox" /></td>
  <td>${rowCount}</td>
  <td>${name}</td>
  <td>
    <button class="btn btn-sm btn-info" onclick="editInsurer(this)">ویرایش</button>
    <button class="btn btn-sm btn-danger" onclick="deleteInsurer(this)">حذف</button>
  </td>
`
  table.appendChild(newRow);
  nameInput.value = '';
  closeInsurerModals();
});


function editInsurer(button) {
  const row = button.closest('tr');
  const currentName = row.children[2].innerText;

  const editModal = document.querySelector('.insurer-edit-modal');
  const input = editModal.querySelector('.input-set-save');
  input.value = currentName;

  editModal.dataset.targetRowIndex = [...row.parentNode.children].indexOf(row);
  editModal.classList.add('show');
}


document.querySelector('.insurer-edit-modal form').addEventListener('submit', function (e) {
  e.preventDefault();
  const editModal = document.querySelector('.insurer-edit-modal');
  const index = editModal.dataset.targetRowIndex;
  const table = document.getElementById('render-api');
  const row = table.children[index];
  const newName = editModal.querySelector('.input-set-save').value.trim();

  if (!newName) {
    alert('نام جدید بیمه‌گر نمی‌تواند خالی باشد.');
    return;
  }

  row.children[2].innerText = newName;
  closeInsurerModals();
});