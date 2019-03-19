This project is inspired by the reactive manifesto 
https://www.reactivemanifesto.org/

A number of popular data streaming API was used to demonstrate the ability to structure a program that consists of small unit of testable and readable code, with clear design abstraction and coding style.

Note, although I have implemented consistent wrapper to these streaming API, the aim is more of 'Hello World' to showcase how to build a flexible solution that can plug in different technologies to process custom entities and data transformation. 

(RxJava) http://reactivex.io 
(Reactor) https://projectreactor.io
(Akka) https://doc.akka.io/docs/akka/2.5.4/scala/stream/index.html
(Java 8 Stream) https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html
(Distruptor) https://www.lmax.com/disruptor
(SpringBatch) https://spring.io/projects/spring-batch

The objective of this program is to develop a solution that allow streaming of data from any source to any destination, allowing the flexibility to plug in any data filtering and transformation pipeline.

1) Process log messages in JSON and persist to DB (JPA,Hibernate) using each of the different streaming API.

2) Processing User records to demonstrate the flexibility of the design to plug in another entity, streaming api, and different transformation strategies, support processing of string, byte array, and JSON from Rest API.

From the above requirements, the source code should demonstrate:

1) Design Patterns (Adapter, Strategy, Observable, template methods) to deliver a flexible implementation.
2) Message processing with Producer->Consumer to embrace 'Reactive Stream' processing.
3) Concurrency Programming using Single Writer principle to embrace 'Mechanical Sympathy'.
4) Low level coding demonstrate custom implemention of Ring Buffer and low level byte array processing.
5) Test automation embracing testing triangle strategy of unit, integration, and end-2-end tests.
6) Technique to handle concurrency testings and scale end-2-end test to perform load tests.

Key design to look out for:
1) Different technologies are abstracted consistently to provide similar API processing pipleline
- producer->batch->filter->transform->consumer->publisher->repository
2) Open/Closed principle to add new stream, new entity, and new transformation pipeline
3) All the tests under stream package can switch to load tests by changing test.properties
4) Custom SplitIterator to leverage Java8 parallel stream
