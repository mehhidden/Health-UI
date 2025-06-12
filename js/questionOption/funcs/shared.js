let questionOptions = [];
let questions = []; // این لیست از سرور یا AJAX باید پر شود

// نمایش مودال افزودن
function showQuestionOptionCreateModal() {
  document.querySelector('.question-option-create-modal').classList.add('show');
  fillQuestionSelect('question-select');
}

// نمایش مودال ویرایش
function showQuestionOptionEditModal(optionId) {
  const modal = document.querySelector('.question-option-edit-modal');
  modal.classList.add('show');

  const option = questionOptions.find(q => q.id === optionId);
  if (!option) return;

  modal.querySelector('[name="option_text"]').value = option.option_text;
  modal.querySelector('[name="impact"]').value = option.impact;
  fillQuestionSelect('edit-question-select', option.question_id);

  modal.dataset.id = optionId;
}

// بستن هر دو مودال
function closeQuestionOptionModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
}

// پر کردن select سوال‌ها
function fillQuestionSelect(selectId, selectedId = null) {
  const select = document.getElementById(selectId);
  select.innerHTML = questions.map(q => `
    <option value="${q.id}" ${q.id === selectedId ? 'selected' : ''}>${q.text}</option>
  `).join('');
}

// ایجاد گزینه جدید
function createQuestionOption(event) {
  event.preventDefault();

  const form = event.target;
  const option = {
    id: Date.now(),
    question_id: Number(form.question_id.value),
    option_text: form.option_text.value,
    impact: Number(form.impact.value),
  };

  questionOptions.push(option);
  appendOptionToTable(option);
  form.reset();
  closeQuestionOptionModals();
}

// ویرایش گزینه
function editQuestionOption(event) {
  event.preventDefault();

  const form = event.target;
  const id = Number(document.querySelector('.question-option-edit-modal').dataset.id);
  const index = questionOptions.findIndex(q => q.id === id);

  if (index !== -1) {
    questionOptions[index] = {
      id,
      question_id: Number(form.question_id.value),
      option_text: form.option_text.value,
      impact: Number(form.impact.value),
    };
    renderTable();
    closeQuestionOptionModals();
  }
}

// افزودن به جدول
function appendOptionToTable(option) {
  const tbody = document.getElementById('question-option-table-body');
  const questionText = (questions.find(q => q.id === option.question_id) || {}).text || '---';

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="checkbox" data-id="${option.id}"></td>
    <td>${option.id}</td>
    <td>${option.question_id}</td>
    <td>${option.option_text}</td>
    <td>${option.impact}%</td>
    <td>
      <button class="edit-btn" onclick="showQuestionOptionEditModal(${option.id})">ویرایش</button>
      <button class="delete-btn" onclick="deleteQuestionOption(${option.id})">حذف</button>
    </td>
  `;
  tbody.appendChild(tr);
}

// بازسازی جدول
function renderTable() {
  const tbody = document.getElementById('question-option-table-body');
  tbody.innerHTML = '';
  questionOptions.forEach(option => appendOptionToTable(option));
}

// حذف گزینه تکی
function deleteQuestionOption(id) {
  questionOptions = questionOptions.filter(q => q.id !== id);
  renderTable();
}

// حذف گروهی
function deleteSelectedQuestionOptions() {
  const selected = Array.from(document.querySelectorAll('#question-option-table-body input[type="checkbox"]:checked'))
    .map(input => Number(input.dataset.id));

  if (selected.length === 0) return;

  questionOptions = questionOptions.filter(q => !selected.includes(q.id));
  renderTable();
}

// انتخاب همه
document.getElementById('question-option-check-all').addEventListener('change', function () {
  const checkboxes = document.querySelectorAll('#question-option-table-body input[type="checkbox"]');
  checkboxes.forEach(c => c.checked = this.checked);
});

// شبیه‌سازی داده سوال‌ها (موقت)
questions = [
  { id: 1, text: 'میزان رضایت از خدمات' },
  { id: 2, text: 'میزان آگاهی از بیمه' },
  { id: 3, text: 'آشنایی با نماینده' }
];
