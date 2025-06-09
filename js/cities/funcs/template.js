export const generateCitiesTemplate = (cities) => {
  return cities
    .map(
      (city) => `
        <tr data-info='${JSON.stringify(city)}'>
          <td><input type="checkbox" class="row-checkbox" /></td>
          <td>${city.id}</td>
          <td>${city.province}</td>
          <td>${city.name}</td>
          <td>
            <button class="btn btn-info btn-sm" onclick="showCityEditModal(event)">ویرایش</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCity(event)">حذف</button>
          </td>
        </tr>
    `
    )
    .join("");
};
