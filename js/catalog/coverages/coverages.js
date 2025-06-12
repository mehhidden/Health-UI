const API = "http://185.94.99.37:81/api";

export const fetchCoverages = async () => {
  try {
    const res = await fetch(`${API}/catalog/coverages/`);
    if (!res.ok) throw new Error("⛔ خطا در دریافت اطلاعات پوشش‌ها");
    const data = await res.json();
    return data.results?.results || [];
  } catch (error) {
    throw error;
  }
};

export const fetchPlans = async () => {
  try {
    const res = await fetch(`${API}/catalog/plans/`);
    if (!res.ok) throw new Error("⛔ خطا در دریافت لیست پلن‌ها");
    const data = await res.json();
    return data.results?.results || [];
  } catch (error) {
    throw error;
  }
};

export const createCoverages = async (formData) => {
  try {
    const res = await fetch(`${API}/catalog/coverages/`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "⛔ ایجاد پوشش با خطا مواجه شد");
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const deleteCoverages = async (id) => {
  try {
    const res = await fetch(`${API}/catalog/coverages/${id}/`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "⛔ حذف پوشش با خطا مواجه شد");
    }
    return true;
  } catch (error) {
    throw error;
  }
};

export const updateCoverages = async (id, formData) => {
  try {
    const res = await fetch(`${API}/catalog/coverages/${id}/`, {
      method: "PUT",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "⛔ خطا در ویرایش اطلاعات پوشش");
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
};
  