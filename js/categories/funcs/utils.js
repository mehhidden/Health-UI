import { getCookie } from "../../../utils/cookie.js";
import { API } from "../../../utils/data.js";

export const generateCategoriesTemplate = categories => 
  categories.map(category => `
    <tr data-info='${JSON.stringify(category)}'>
      <td><input type="checkbox" class="row-checkbox" /></td>
      <td>${category.id}</td>
      <td>${category.name}</td>
      <td><img src="${category.icon}" alt="آیکون" style="max-width:40px;" /></td>
      <td>
        <button class="btn btn-sm edit-btn" onclick="showEditInsuranceField(this)">ویرایش</button>
        <button class="btn btn-sm delete-btn" onclick="deleteInsuranceField(this)">حذف</button>
      </td>
    </tr>
  `)

export const fetchCategories = async () => {
  const req = await fetch(`${API}/catalog/categories/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });
  return (await req.json()).results.results;
};
