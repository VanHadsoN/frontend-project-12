const getAuthHeader = (user) => {
  if (user?.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

export default getAuthHeader;
