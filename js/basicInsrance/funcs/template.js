export const generateInsuredsTemplate = (items) =>
  items
    .map(
      (item) => `
    <tr data-info='${JSON.stringify(item)}'>
      <td><input type="checkbox" class="insurer-checkbox" /></td>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>
        <button class="btn btn-sm btn-info" onclick="showEditInsurer(event)">ویرایش</button>
        <button class="btn btn-sm btn-danger" onclick="deleteInsurer(event)">حذف</button>
      </td>
    </tr>
  `
    )
    .join("");
