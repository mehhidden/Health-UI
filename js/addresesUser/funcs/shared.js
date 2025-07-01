let map, marker;

function initMap() {
  if (map) return;

  map = L.map('map').setView([35.6892, 51.3890], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  marker = L.marker([35.6892, 51.3890], { draggable: true }).addTo(map);

  marker.on('dragend', function (e) {
    const pos = marker.getLatLng();
    console.log('مختصات انتخاب شده:', pos.lat, pos.lng);
  });

  map.on('click', function (e) {
    marker.setLatLng(e.latlng);
    console.log('مختصات انتخاب شده:', e.latlng.lat, e.latlng.lng);
  });
}

function showAddressCreateModal() {
  document.querySelector(".address-create-modal").classList.add("show");
  document.body.classList.add("modal-open");
  setTimeout(() => {
    initMap();
  }, 300);
}

function showAddressEditModal() {
  document.querySelector(".address-edit-modal").classList.add("show");
  document.body.classList.add("modal-open");
}
function closeAddressModals() {
  document.querySelectorAll(".modal").forEach(modal => modal.classList.remove("show"));
  document.body.classList.remove("modal-open");
}


document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('.btn-success[onclick="showAddressCreateModal()"]');
  if (addBtn) {
    addBtn.addEventListener('click', showAddressCreateModal);
  }

  document.querySelectorAll('.edit-address-btn').forEach(btn => {
    btn.addEventListener('click', showAddressEditModal);
  });

  document.querySelectorAll('.modal-close').forEach(span => {
    span.addEventListener('click', closeAddressModals);
  });

  
});
