This project is the Web frontend of a skeleton trading application I am intending to develop to serve as a blueprint on how to apply modern technologies to implement a working cloud-native application that adheres to the principles of <a href="https://12factor.net/">12 Factor App</a> and <a href="https://www.reactivemanifesto.org/">Reactive Manifesto</a>.

A <a href="http://tradedemo-ng.appspot.com" alt="tradedemo-ng">live demo</a> is available which is deployed to the Google Cloud Platform.

This frontend is written using the following main technologies:
<ul>
  <li><a href="https://reactjs.org" alt="reactjs">ReactJs</a>, view layer of the UI</li>
  <li><a href="https://redux.js.org" alt="redux">Redux</a>, frontend state management</li>
  <li><a href="https://redux-observable.js.org/" alt="redux">Redux Observable</a>, (Redux + RxJS) for async rest API calls</li>
  <li><a href="https://jestjs.io/" alt="redux">Jest</a>, Javascript Testing Framework</li>
  <li><a href="https://airbnb.io/enzyme/" alt="enzyme">enzyme</a>, Javascript Testing Utilities</li>
</ul>

Note, I have been a Java backend developer in the last decade and only reacquaint my Javascript skills since April 2019. This project is a learning exercise to familiar myself with ReactJS and its technology ecosystem.

As a software engineer and not a UI designer, I am done with the GUI and its functionalities. I am happy enough to share my code as is. During the course of building this frontend, I have to gathered the following modern JS and React 'Best Practices', filtering out many different opinions and make conclusions using my own intuition how best to structure and write testable software that can grow from skeleton to large scale application.

Here are my views on modern Javascript and React Best Practices:

<h2>1.0 Structure your project by feature</h2>
<p>
React doesn’t have opinions as it is a view library, not a framework which offer opinionated architecture style.
However, community consensus is to <a href="https://reactjs.org/docs/faq-structure.html">structure your project by feature</a>. However, even that has different takes on where the redux code should reside, does it belongs in its own folder or with its feature?
<p>

<p>
In my code, I have setup three top level folder structure:

<ol>
  <li><b>libs</b>, this is where the share code (utils and components resides)</li>
  <li><b>modules</b>, this is where I bundled state with the corresponding feature UI elements</li>
  <li><b>pages</b>, this is where I define the structure of a pages and routes</li>
</ol>
</p>

In this project structure, the application can grow organically with more pages, plugging in modules, with share code push to the libs folder. Each module is a subsystem with store defining reducer, epics, and actions. This allow each module to be build and tested separately. The structure of pages are to glue these modules together to form an application.

<h2>2.0 Prefer React Functional Components over Class based component </h2>
<p>
You can create React component using pure function or using class syntax. Some people follows the convention of using class to create <a href="https://medium.com/@learnreact/container-components-c0e67432e005">container component</a> and pure function only for presentation component. However, with <a href="https://reactjs.org/docs/hooks-effect.html">React hook</a> in conjunction with <a href="https://redux.js.org" alt="redux">Redux</a> as state management, you can create container component as pure function.
</p>
<p>Here are some of the reasons why pure functional components are better:
<ol>
  <li><b>Less boiler plate code,</b> Function component take inputs and produce an output</li>
  <li><b>Testability</b>, A component is a function, hence testing with same input will produces the same output, so shallow snapshot testing is very useful</li>
  <li><b>Interface</b>, functional component interface should destruct the props, making inputs clear</li>
</ol>
</p>
<p>
In this project, only Ticket is a class component to maintain internal state as I found using pure function with hook is doable but not so clean for this component, so I refactored it to class.
</p>

<h2>3.0 Use a state management library</h2>
<p>
The standard way to update React view is to leverage <a href="https://facebook.github.io/flux/docs/in-depth-overview">Flux architecture</a> for uni-directional data flow to update the view. Redux is one most popular state management library that adhere to the Flux architecture, making your application easier to reason about.
</p>
<p>
Without state management library, as the application grow, it will become very difficult to manage states within each individual components and co-ordinating between parent and children components.
</p>
<p>
In this project, I grouped the store data as modules and within it, define the React components that renders its data.
</p>

<h2>4.0 Test, Test, and Test</h2>
<p>
Where you are writing Test First, Test Last, or Test In-Between, if you want to be productive, you need Unit Test, Integration Test, and End-2-End test coverage.
</p>
<p>
In the javascript world, there are many options and I tend to use the same set of tool to perform different level of tests and not resort to specific tool at a given layer. In this project, I used <a href="https://jestjs.io/" alt="redux">Jest</a> and <a href="https://airbnb.io/enzyme/" alt="enzyme">enzyme</a> and created:

<ol>
  <li><b>Unit Tests,</b> All the tests that end with .test</li>
  <li><b>Integration Test,</b>, All the test that end with .integration.test</li>
  <li><b>End2End</b>, App-end2end.test, which test when the application is fully wired up</li>
</ol>
</p>
