const getCookie = require("./getCookie");

module.exports = () => {
  return new Promise((resolved, rejected) => {
    const token = getCookie("_token_task_manager");

    let request = new XMLHttpRequest();
    request.open(
      "get",
      `${process.env.REACT_APP_DOMAIN_API}/api/authentication/logged`
    );
    request.setRequestHeader("Authorization", "Bearer " + token);
    request.addEventListener("load", () => {
      if (request.status === 401) {
        resolved({ logged: false, data: null });
      } else if (request.status === 200) {
        resolved({ logged: true, data: JSON.parse(request.responseText) });
      }
    });
    request.send();
  });
};
