  function showCityCreateModal() {
    const modal = document.querySelector('.city-create-modal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden'; 
    }
  }

  function showCityEditModal() {
    const modal = document.querySelector('.city-edit-modal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCityModals() {
    const modals = document.querySelectorAll('.city-create-modal, .city-edit-modal');
    modals.forEach(modal => modal.classList.remove('show'));
    document.body.style.overflow = ''; 
  }

