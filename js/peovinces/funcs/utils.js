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

  if (req.ok) {
    return "حذف با موفقیت انجام شد";
  } else {
    const response = await req.json();
    throw Error(response.detail || convertBackendValidationToMessage(response));
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