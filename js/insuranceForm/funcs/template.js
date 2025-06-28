export const generateInsuredsTemplate = (items, basicsMap = {}) =>
  items
    .map(
      (item, index) => `
    <tr data-info='${JSON.stringify(item)}'>
      <td><input type="checkbox" class="row-checkbox insured-checkbox" data-index="${index}" /></td>
      <td>${item.id}</td>
      <td>${item.first_name || "-"}</td>
      <td>${item.last_name || "-"}</td>
      <td>${item.national_code || "-"}</td>
      <td>${item.phone_number || "-"}</td>
      <td>${basicsMap[item.basic_insurer] || "-"}</td>
      <td>${item.is_married ? "متأهل" : "مجرد"}</td>
      <td>${item.is_self_insured ? "بله" : "خیر"}</td>
      <td>${item.birth_date || "-"}</td>
      <td>
        <button class="btn btn-sm btn-info" onclick="showEditInsured(event)">ویرایش</button>
        <button class="btn btn-sm btn-danger" onclick="deleteInsured(event)">حذف</button>
      </td>
    </tr>
  `
    )
    .join("");
