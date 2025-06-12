const API = "http://185.94.99.37:81/api";

export const fetchPlans = async () => {
  try {
    const res = await fetch(`${API}/catalog/plans/`);
    if (!res.ok) throw new Error("خطا در دریافت پلن ");
    return await res.json();
  } catch (error) {
    console.error("fetchPlans error:", error);
    throw error;
  }
};


export const createPlan = async (formData) => {
  try {
    const res = await fetch(`${API}/catalog/plans/`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("🛑 Server Error Response:", err);
      throw new Error("خطا در ایجاد پلن");
    }

    return await res.json();
  } catch (error) {
    console.error("createPlan error:", error);
    throw error;
  }
};

 


export const deletePlan = async (id) => {
  try {
    const res = await fetch(`${API}/catalog/plans/${id}/`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "خطا در حذف پلن بانک");
    }
    return true;
  } catch (error) {
    console.error("deletePlan error:", error);
    throw error;
  }
};


export async function updatePlan(id, formData) {
  const response = await fetch(`${API}/catalog/plans/${id}/`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {

    let errorMessage = "خطا در ویرایش پلن";
    try {
      const errorData = await response.json();

      if (errorData.message) errorMessage = errorData.message;
      else if (errorData.detail) errorMessage = errorData.detail;
      else if (typeof errorData === "object") {

        errorMessage = Object.values(errorData).flat().join("\n");
      }
    } catch {

    }
    throw new Error(errorMessage);
  }

  return response.json();
}




export const fetchProducts = async () => {
  try {
    const res = await fetch(`${API}/catalog/products/`);
    if (!res.ok) throw new Error("خطا در دریافت محصولات");
    return await res.json();
  } catch (error) {
    console.error("fetchProducts error:", error);
    throw error;
  }
};
