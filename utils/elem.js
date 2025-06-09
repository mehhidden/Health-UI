export const select = (selector) => document.querySelector(selector);

export const selectAll = (selector) => document.querySelectorAll(selector);

export const insertTemplateToElement = (template, element, dontClean) => {
  !dontClean ? (element.innerHTML = "") : "";

  element.insertAdjacentHTML("beforeend", template);
};

export const handleIsSubmitingStatus = (
  QElem,
  isSubmiting = true,
  textObj = {
    submitingText: " در حال ارسال ...",
    successText: "تایید و ادامه ",
  },
  dontClean
) => {
  const btn = QElem || $("#btnSubmit");
  const text = isSubmiting ? textObj.submitingText : textObj.successText;
  const opacity = isSubmiting ? "0.5" : "1";

  btn.attr("disabled", isSubmiting);
  if (!dontClean) {
    btn.html("");
  }
  btn.html(text);
  btn.css("opacity", opacity);
};

export const getTrInfo = (e) => {
  const tr = e.currentTarget.closest("tr");
  const info = JSON.parse(tr.dataset.info);
  return info;
};

export const setStyleToEl = (el, styleObj) => {
  Object.keys(styleObj).forEach((key) => {
    el.style[key] = styleObj[key];
  });
};
