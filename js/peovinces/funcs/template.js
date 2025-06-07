export const generateProvincesTemplate = (provinces) => {
  return provinces
    .map(
      (province) => `
        <tr data-info='${JSON.stringify(province)}'>
          <td><input type="checkbox" class="row-checkbox" /></td>
          <td>${province.id}</td>
          <td>${province.name}</td>
          <td>
            <button class="btn btn-info btn-sm" onclick="showProvinceEditModal(event)">ویرایش</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProvince(event)">حذف</button>
          </td>
        </tr>
    `
    )
    .join("");
};
