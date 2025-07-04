export const generateAddressesTemplate = (addresses) =>
  addresses
    .map(
      (address) => `
        <tr data-info='${JSON.stringify(address)}'>
          <td>${address.id}</td>
          <td>${address.title}</td>
          <td>${address.province}</td>
          <td>${address.city}</td>
          <td>${address.full_address}</td>
          <td>${address.number}</td>
          <td>${address.unit}</td>
          <td>${address.postal_code}</td>
          <td>${address.phone}</td>
          <td>${`x : ${address.latitude} , y : ${address.longitude}`}</td>
          <td>${address.is_default ? "بله" : "خیر"}</td>
          <td>
            <button class="edit-btn" onclick='showAddressEditModal(event)'>ویرایش</button>
            <button class="delete-btn" onclick='deleteAddress(event)'>حذف</button>
          </td>
        </tr>
      `
    )
    .join(" ");
