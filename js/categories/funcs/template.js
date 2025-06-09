export const generateCategoriesTemplate = categories => 
  categories.map(category => `
    <tr data-info='${JSON.stringify(category)}'>
      <td><input type="checkbox" class="row-checkbox" /></td>
      <td>${category.id}</td>
      <td>${category.name}</td>
      <td><img src="${category.icon}" alt="آیکون" style="max-width:40px;" /></td>
      <td>
        <button class="btn btn-sm edit-btn" onclick="showEditInsuranceField(event)">ویرایش</button>
        <button class="btn btn-sm delete-btn" onclick="deleteInsuranceField(event)">حذف</button>
      </td>
    </tr>
  `).join('');