

export const generateAddressesTemplate = (addresses) =>
  addresses
    .map(
      (address) => `
        <tr data-info='${JSON.stringify(address)}'>
          <td><input type="checkbox" class="row-checkbox" /></td>
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





export const generateEditAddressModalTemplate = (
  address,
  pos = {
    latitude: 0,
    longitude: 0,
  }
) => {
  const {latitude, longitude} = pos;
  return `
    <div class="form-group mb-3">
      <label for="edit-address-title">عنوان آدرس:</label>
      <input
        type="text"
        id="edit-address-title"
        name="title"
        class="form-control"
        value="${address.title}"
        required
      />
    </div>

    <div class="form-group mb-3">
      <label for="edit-address-province-select">انتخاب استان:</label>
      <select
        name="province"
        id="edit-address-province-select"
        class="form-control province-select"
        required
      >
        
      </select>
    </div>

    <div class="form-group mb-3">
      <label for="edit-address-city-select">انتخاب شهر:</label>
      <select
        name="city"
        id="edit-address-city-select"
        class="form-control city-select"
        required
      >
      </select>
    </div>

    <div class="form-group mb-3">
      <label for="edit-address-full">آدرس کامل:</label>
      <textarea
        id="edit-address-full"
        name="full_address"
        class="form-control"
        rows="3"
        required
      >${address.full_address}</textarea>
    </div>

    <div class="form-row mb-3">
      <div class="form-group col">
        <label for="edit-address-number">پلاک:</label>
        <input
          type="text"
          id="edit-address-number"
          name="number"
          class="form-control"
          value="${address.number}"
          required
        />
      </div>
      <div class="form-group col">
        <label for="edit-address-unit">واحد:</label>
        <input
          type="text"
          id="edit-address-unit"
          name="unit"
          class="form-control"
          value="${address.unit}"
        />
      </div>
    </div>

    <div class="form-group mb-3">
      <label for="edit-address-postal-code">کد پستی:</label>
      <input
        type="text"
        id="edit-address-postal-code"
        name="postal_code"
        class="form-control"
        value="${address.postal_code}"
        required
      />
    </div>

    <div class="form-group mb-3">
      <label for="edit-address-phone">تلفن:</label>
      <input
        type="tel"
        id="edit-address-phone"
        name="phone"
        class="form-control"
        value="${address.phone}"
        required
      />
    </div>

    <div class="form-group mb-3">
      <label>انتخاب روی نقشه:</label>
      <div
        id="${address.id}"
        style="height: 250px; border: 1px solid #ccc; border-radius: 8px"
      ></div>
    </div>

    <div class="form-group form-check mb-3">
      <input
        type="checkbox"
        class="form-check-input"
        id="edit-address-default"
        name="is_default"
        ${address.is_default ? "checked" : ""}
      />
      <label class="form-check-label" for="edit-address-default"
        >آدرس پیش‌فرض</label
      >
    </div>

    <button type="submit" class="btn btn-primary mt-3">ذخیره تغییرات</button>
  `
};
