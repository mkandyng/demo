import React from "react";

export default function Technologies() {
  return (
    <div>
      <p>
        TradeDemo-NG is a skeleton trading application with&nbsp;
        <a href="https://github.com/mkandyng/demo/tree/master/tradedemo-ng">source code</a>
          &nbsp;to demonstrate how to deliver a Cloud-Native&nbsp;
        <a href="https://en.m.wikipedia.org/wiki/Single-page_application" alt="SPA">Single Page Application</a>.
      </p>
      <ul>
        <li>Web application with&nbsp;
          <a href="https://github.com/facebook/react" alt="React">React</a>
          &nbsp;(UI Layer),&nbsp;
          <a href="https://redux.js.org/introduction/getting-started" alt="Redux">Redux</a>
          &nbsp;(Flux architecture),&nbsp;
          <a href="https://redux-observable.js.org/docs/basics/Epics.html" alt="edux-observable">Redux Observable</a>
          &nbsp;(Epics using&nbsp;
          <a href="https://rxjs-dev.firebaseapp.com/">RxJs</a>
          &nbsp;for async processing).
        </li>
        <li>Microservices delivering Rest API for marketdata with&nbsp;
          <a href="https://spring.io/proje/spring-boot" alt="Springboot">Springboot</a>.</li>
        <li>Cloud-Native application running as&nbsp;
          <a href="https://www.docker.com/">Docker container</a>
          &nbsp;orchestrated by&nbsp;
          <a href="https://kubernetes.io/">Kubernetes</a>
          &nbsp;in&nbsp;
          <a href="https://cloud.google.com/" alt="Google Cloud">Google Cloud Platform</a>.</li>
      </ul>
    </div>
  );
}
