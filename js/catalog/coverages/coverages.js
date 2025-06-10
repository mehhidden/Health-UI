const API = "http://185.94.99.37:81/api";


export const fetchCoverages = async () => {
  try {
    const res = await fetch(`${API}/catalog/coverages/`);
    if (!res.ok) throw new Error("⛔ خطا در دریافت اطلاعات پوشش‌ها");
    return await res.json();
  } catch (error) {
    console.error("❌ fetchCoverages error:", error);
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
      console.error("🛑 createCoverages server response:", err);
      throw new Error(err.detail || "⛔ ایجاد پوشش با خطا مواجه شد");
    }

    return await res.json();
  } catch (error) {
    console.error("❌ createCoverages error:", error);
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
    console.error("❌ deleteCoverages error:", error);
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
    console.error("❌ updateCoverages error:", error);
    throw error;
  }
};
