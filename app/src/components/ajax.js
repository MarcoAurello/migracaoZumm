import React, { Component } from "react";
import styled from "styled-components";

import Loader from "./loader";
const getCookie = require("../utils/getCookie");

const AjaxContainer = styled.div``;

class Ajax extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      request: new XMLHttpRequest(),
    };
  }

  send(method, url, params) {
    const token = getCookie("_token_task_manager");
    this.toggle(true);

    return new Promise((resolved, rejected) => {
      // const { request } = this.state;
      let request = new XMLHttpRequest()
      if (request.OPENED == 1) request.abort();

      request.open(method, url);
      request.setRequestHeader(
        "Content-Type",
        "application/json;charset=UTF-8"
      );
      request.setRequestHeader("Authorization", "Bearer " + token);
      request.addEventListener("load", () => {
        this.toggle(false);        
        if (request.status === 401) {
          rejected(JSON.parse(request.responseText));
        } else {
          if (request.responseText) {
            resolved(JSON.parse(request.responseText));
          } else {
            resolved(null);
          }
        }
      });

      request.addEventListener("error", () => {
        this.toggle(false);
        rejected(JSON.parse(request.responseText));
      });
      request.send(JSON.stringify(params));
    });
  }

  sendFile = (method, url, params) => {
    const token = getCookie("_token_doacoes");

    return new Promise(function(resolve, reject) {
      let req = new XMLHttpRequest();
      req.open(method, url);
      req.setRequestHeader("Authorization", `Bearer ${token}`);

      req.addEventListener(
        "load",
        () => {
          if (req.status === 200) {
            resolve(JSON.parse(req.responseText));
          } else {
            reject(JSON.parse(req.responseText));
          }
        },
        false
      );
      req.send(params);
    });
  };

  toggle(value) {
    this.setState({ loading: value });
  }

  render() {
    const { loading } = this.state;
    return <AjaxContainer>{loading ? <Loader /> : <></>}</AjaxContainer>;
  }
}

export default Ajax;
