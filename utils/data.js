export const backendURL = "http://185.94.99.37:81"
export const API = `${backendURL}/api`

export const convertFormDataToObj = (data) => {
  const obj = {}
  for (const [key, value] of data.entries()) {
    obj[key] = value
  }
  return obj
}

export const extractObjFromFormEvent = (event) => {
  const formData = new FormData(event.target)
  return convertFormDataToObj(formData)
}

export const convertBackendValidationToMessage = (backValidation) =>
  Object.entries(backValidation).flat(Infinity)[1]