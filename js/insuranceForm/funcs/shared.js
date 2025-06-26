jalaliDatepicker.startWatch();
let insuredList = [];

  function renderInsuredTable() {
    const body = document.getElementById('insured-body');
    body.innerHTML = '';
    insuredList.forEach((item, index) => {
      body.innerHTML += `
        <tr>
          <td><input type="checkbox" data-index="${index}" /></td>
          <td>${index + 1}</td>
          <td>${item.firstName}</td>
          <td>${item.lastName}</td>
          <td>${item.code}</td>
          <td>${item.phone}</td>
          <td>${item.basic}</td>
          <td>${item.married === "true" ? "متأهل" : "مجرد"}</td>
          <td>${item.primary === "true" ? "بله" : "خیر"}</td>
          <td>${item.birth}</td>
          <td>
            <button class="btn btn-sm btn-info" onclick="editInsured(${index})">ویرایش</button>
            <button class="btn btn-sm btn-danger" onclick="deleteInsured(${index})">حذف</button>
          </td>
        </tr>`
      ;
    });
  }

  function showInsuredCreateModal() {
    document.querySelector('.insured-create-modal').classList.add('show');
    document.getElementById('insured-edit-index').value = '';
    document.querySelector('.insured-create-modal form').reset();
  }

  function closeInsuredModals() {
    document.querySelector('.insured-create-modal').classList.remove('show');
  }

  function saveInsured(event) {
    event.preventDefault();
    const insured = {
      firstName: document.getElementById('insured-firstname').value,
      lastName: document.getElementById('insured-lastname').value,
      code: document.getElementById('insured-code').value,
      phone: document.getElementById('insured-phone').value,
      basic: document.getElementById('insured-basic').value,
      married: document.getElementById('insured-married').value,
      primary: document.getElementById('insured-primary').value,
      birth: document.getElementById('insured-birth').value
    };

    const index = document.getElementById('insured-edit-index').value;
    if (index === '') {
      insuredList.push(insured);
    } else {
      insuredList[parseInt(index)] = insured;
    }

    closeInsuredModals();
    renderInsuredTable();
  }

  function editInsured(index) {
    const item = insuredList[index];
    document.getElementById('insured-firstname').value = item.firstName;
    document.getElementById('insured-lastname').value = item.lastName;
    document.getElementById('insured-code').value = item.code;
    document.getElementById('insured-phone').value = item.phone;
    document.getElementById('insured-basic').value = item.basic;
    document.getElementById('insured-married').value = item.married;
    document.getElementById('insured-primary').value = item.primary;
    document.getElementById('insured-birth').value = item.birth;
    document.getElementById('insured-edit-index').value = index;
    showInsuredCreateModal();
  }

  function deleteInsured(index) {
    if (confirm("حذف شود؟")) {
      insuredList.splice(index, 1);
      renderInsuredTable();
    }
  }

  function deleteSelectedInsured() {
    const checks = document.querySelectorAll('#insured-body input[type="checkbox"]:checked');
    const indexes = Array.from(checks).map(chk => parseInt(chk.getAttribute('data-index')));
    insuredList = insuredList.filter((_, i) => !indexes.includes(i));
    renderInsuredTable();
  }

  document.getElementById('insured-check-all').addEventListener('change', function() {
    const checks = document.querySelectorAll('#insured-body input[type="checkbox"]');
    checks.forEach(chk => chk.checked = this.checked);
  });

  renderInsuredTable();

  
