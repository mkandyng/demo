import React from "react";

function Technologies(props) {
    return (
	<div>
	    <p>
	        TradeDemo-NG is a skeleton trading application to demonstrate how to deliver a Cloud-Native <a href="https://en.m.wikipedia.org/wiki/Single-page_application" alt="SPA">Single Page Application</a>.
	    </p>
	    <ul>
	        <li>Web application with <a href="https://github.com/facebook/react" alt="React">React</a> (UI Layer),<span> </span>
	        <a href="https://redux.js.org/introduction/getting-started" alt="Redux">Redux</a> (Flux architecture),<span> </span>
	        <a href="https://redux-observable.js.org/docs/basics/Epics.html" alt="edux-observable">Redux Observable</a> (Epics using <a href="https://rxjs-dev.firebaseapp.com/">RxJs</a> for async processing).
		</li>
	        <li>Microservices delivering Rest API for marketdata with <a href="https://spring.io/proje/spring-boot" alt="Springboot">Springboot</a>.</li>
	        <li>Cloud-Native application running as <a href="https://www.docker.com/">Docker container</a> orchestrated by <a href="https://kubernetes.io/">Kubernetes</a> in <a href="https://cloud.google.com/" alt="Google Cloud">Google Cloud Platform</a>.</li>
	    </ul>
	</div>
    );
}

export default Technologies;
