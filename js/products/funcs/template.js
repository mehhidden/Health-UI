export const generateProductsTemplate = products => 
  products.map(product => `
    <tr data-info='${JSON.stringify(product)}'>
      <td><input type="checkbox" class="row-checkbox" /></td>
      <td>${product.id}</td>
      <td>${product.category}</td>
      <td>${product.name}</td>
      <td><img src="${product.icon}" alt="آیکون" style="max-width:40px;" /></td>
      <td>
        <button class="btn btn-sm edit-btn" onclick="showEditInsuranceField(event)">ویرایش</button>
        <button class="btn btn-sm delete-btn" onclick="deleteInsuranceField(event)">حذف</button>
      </td>
    </tr>
  `).join('');