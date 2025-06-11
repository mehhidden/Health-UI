function showQuestionCreateModal() {
  document.querySelector('.question-create-modal').classList.add('show');
}

function showQuestionEditModal(question) {
  document.querySelector('.question-edit-modal').classList.add('show');

  
  document.getElementById('edit-question-text').value = question.text;
  document.getElementById('edit-question-type').value = question.type;
  document.getElementById('edit-plan-select').value = question.planId;
  document.getElementById('edit-coverage-select').value = question.coverageId;

  
  document.querySelector('.question-edit-modal form').dataset.id = question.id;
}


function closeQuestionModals() {
  document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('show'));
}


function createQuestion(event) {
  event.preventDefault();

  const text = document.getElementById('question-text').value;
  const type = document.getElementById('question-type').value;
  const planId = document.getElementById('plan-select').value;
  const coverageId = document.getElementById('coverage-select').value;

  const newQuestion = {
    id: Date.now(), 
    text,
    type,
    planId,
    coverageId
  };

  addQuestionToTable(newQuestion);
  event.target.reset();
  closeQuestionModals();
}


function editQuestion(event) {
  event.preventDefault();

  const id = event.target.dataset.id;
  const text = document.getElementById('edit-question-text').value;
  const type = document.getElementById('edit-question-type').value;
  const planId = document.getElementById('edit-plan-select').value;
  const coverageId = document.getElementById('edit-coverage-select').value;

  const updatedQuestion = { id, text, type, planId, coverageId };

  updateQuestionInTable(updatedQuestion);
  closeQuestionModals();
}


function addQuestionToTable(question) {
  const tbody = document.getElementById('question-table-body');
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td><input type="checkbox" data-id="${question.id}"></td>
    <td>${question.id}</td>
    <td>${question.planId}</td>
    <td>${question.coverageId}</td>
    <td>${question.text}</td>
    <td>${question.type === 'single' ? 'تک پاسخ' : 'چند گزینه‌ای'}</td>
    <td>
      <button class="edit-btn" onclick='showQuestionEditModal(${JSON.stringify(question)})'>ویرایش</button>
      <button class="delete-btn" onclick='deleteQuestion(${question.id})'>حذف</button>
    </td>
  `;

  tbody.appendChild(tr);
}


function deleteQuestion(id) {
  const row = document.querySelector(`#question-table-body input[data-id="${id}"]`)?.closest('tr');
  if (row) row.remove();
}


function deleteSelectedQuestions() {
  document.querySelectorAll('#question-table-body input[type="checkbox"]:checked').forEach(cb => {
    cb.closest('tr').remove();
  });
}