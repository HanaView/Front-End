export const saveUserTypeFromStorage = (userType) => {
  localStorage.setItem("userType", JSON.stringify(userType));
};

export const getUserTypeFromStorage = () => {
  const data = localStorage.getItem("userType");
  return data ? JSON.parse(data) : null;
};

export const removeUserTypeFromStorage = () => {
  localStorage.removeItem("userType");
};
