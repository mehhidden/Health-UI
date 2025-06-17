import { fetchQuestions, insertQuestions } from "./utils.js";

export function showQuestionCreateModal() {
  document.querySelector('.question-create-modal').classList.add('show');
}

export function showQuestionEditModal(question) {
  document.querySelector('.question-edit-modal').classList.add('show');

  
  document.getElementById('edit-question-text').value = question.text;
  document.getElementById('edit-question-type').value = question.type;
  document.getElementById('edit-plan-select').value = question.planId;
  document.getElementById('edit-coverage-select').value = question.coverageId;

  
  document.querySelector('.question-edit-modal form').dataset.id = question.id;
}


const allModals = document.querySelectorAll(".modal");
const allModalsInputs = [...allModals].map(modal => [...modal.querySelectorAll("select, input")]);
export function closeQuestionModals() {
  allModals.forEach((modal) => modal.classList.remove("show"));
  allModalsInputs.forEach(inputs => inputs.forEach(input => input.value = ""))
}





export function createQuestion(event) {
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


export function editQuestion(event) {
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


export function addQuestionToTable(question) {
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


export function deleteQuestion(id) {
  const row = document.querySelector(`#question-table-body input[data-id="${id}"]`)?.closest('tr');
  if (row) row.remove();
}


export function deleteSelectedQuestions() {
  document.querySelectorAll('#question-table-body input[type="checkbox"]:checked').forEach(cb => {
    cb.closest('tr').remove();
  });
}


export const renderQuestions = async () => {
  const questions = await fetchQuestions();
  insertQuestions(questions)
}

const renderPlansSelectBox = () => {
  // TODO
}
const renderCoveragesSelectBox = () => {
  // TODO
}

export const renderSelectBoxes = () => {
  renderPlansSelectBox();
  renderCoveragesSelectBox();
}