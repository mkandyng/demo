import React from "react";

/**
 * Presentation component to display html fragment of document future development
 */

export default function FutureDevelopment() {
  return (<div>
    <p>The focus of this demo is on ReactJS. The next phase are Java server side microservices to demonstrate modern distributed reactive architecture.
    </p>
    <ul>
      <li>Mock exchange communicate via&nbsp;
        <a href="https://www.fixtrading.org/what-is-fix/">FIX</a>
        &nbsp;for order placement and executions.</li>
      <li>Microservices that adhered to&nbsp;
        <a href="https://12factor.net/">12 Factor App</a>
        &nbsp;and&nbsp;
        <a href="https://www.reactivemanifesto.org/">Reactive Manifesto</a>
        &nbsp;to deliver components for market data, instrument static, and order blotter services.</li>
      <li>Persistent with JPA, Hibernate, MySQL.</li>
      <li>Distributed In Memory Data Grid with&nbsp;
        <a href="https://hazelcast.org/">Hazlecast</a>.</li>
      <li>High performance messaging system with&nbsp;
        <a href="https://kafka.apache.org/">Apache Kafka</a>.</li>
      <li>Delivering functionalities to mobile devices with&nbsp;
        <a href="https://facebook.github.io/react-native/">React Native</a>.</li>
    </ul>
  </div>);
}
