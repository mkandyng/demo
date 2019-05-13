import React from "react";

function FutureDevelopment(props) {
    return (
	<div>
	    <p>
	       The focus of this demo is on Javascript with React and techologies in its ecosystems. The next phase is to complete this by creating the server side microservices which can be used as blueprint to implement a full blown modern distributed reactive application.
	    </p>
	    <ul>
	        <li>Mock exchange communicate via <a href="https://www.fixtrading.org/what-is-fix/">FIX</a> for order placement and executions.</li>
	        <li>Microservices that adhered to <a href="https://12factor.net/">12 Factor App</a> and <a href="https://www.reactivemanifesto.org/">Reactive Manifesto</a> to deliver components for market data, instrument static, and order blotter services.</li>
	        <li>Persistent with JPA, Hibernate, MySQL.</li>
	        <li>Distributed In Memory Data Grid with <a href="https://hazelcast.org/">Hazlecast</a>.</li>
	        <li>High performance messaging system with <a href="https://kafka.apache.org/">Apache Kafka</a>.</li>
		<li>Delivering functionalities to mobile devices with <a href="https://facebook.github.io/react-native/">React Native</a>.</li>
	    </ul>
	</div>
    );
}

export default FutureDevelopment;
