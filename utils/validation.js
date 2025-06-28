import { getCookie } from "./cookie.js";
import { convertBackendValidationToMessage, API } from "./data.js";




export const verifyOtp = async (phone, otp) => {
  const data = {
    phone_number: phone,
    otp: `${otp}`,
  };
  console.log(data);

  const req = await fetch(`${API}/users/phone_verified/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("access")}`
    },
    body: JSON.stringify(data),
  });

  const response = await req.json();

  const isSuccess = req.ok || req.status === 200;
  if (isSuccess) {
    return response.detail || response;
  } else {
    throw new Error(
      response.detail ||
        convertBackendValidationToMessage(response)
    );
  }
};



