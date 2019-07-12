This project is the Web frontend of a skeleton trading application I am intending to develop to serve as a blueprint on how to apply modern technologies to implement a working cloud-native application that adheres to the principles of <a href="https://12factor.net/">12 Factor App</a> and <a href="https://www.reactivemanifesto.org/">Reactive Manifesto</a>.

A <a href="http://tradedemo-ng.appspot.com" alt="tradedemo-ng">live demo</a> is available which is deployed to the Google Cloud Platform.

This frontend is written using the following main technologies:
<ul>
  <li><a href="https://reactjs.org" alt="reactjs">ReactJs for view layer of the UI</a></li>
  <li><a href="https://redux.js.org" alt="redux">Redux for frontend state management</a></li>
  <li><a href="https://redux-observable.js.org/" alt="redux">Redux Observable (Redux + RxJS) for rest API calls</a></li>
  <li><a href="https://jestjs.io/" alt="redux">Javascript Testing Framework</a></li>
  <li><a href="https://airbnb.io/enzyme/" alt="redux">Javascript Testing Utilities</a></li>
</ul>

Note, I have been a Java backend developer in the last decade and only reacquaint my Javascript skills since April 2019. This project is a learning exercise to familiar myself with ReactJS and its technology ecosystem.

As a software engineer and not a UI designer, I am done with the GUI and its functionalities. I am happy enough to share my code as is. During the course of building this frontend, I have to gathered the following modern JS and React 'Best Practices', filtering out many different opinions and make conclusion using my own intuitions how best to structure, write, and test software that can grow from skeleton to large scale application.

Here are my views on modern Javascript and React Best Practices:

<h2>1.0 Structure your project by feature</h2>
React doesn’t have opinions as it is a view library, not a framework which offer opinionated architecture style.
However, common consensus is to <a href="https://reactjs.org/docs/faq-structure.html">structure your project by feature</a> but even that has different takes on where the redux code should reside.

In my code, I have setup three top level folder structures:

<ol>
  <li>libs, this is where the share code (utils and components resides)</li>
  <li>modules, this is where I bundled state with the corresponding feature UI elements</li>
  <li>pages, this is where I define the structure of a pages and routes</li>
</ol>

<h2>2.0 Favour functional style of programming</h2>

<h2>3.0 Use state management</h2>

<h2>4.0 Test, Test, and Test</h2>
