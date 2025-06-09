function showPlanCreateModal() {
  document.querySelector(".plan-create-modal").style.display = "block";
}

function showEditPlanModal(planId) {
  document.querySelector(".plan-edit-modal").style.display = "flex";

  document.getElementById("edit-plan-name").value = "طرح ویرایش‌شده";
  document.getElementById("edit-plan-deduction").value = "15٪";
  document.getElementById("edit-product-plan-select").value = "101";
}

function closePlanModals() {
  document.querySelector(".plan-create-modal").style.display = "none";
  document.querySelector(".plan-edit-modal").style.display = "none";
}

function previewInsuranceIcon(input, previewSelector) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.querySelector(previewSelector);
      img.src = e.target.result;
      img.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

window.onclick = function (event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

function showPlanCreateModal() {
  document.querySelector(".plan-create-modal").classList.add("show");
}

function showEditPlanModal(planId) {
  const modal = document.querySelector(".plan-edit-modal");
  modal.classList.add("show");

  document.getElementById("edit-plan-name").value = "طرح ویرایش‌شده";
  document.getElementById("edit-plan-deduction").value = "15٪";
  document.getElementById("edit-product-plan-select").value = "101";
}

function closePlanModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.classList.remove("show");
  });
}

function previewInsuranceIcon(input, previewSelector) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.querySelector(previewSelector);
      img.src = e.target.result;
      img.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

window.onclick = function (event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.classList.remove("show");
    }
  });
};
