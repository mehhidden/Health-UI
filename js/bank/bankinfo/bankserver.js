const API = "http://185.94.99.37:81/api";



export const fetchBanks = async () => {
  try {
    const res = await fetch(`${API}/bank_info/banks/`);
    if (!res.ok) throw new Error("خطا در دریافت بانک‌ها");
    return await res.json();
  } catch (error) {
    console.error("fetchBanks error:", error);
    throw error;
  }
};




export const createBank = async (data) => {
  try {
    const res = await fetch(`${API}/bank_info/banks/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "خطا در ایجاد بانک");
    }
    return await res.json();
  } catch (error) {
    console.error("createBank error:", error);
    throw error;
  }
};



export const deleteBank = async (id) => {
  try {
    const res = await fetch(`${API}/bank_info/banks/${id}/`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "خطا در حذف بانک");
    }
    return true;
  } catch (error) {
    console.error("deleteBank error:", error);
    throw error;
  }
};



export const updateBank = async (id, data) => {
  try {
    const res = await fetch(`${API}/bank_info/banks/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "خطا در ویرایش بانک");
    }
    return await res.json();
  } catch (error) {
    console.error("updateBank error:", error);
    throw error;
  }
};

