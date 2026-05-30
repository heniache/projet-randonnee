export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  return Boolean(token && userId);
};
