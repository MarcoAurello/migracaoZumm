import React, { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    function logout() {
      document.cookie =
        "_token_task_manager=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      window.location = `${process.env.REACT_APP_DOMAIN}/login`;
    }

    logout();
  });

  return <div>Saindo...</div>;
};

export default Logout;
