
import { API, convertBackendValidationToMessage } from "/utils/data.js";

export const sendOtp = async (phone) => {
  const req = await fetch(`${API}/otp/send_otp/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone_number: phone }),
  })

  const response =  await req.json();

  if (req.ok) {    
    return response.detail || response
  }else{
    throw Error(
      response.detail
      || convertBackendValidationToMessage(
        response
      )
    )
  }

};

export const verifyOtp = async (phone, otp) => {
  const data = {
    phone_number: phone,
    otp : `${otp}`,
  }
  console.log(data)
  
  const req = await fetch(`${API}/users/login_otp/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  
  const response = await req.json();

  

  const isSuccess = req.ok || req.status === 200;
  if (isSuccess) {
    return response;
  } else {
    throw new Error(response.detail);
  }
};
