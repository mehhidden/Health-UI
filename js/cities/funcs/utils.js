import { getCookie } from "../../../utils/cookie.js"
import { API, convertBackendValidationToMessage } from "../../../utils/data.js"
import { insertTemplateToElement, select } from "../../../utils/elem.js"
import {generateCitiesTemplate} from "./template.js"

export  const fetchCities = async () => {
  const req = await fetch(`${API}/location/cities/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    }
  })
  return (await req.json()).results.results
}

export const deleteReq = async (id) => {
  const req = await fetch(`${API}/location/cities/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });

  if (req.ok) {
    return "حذف  شهر با موفقیت انجام شد";
  } else {
    const response = await req.json();
    throw Error(response.detail || convertBackendValidationToMessage(response));
  }
};

export const createReq = async (data) => {
  const req = await fetch(`${API}/location/cities/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await req.json();
  
  if (req.ok) {

    return response.detail || "ساخت شهر با موفقیت انجام شد";
  } else {
    
    throw Error(convertBackendValidationToMessage(response));
  }
};

export const editReq = async (id, data) => {
  const req = await fetch(`${API}/location/cities/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await req.json();
  
  if (req.ok) {

    return response.detail || "ویرایش شهر با موفقیت انجام شد";
  } else {
    
    throw Error(convertBackendValidationToMessage(response));
  }
};

export const insertCities = (cities) => {
  const citiesWrapper = select("#cities-table-body")
  const template = generateCitiesTemplate(cities)

  insertTemplateToElement(
    template,
    citiesWrapper
  )
}