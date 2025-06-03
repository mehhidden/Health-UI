import { getCookie } from "../../../utils/cookie.js";
import { API, backendURL } from "../../../utils/data.js";
import {
  insertTemplateToElement,
  select,
  selectAll,
} from "../../../utils/elem.js";

export const getSystemConfig = async () => {
  const response = await fetch(`${API}/meta_form/system_config/`, {
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
  })
    .then((res) => res.json())
    .then((result) => result.data);
  return response;
};

export const insertFavIcon = (iconSrc) => {
  let link = select("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "shortcut icon";
    document.head.appendChild(link);
  }

  link.href = `${backendURL}${iconSrc}`;
};

export const insertCopyright = (text) => {
  const copyrightEl = select(".copyright .float-start");
  if (copyrightEl) {
    insertTemplateToElement(text, copyrightEl);
  }
};

export const insertLogo = (logoSrc) => {
  const logoElems = selectAll(".logo-con");
  [...logoElems].forEach((logoEl) => {
    const logoImgEl = logoEl.querySelector("img");
    (logoImgEl || logoEl).src = `${backendURL}${logoSrc}`;
  });
};


export const editConfigReq = async (formData) => {
  await fetch(`${API}/meta_form/system_config/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getCookie("access")}`,
    },
    body: formData,
  })
}