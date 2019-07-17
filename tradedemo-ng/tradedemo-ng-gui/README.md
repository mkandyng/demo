<h2>1.0 Introduction to TradeDemo-NG GUI</h2>

This project is the Web frontend of a skeleton trading application I am developing to serve as a blueprint on how to apply modern technologies to implement a <a href="https://dzone.com/articles/the-battle-of-the-testing-triangle">testable</a> cloud-native application that adheres to the principles of <a href="https://12factor.net/">12 Factor App</a> and <a href="https://www.reactivemanifesto.org/">Reactive Manifesto</a>.

A <a href="http://tradedemo-ng.appspot.com" alt="tradedemo-ng">live demo</a> is available which is deployed to the Google Cloud Platform.

This frontend is written using the following technologies:
<ul>
  <li><a href="https://reactjs.org" alt="reactjs">ReactJs</a>, view layer of the UI.</li>
  <li><a href="https://redux.js.org" alt="redux">Redux</a>, frontend state management.</li>
  <li><a href="https://redux-observable.js.org/" alt="redux">Redux Observable</a>, (Redux + RxJS) for async rest API calls.</li>
  <li><a href="https://jestjs.io/" alt="redux">Jest</a>, Javascript Testing Framework</li>
  <li><a href="https://airbnb.io/enzyme/" alt="enzyme">enzyme</a>, Javascript Testing Utilities</li>
</ul>

Note, I have been a pure Java backend developer in the last decade and only reacquaint my Javascript skills since April 2019. I left the javascript world just when JQuery was the trending technology and now that is legacy. This project is a learning exercise to familiar myself with ReactJS and its technology ecosystem.

As a software engineer and not a UI designer, I am done with the GUI and its functionalities. I am happy enough to share my code as is. During the course of building this frontend, I have to gathered the following <b>modern Javascript and React 'Best Practices'</b>, filtering out many different opinions and make conclusions using my own intuition how best to structure and write testable software that can scale.

Here are my views on modern Javascript and React Best Practices:

<h2>2.0 Structure your project by feature</h2>
<p>
React doesn’t have opinions as it is a view library and does not offer opinionated architecture style.
However, community consensus is to <a href="https://reactjs.org/docs/faq-structure.html">structure your project by feature</a>. However, even that has different takes on where the redux code should reside, does it belongs in its own folder or with its feature?
<p>

<p>
In my code, I have setup three top level folder structure:

<ol>
  <li><b>libs</b>, this is where the share code (utils and components resides).</li>
  <li><b>modules</b>, this is where I bundled state with the corresponding feature UI elements.</li>
  <li><b>pages</b>, this is where I define the structure of a pages and routes.</li>
</ol>
</p>

In this project structure, the application can grow organically with more pages, plugging in modules, with share code push to the libs directory. Each module is a subsystem with store defining reducer, epics, and actions. This allow each module to be build and test separately. The structure of pages are to glue these modules together to form an application.

<h2>3.0 Prefer React Functional Component over Class Component </h2>
<p>
You can create React component using pure function or using class syntax. Some people follows the convention of using class to create <a href="https://medium.com/@learnreact/container-components-c0e67432e005">container component</a> and pure function only for presentation component. However, with <a href="https://reactjs.org/docs/hooks-effect.html">React hook</a> in conjunction with <a href="https://redux.js.org" alt="redux">Redux</a> as state management, you can create container component as pure function.
</p>
<p>Here are some of the benefits of pure functional components:
<ol>
  <li><b>Less boiler plate,</b> No constructor, no life cycles, simple function takes props as input and return JSX.</li>
  <li><b>Testability</b>, As a function, same input will produces the same output.</li>
  <li><b>Interface</b>, Functional component interface can use destruct props to make inputs clear.</li>
  <li><b>Strategically</b>, The future of React is functional. Here is the real <a href="https://reasonml.github.io/docs/en/what-and-why">Reason</a> behind its creator strategic decision.
</ol>
</p>

<h2>4.0 Use a state management library</h2>
<p>
The standard way to update React view is to leverage <a href="https://facebook.github.io/flux/docs/in-depth-overview">Flux architecture</a> for uni-directional data flow to update its UI. Redux is one most popular Flux implementation, making your application easier to reason about.
</p>
<p>
Without state management library, as the application grow, it can become difficult to manage states within each individual components and co-ordinating between parent and children components.
</p>
<p>
In this project, I grouped the store data as modules and within it, define the React components that renders its data.
</p>

<h2>5.0 Test (Unit), Test (Integration), and Test (End2End)</h2>
<p>
Whether you are writing Test First, Test Last, or Test In-Between, if you want to be productive, you need lot of Unit Tests on export functions, Integration Test on modules, and End-2-End at the application level.
</p>
<p>
Many people argue about productivity of unit tests. Many are happy to promote <a href="https://en.wikipedia.org/wiki/Test-driven_development">Test Driven Development</a> and only have End2End tests that the whole system or large part of the system to demonstrate their practices. Although you can define an End2End test to specify a feature before any code is written to ensure <b>building the right application</b>, testing only at the highest level does not enforce we <b>build the application right</b>.
</p>
<p>
The original <a href="https://martinfowler.com/bliki/TestPyramid.html">Test Pyramid</a> define layers such as <b>UI, Service, and Unit</b>. The modern takes on <a href="https://dzone.com/articles/the-battle-of-the-testing-triangle">Test Triangle</a> do not mix application architecture with test artefacts as each layers, whether it is UI or backend services, should follows the same rigorous engineering practice. In this project, I have shown at the UI layer, we can group units into modules and glue modules together to form an application. If we apply the modern takes of testing triangle, we can write feature tests at End2End level, drilling down into more focus tests at module level, and test all edge cases at the unit level.
</p>
<p>
Writing unit tests and integration tests can be time consuming and can lead up to 3x as much code covering all edge cases. This mean to create an application that is adaptable to change, it needs to be made up of small fully tested components that are <a href="https://en.wikipedia.org/wiki/Loose_coupling">loosely coupled</a>, modules that are <a href="https://en.wikipedia.org/wiki/Cohesion_(computer_science)">highly cohesive</a>, and the application that is <a href="https://www.tutorialspoint.com/software_testing_dictionary/correctness.htm">functionally correct</a>.
</p>
<p>
In the javascript world, there are many test libraries and frameworks. I tend to use the same set of tool to perform different level of tests and not resort to specific tool for a given layer. This ensure all tests are written in a consistent manner, just the level of test granularity differs. For this project, I used <a href="https://jestjs.io/" alt="redux">Jest</a> and <a href="https://airbnb.io/enzyme/" alt="enzyme">enzyme</a> and created:

<ol>
  <li><b>Unit Tests,</b> All the tests that end with <b>.test.</b></li>
  <li><b>Integration Test,</b> All the test that end with <b>.integration.test.</b></li>
  <li><b>End2End</b>, All tests that verify the whole application is in <b>App-end2end.test</b>.</li>
</ol>
</p>
