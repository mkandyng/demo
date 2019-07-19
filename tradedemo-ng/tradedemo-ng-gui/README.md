<h2>1.0 Introduction to TradeDemo-NG GUI</h2>

This project is the Web front end of a skeleton trading application I am developing to leverage modern technology to create a <a href="https://dzone.com/articles/the-battle-of-the-testing-triangle">testable</a> cloud-native application that adheres to the principles of <a href="https://12factor.net/">12 Factor App</a> and <a href="https://www.reactivemanifesto.org/">Reactive Manifesto</a>.

A <a href="http://tradedemo-ng.appspot.com" alt="tradedemo-ng">live demo</a> is available which is deployed to the Google Cloud Platform.

This front end is written using the following technologies:
<ul>
  <li><a href="https://reactjs.org" alt="reactjs">ReactJs</a>, view layer of the UI.</li>
  <li><a href="https://redux.js.org" alt="redux">Redux</a>, frontend state management.</li>
  <li><a href="https://redux-observable.js.org/" alt="redux">Redux Observable</a>, (Redux + RxJS) for async rest API calls.</li>
  <li><a href="https://jestjs.io/" alt="redux">Jest</a>, Javascript Testing Framework</li>
  <li><a href="https://airbnb.io/enzyme/" alt="enzyme">enzyme</a>, Javascript Testing Utilities</li>
</ul>

Note, I have been a Java backend developer in the last decade and only reacquaint with Javascript since April 2019. When I stopped using javascript in 2009, JQuery was the trending technology, now heading towards legacy. This project is a learning exercise on ReactJS and its technology ecosystem.

As a software engineer and not a UI designer, I am done with the GUI and its functionalities. I am happy enough to share my code as is. Building this front end allow me to gather some <b>modern Javascript and React 'Best Practices'</b>, filtering out different opinions and conclude with own intuition how to structure and write testable software that can scale.

Here are my views on modern Javascript and React Best Practices:

<h2>2.0 Structure your project by feature</h2>
<p>
React doesn’t have opinions as it is a view library and does not offer opinionated architecture style.
The react community consensus is to <a href="https://reactjs.org/docs/faq-structure.html">structure your project by feature</a>.
<p>

<p>
In my code, I have setup three top level folder structure:

<ol>
  <li><b>libs</b>, this is where the share code (utils and components resides).</li>
  <li><b>modules</b>, this is where I bundled state with the corresponding UI.</li>
  <li><b>pages</b>, this is where I define the structure of a pages and routes.</li>
</ol>
</p>

In this project structure, the application can grow organically with more pages, plugging in more modules, and push share code to the libs directory. Each module is a subsystem with store defining reducer, epics, and actions. This allows each module to be build and test separately. An overall application is created from pages that plug these modules together.

<h2>3.0 Prefer React Functional Component over Class Component </h2>
<p>
You can create React component using pure function or using class syntax. Some people follow the convention of using class to create <a href="https://medium.com/@learnreact/container-components-c0e67432e005">container component</a> and pure function only for presentation component. However, with <a href="https://reactjs.org/docs/hooks-effect.html">React hook</a> in conjunction with <a href="https://redux.js.org" alt="redux">Redux</a> as state management, you can create container component as pure function.
</p>
<p>Here are some of the benefits of pure functional component:
<ol>
  <li><b>Less boiler plate,</b> No constructor, no life cycles, pure function takes props as input and return JSX.</li>
  <li><b>Testability</b>, As a function, same input will produces the same output.</li>
  <li><b>Interface</b>, Functional component can use destruct props to make input interface clear.</li>
  <li><b>Strategically</b>, React was originally created using functional language <a href="https://en.wikipedia.org/wiki/Standard_ML">SML</a>. Here is the <a href="https://reasonml.github.io/docs/en/what-and-why">Reason</a> why its creator wants to strategically move back to its root.
</ol>
</p>

<h2>4.0 Use a state management library</h2>
<p>
The standard way to update React view is to leverage <a href="https://facebook.github.io/flux/docs/in-depth-overview">Flux architecture</a> for uni-directional data flow to update its UI. Redux is one of the most popular Flux implementation, making your application easier to reason about.
</p>
<p>
Without state management library, as the application grow, it can become difficult to manage states with components and coordinating between parent and children components.
</p>
<p>
In this project, I grouped the store data as modules and within it, define React components that renders its data.
</p>

<h2>5.0 Test (Unit), Test (Integration), and Test (End2End)</h2>
<p>
Whether you are writing Test First, Test Last, or Test In-Between, if you want to be productive, you need plenty of <b>Unit Tests</b> on export functions, <b>Integration Tests</b> on modules, and <b>End-2-End test</b> at the application level.
</p>
<p>
Many people are not convince about productivity of unit tests. Many are happy to promote <a href="https://en.wikipedia.org/wiki/Test-driven_development">Test Driven Development</a> and only have End2End testing the whole system or large part of the system to demonstrate their understanding. Although End2End test to specify a feature before any code is written can ensure <b>building the right application</b>, testing only at the highest level does not enforce <b>building the application right</b>.
</p>
<p>
The original <a href="https://martinfowler.com/bliki/TestPyramid.html">Test Pyramid</a> define layers such as <b>UI, Service, and Unit</b>. The modern takes on <a href="https://dzone.com/articles/the-battle-of-the-testing-triangle">Test Triangle</a> do not mix application architecture with test artifacts as each layers, whether it is UI or backend services, should follow the same rigorous engineering practice. I have shown just at the UI layer, we can group units of code into module and glue modules together to form an application. If we apply the modern takes of testing triangle, we can write feature tests at End2End level, drilling down into more focus tests at module level, and complete test on all edge cases at the unit level.
</p>
<p>
Writing unit tests and integration tests are time-consuming and accumulate with 3x as much code covering all edge cases. The efforts can pay off only if the application is adaptable to change when it is made up of small fully tested components that are <a href="https://en.wikipedia.org/wiki/Loose_coupling">loosely coupled</a>, modules that are <a href="https://en.wikipedia.org/wiki/Cohesion_(computer_science)">highly cohesive</a>, and the application that is <a href="https://www.tutorialspoint.com/software_testing_dictionary/correctness.htm">functionally correct</a>.
</p>
<p>
In the javascript world, there are many test libraries and frameworks. I tend to use the same set of tool to perform different level of tests and not resort to specific tool for a given layer. This ensures all tests are written consistently, just the level of granularity differs. For this project, I used <a href="https://jestjs.io/" alt="redux">Jest</a> and <a href="https://airbnb.io/enzyme/" alt="enzyme">enzyme</a> to create:

<ol>
  <li><b>Unit Tests,</b> All the tests that end with <b>.test.</b></li>
  <li><b>Integration Test,</b> All the test that end with <b>.integration.test.</b></li>
  <li><b>End2End</b>, All tests that verify the whole application is in <b>App-end2end.test</b>.</li>
</ol>
</p>
