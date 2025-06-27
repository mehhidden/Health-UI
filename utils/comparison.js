export const extractDeletedOnes = (arr1, arr2, key = "") => {
  return arr1.filter((item) =>
    key ? !arr2.some((item2) => item2[key] === item[key]) : !arr2.includes(item)
  );
};
export const extractNewOnes = (arr1, arr2, key = "") => {
  return arr2.filter((item) =>
    key ? !arr1.some((item2) => item2[key] === item[key]) : !arr1.includes(item)
  );
}