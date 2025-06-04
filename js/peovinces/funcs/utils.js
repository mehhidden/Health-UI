import { getCookie } from "../../../utils/cookie.js"
import { API } from "../../../utils/data.js"
import { insertTemplateToElement, select } from "../../../utils/elem.js"
import {generateProvincesTemplate} from "./template.js"

export  const fetchProvinces = async () => {
  const req = await fetch(`${API}/location/provinces/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    }
  })
  return (await req.json()).results.results
}

export const deleteReq = async (id) => {
  const req = await fetch(`${API}/location/provinces/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  });

  console.log(req)

  if (req.ok) {
    return "حذف  استان با موفقیت انجام شد";
  } else {
    const response = await req.json();
    throw Error(response.detail || convertBackendValidationToMessage(response));
  }
};

export const createReq = async (data) => {
  const req = await fetch(`${API}/location/provinces/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await req.json();
  
  if (req.ok) {

    return response.detail || "ساخت استان با موفقیت انجام شد";
  } else {
    
    throw Error(convertBackendValidationToMessage(response));
  }
};

export const insertProvinces = (provinces) => {
  const procincesWrapper = select("#provinces-table-body")
  const template = generateProvincesTemplate(provinces)

  insertTemplateToElement(
    template,
    procincesWrapper
  )
}