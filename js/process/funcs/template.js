export const generateInsuredsTemplate = (processes, plans) => {
  return processes.map((proc, index) => `
    <tr>
      <td><input type="checkbox" data-index="${index}"></td>
      <td>${proc.id || ""}</td>
      <td>${proc.name || ""}</td>
      <td>${proc.order || ""}</td>
      <td>${plans.find(p => p.id === proc.plan)?.name || ""}</td>
      <td>
        <button onclick="showProcessEditModal(${index})" class="btn btn-sm btn-warning">ویرایش</button>
        <button onclick="deleteProcess(${index})" class="btn btn-sm btn-danger">حذف</button>
      </td>
    </tr>
  `).join("");
};
