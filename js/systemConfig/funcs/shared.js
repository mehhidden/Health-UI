import { backendURL } from "../../../utils/data.js";
import { handleIsSubmitingStatus, select } from "../../../utils/elem.js";
import {
  editConfigReq,
  getSystemConfig,
  insertCopyright,
  insertFavIcon,
  insertLogo,
} from "./utils.js";
let systemConfig = null;
export const loadSystemConfig = async () => {
  try {
    systemConfig = await getSystemConfig();

    document.title = systemConfig.system_name;
    insertFavIcon(systemConfig.system_icon);
    insertCopyright(systemConfig.copyright_text);
    insertLogo(systemConfig.system_logo);
  } catch (error) {
    console.log(error.message);
  }
};

export const previewImage = (event, previewId) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const preview = document.getElementById(previewId);
    preview.src = e.target.result; // پیش‌نمایش تصویر را آپدیت می‌کند
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};

export const loadPageSystemConfig = async () => {

  if (!systemConfig) {
    systemConfig = await getSystemConfig()
  }

  const iconPreviewEl = select("#icon_preview");
  const logoPreviewEl = select("#logo_preview");
  const copyrightInput = select("#copyright_text");
  const systemNameInput = select("#system_name");

  iconPreviewEl.src = `${backendURL}${systemConfig.system_icon}`;
  logoPreviewEl.src = `${backendURL}${systemConfig.system_logo}`;
  copyrightInput.value = systemConfig.copyright_text;
  systemNameInput.value = systemConfig.system_name;
}

export const submitEdit = async event => {
  event.preventDefault();
  const formData = new FormData(event.target);
  

  if (!(formData.get("system_icon").name.trim())) {
    formData.delete("system_icon");
  }
  if (!(formData.get("system_logo").name.trim())) {
    formData.delete("system_logo");
  }

  const btnInitTemplate = select("#submit-btn").innerHTML
  handleIsSubmitingStatus(
    $("#submit-btn"),
    true, 
    {
      submitingText: "در حال ذخیره ..."
    }
  )

  try {
    await editConfigReq(formData);
    loadSystemConfig()
    swal(
      "تنظیمات با موفقیت تغییر یافت",
      "",
      "success"
    )
  } catch (error) {
    swal(
      error.message,
      "",
      "error"
    )
  }finally{
    handleIsSubmitingStatus(
      $("#submit-btn"),
      false,
      {
        successText: btnInitTemplate
      }
    )
  }
}
