import { convertFormDataToObj } from "../../../../utils/data.js";
import { handleIsSubmitingStatus, select } from "../../../../utils/elem.js";
import { getTokensByInfo } from "../../../../utils/token.js";

$(document).ready(function () {
  $.validator.setDefaults({
    highlight: function (element) {
      $(element)
        .closest(".form-group")
        .addClass("has-error")
        .removeClass("has-success");
    },
    unhighlight: function (element) {
      $(element)
        .closest(".form-group")
        .removeClass("has-error")
        .addClass("has-success");
    },
    errorElement: "span",
    errorClass: "help-block",
    errorPlacement: function (error, element) {
      if (element.parent(".input-group").length) {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    },
    submitHandler: function (form) {
      const formData = new FormData(form);
      const data = convertFormDataToObj(formData);
      console.log(data);

      const btnInitTemplate = select("#submit-login").innerHTML;

      console.log(btnInitTemplate);
      handleIsSubmitingStatus($("#submit-login"), true, {
        submitingText: "درحال ورود ...",
      });

      getTokensByInfo(data)
        .then((response) => {
          swal(response || "ورود موفق بود", "", "success");
          location.href = "dashboard.html";
        })
        .catch((error) => {
          const errorMesssage = error.message || "مشکل در ورود";
          swal(errorMesssage, "لطفا مجدد تلاش کنید", "error");
        })
        .finally(() => {
          handleIsSubmitingStatus($("#submit-login"), false, {
            successText: btnInitTemplate,
          });
        });
    },
  });

  $("#form").validate();
});
