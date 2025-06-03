import { verifyOtp } from "/utils/validation.js";
import { sendOtp } from "/utils/otp.js";
import { handleIsSubmitingStatus } from "/utils/elem.js";

$(document).ready(function () {
  $("#phone-form").validate({
    rules: {
      phone_number: {
        required: true,
        minlength: 11,
        maxlength: 11,
        digits: true,
      },
      verification_code: {
        minlength: 6,
        maxlength: 6,
        digits: true,
      },
    },
    messages: {
      phone_number: {
        required: "لطفاً شماره موبایل را وارد کنید",
        minlength: "شماره موبایل باید 11 رقم باشد",
        maxlength: "شماره موبایل باید 11 رقم باشد",
        digits: "فقط عدد وارد کنید",
      },
      verification_code: {
        required: "کد تأیید را وارد کنید",
        minlength: "کد تأیید باید 6 رقمی باشد",
        maxlength: "کد تأیید باید 6 رقمی باشد",
        digits: "فقط عدد وارد کنید",
      },
    },
    submitHandler: function (form) {
      const btnInitTemplate = document.querySelector("#submit-btn").innerHTML;
      const formData = new FormData(form);
      const phoneNumber = formData.get("phone_number");
      const otp = formData.get("verification_code");

      if (!otp) {
        // مرحله ارسال کد
        handleIsSubmitingStatus($("#submit-btn"), true, {
          submitingText: "درحال ارسال کد...",
        });

        sendOtp(phoneNumber)
          .then((response) => {
            swal(response || "کد تأیید ارسال شد", "", "success");
            $("#code-input-wrapper").slideDown();
            // الزامی کردن کد وقتی کد وارد می‌شه
            $("input[name='verification_code']").rules("add", { required: true });
          })
          .catch((err) => {
            swal(err.message || "مشکلی رخ داده است", "", "error");
          })
          .finally(() => {
            handleIsSubmitingStatus($("#submit-btn"), false, {
              successText: btnInitTemplate,
            });
          });
      } else {
        // مرحله تأیید کد
        handleIsSubmitingStatus($("#submit-btn"), true, {
          submitingText: "درحال تأیید...",
        });

        verifyOtp(phoneNumber, otp)
          .then((response) => {
            swal(response || "ورود موفق بود", "", "success");
          })
          .catch((err) => {
            swal(err.message || "کد اشتباه است", "", "error");
          })
          .finally(() => {
            handleIsSubmitingStatus($("#submit-btn"), false, {
              successText: btnInitTemplate,
            });
          });
      }
    },
  });
});
