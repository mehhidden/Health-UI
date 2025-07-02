export const generateInsuredsTemplate = (healths, products) =>
  healths
    .map((item) => {
      const productNames = Array.isArray(item.products)
        ? item.products
            .map((pid) => products.find((p) => p.id === pid)?.name)
            .filter(Boolean)
            .join("، ")
        : "-";

      return `
      <tr>
        <td><input type="checkbox" data-id="${item.id}"></td>
        <td>${item.id || ""}</td>
        <td>${item.name || ""}</td>
        <td>${productNames || "-"}</td>
        <td>
          <button onclick="showHealthEditModal(${item.id})" class="btn btn-sm edit-btn">ویرایش</button>
          <button onclick="deleteHealth(${item.id})" class="btn btn-sm btn-danger">حذف</button>
        </td>
      </tr>
      `;
    })
    .join("");

export const createProductSelectRow = (products, selectedId = "") => {
  const options = products
    .map(
      (product) =>
        `<option value="${product.id}" ${
          product.id == selectedId ? "selected" : ""
        }>${product.name}</option>`
    )
    .join("");

  return `
    <div class="d-flex align-items-center mb-2 product-select-row">
      <select name="products[]" class="form-control me-2 product-select" required>
        <option value="" disabled ${selectedId ? "" : "selected"}>محصول را انتخاب کنید...</option>
        ${options}
      </select>
      <button type="button" class="btn btn-sm btn-success me-1" onclick="addProductSelect(this)">+</button>
      <button type="button" class="btn btn-sm btn-danger" onclick="removeProductSelect(this)">-</button>
    </div>
  `;
};




