const API = "http://185.94.99.37:81/api";

export const fetchAccountTypes = async () => {
  try {
    const res = await fetch(`${API}/bank_info/account-types/`);
    if (!res.ok) throw new Error("خطا در گرفتن تایپ اکانت");
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const createAccountType = async (data) => {
  const res = await fetch(`${API}/bank_info/account-types/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "خطا در ایجاد نوع حساب");
  }

  return await res.json();
};

export const deleteAccountType = async (id) => {
  const res = await fetch(`${API}/bank_info/account-types/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("خطا در حذف نوع حساب");
  return true;
};

export const updateAccountType = async (id, data) => {
  const res = await fetch(`${API}/bank_info/account-types/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "خطا در بروزرسانی نوع حساب");
  }

  return await res.json();
};
