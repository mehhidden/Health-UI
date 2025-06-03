import { handleIsSubmitingStatus } from "../../../../utils/elem.js";
import { saveToken } from "../../../../utils/token.js";
import { sendOtp, verifyOtp } from "/utils/otp.js";



$(document).ready(function () {
  // Validate a field/input
  function validateField(elem) {
    const val = elem.val();
    const parent = elem.parents(".form-group");

    parent.find(".help-block").html("");
    const title = elem.attr("title");
    let error = false;

    let message = "";

    if (elem.prop("required") && !parent.hasClass("d-none")) {
      if (val == "") {
        message = "<p>وارد کردن " + title + "  اجباری است.</p>";
        parent.find(".help-block").append(message);
        error = true;
      }
    }

    if (!$(".row-sms").hasClass("d-none") && val.length > 0) {
        
      if (!/^\d{6}$/.test(val)) {
        message =
          "<p>کد شش رقمی ارسال شده با شماره همراه را دقیقا وارد کنید.</p>";
        
        parent.find(".help-block").append(message);
        error = true;
      } else {
        error = false;
      }
    } else if (elem.attr("id") === "txtCellphone" && val.length > 0) {
      if (!/^09\d{9}|^9\d{9}$/.test(val)) {
        message = "<p>شماره همراه نادرست است، مثال: 09123456789.</p>";
        parent.find(".help-block").append(message);
        error = true;
      }
    }

    if (error) {
      parent.addClass("has-error");
      return false;
    } else {
      parent.removeClass("has-error");
      parent.find(".help-block").html("");
      return true;
    }
  }

  // Handle submit button
  $("#btnSubmit").click(async function () {
    if ($(".row-sms").hasClass("d-none")) {
      const parent = $("#txtCellphone").parents(".form-group");

      if (validateField($("#txtCellphone"))) {
        handleIsSubmitingStatus($("#btnSubmit"), true);

        try {
          const response = await ticker();
          parent.removeClass("has-error");
          parent.find(".help-block").append(`<p>${response.detail}</p>`);

          $("#btnSubmit").addClass("code");

          $("#txtCellphone").attr("readonly", "readonly");
          $("#mainAlert").text(response.detail);
          $(".row-sms").removeClass("d-none");
          $("#txtCode").focus();
        } catch (error) {
          parent.addClass("has-error");
          parent.find(".help-block").append(`<p>${error.message}</p>`);
        } finally {
          handleIsSubmitingStatus($("#btnSubmit"), false);
        }
      }
    } else {
      
      const parent = $("#txtCode").parents(".form-group");

      if (validateField($("#txtCode"))) {
        const phone = $("#txtCellphone").val();
        const otp = $("#txtCode").val();
        handleIsSubmitingStatus($("#btnSubmit"), true);
        try {
          const verifiedData = await verifyOtp(phone, otp);

          
          
          saveToken(verifiedData.access, verifiedData.refresh)
          // save token + refresh token in local storage

          window.location.href = "dashboard.html";
        } catch (error) {
          parent.addClass("has-error");
          parent.find(".help-block").append(`<p>${error.message}</p>`);
        } finally {
          handleIsSubmitingStatus($("#btnSubmit"), false);
        }
      }
    }
  });

  // Click button when enter press in inputs
  $("#txtCellphone, #txtCode").on("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      $("#btnSubmit").click();
    }
  });

  // Resend sms timer
  async function ticker() {
    let remainSeconds = 120;
    const intervalId = setInterval(function () {
      if (remainSeconds <= 0) {
        $("#btnResendSms").removeClass("d-none");
        $("#btnResendSms").on("click", ticker)
        $("#otpTickerBox").addClass("d-none");
        clearInterval(intervalId);
      } else {
        let minutes = Math.floor(remainSeconds / 60);
        let seconds = remainSeconds % 60;

        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }

        $("#minutes").text(minutes);
        $("#seconds").text(seconds);

        remainSeconds--;
      }
    }, 1000);
    const phone = $("#txtCellphone").val();
    return await sendOtp(phone);
  }
});
