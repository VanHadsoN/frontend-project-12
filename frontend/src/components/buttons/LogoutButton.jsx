const LogoutButton = (handle, title) => {
  if (localStorage.getItem('user') !== null) {
    return (
      <button type="button" className="logout-button" onClick={handle}>{title}</button>
    );
  }
  return null;
};
export default LogoutButton;
