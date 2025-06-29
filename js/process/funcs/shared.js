 let processList = [];

  function renderProcessTable() {
    const body = document.getElementById("process-table-body");
    body.innerHTML = "";
    processList.forEach((p, index) => {
      body.innerHTML += `
        <tr>
          <td><input type="checkbox" data-index="${index}" /></td>
          <td>${index + 1}</td>
          <td>${p.name}</td>
          <td>${p.step}</td>
          <td>${p.plan}</td>
          <td>
            <button class="btn btn-sm btn-info" onclick="showProcessEditModal(${index})">ویرایش</button>
            <button class="btn btn-sm btn-danger" onclick="deleteProcess(${index})">حذف</button>
          </td>
        </tr>
      `;
    });
  }

  function showProcessCreateModal() {
    document.querySelector(".process-create-modal").classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function showProcessEditModal(index) {
    const item = processList[index];
    document.getElementById("edit-process-name").value = item.name;
    document.getElementById("edit-process-step").value = item.step;
    document.getElementById("edit-process-plan").value = item.plan;
    document.querySelector(".process-edit-modal").setAttribute("data-edit-index", index);
    document.querySelector(".process-edit-modal").classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeProcessModals() {
    document.querySelectorAll(".modal").forEach(m => m.classList.remove("show"));
    document.body.style.overflow = "";
  }

  function createProcess(event) {
    event.preventDefault();
    const process = {
      name: document.getElementById("process-name").value,
      step: document.getElementById("process-step").value,
      plan: document.getElementById("process-plan").value
    };
    processList.push(process);
    closeProcessModals();
    renderProcessTable();
  }

  function editProcess(event) {
    event.preventDefault();
    const index = document.querySelector(".process-edit-modal").getAttribute("data-edit-index");
    const process = {
      name: document.getElementById("edit-process-name").value,
      step: document.getElementById("edit-process-step").value,
      plan: document.getElementById("edit-process-plan").value
    };
    processList[index] = process;
    closeProcessModals();
    renderProcessTable();
  }

  function deleteProcess(index) {
    if (confirm("آیا از حذف این پردازش مطمئن هستید؟")) {
      processList.splice(index, 1);
      renderProcessTable();
    }
  }

  function deleteSelectedProcesses() {
    const checks = document.querySelectorAll('#process-table-body input[type="checkbox"]:checked');
    const indexes = Array.from(checks).map(chk => parseInt(chk.getAttribute('data-index')));
    processList = processList.filter((_, i) => !indexes.includes(i));
    renderProcessTable();
  }

  document.getElementById("process-check-all").addEventListener("change", function () {
    const checks = document.querySelectorAll('#process-table-body input[type="checkbox"]');
    checks.forEach(chk => chk.checked = this.checked);
  });

  renderProcessTable();

