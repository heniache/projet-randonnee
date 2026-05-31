export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  return Boolean(token && userId);
};

export const isAdmin = () => {
  return isAuthenticated() && localStorage.getItem("role") === "admin";
};
