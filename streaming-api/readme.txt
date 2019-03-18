This project is inspired by the reactive manifesto 
https://www.reactivemanifesto.org/

A number of popular data streaming API was used to demonstrate the ability to structure a program that consists of small unit of testable and readable code, with clear design abstraction and coding style.

Note, this is NOT a wrapper to these streaming API, more like 'Hello World' to allow someone to experiment with a given Streaming technology and with 'out of the box' solution, one can clone this repo and start streaming experiment.

(RxJava) http://reactivex.io 
(LMAX Distruptor) https://www.lmax.com/disruptor
(AKKA) https://doc.akka.io/docs/akka/2.5.4/scala/stream/index.html
(SpringBatch) https://spring.io/projects/spring-batch
(Java 8 Stream) https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html

The objective of this program is to develop a solution that allow streaming of data from any source to any destination, allowing the flexibility to plug in any data filtering and transformation pipeline. This project demonstrate:

1) Processing log messages and persist to DB using each of the different streaming API, persist to HSQL DB using JPA via Hibernate comes with Springboot.
- A generic JSON reader to parse a file with log events stored in JSON format
- The logic is to only store event after we have determine its duration (after received both start/end events).- We flag any events that exceed a certain threshold

2) Processing User records to demonstrate the flexibility of the design to allow us to plug in another entity, streaming api, and different transformation strategies.
- Stream CSV file using string reader and string transformation to User using RxJava
- Stream CSV file using byte array reader and byte array transformation to User using Java stream
- Stream JSON from (https://jsonplaceholder.typicode.com/users) and remove id during transformation to User using LMAX Distruptor stream

From the above requirements, the source code should demonstrate:

1) Consistent use of Design Patterns to provide various design abstractions
2) Message processing is based on Producer->Consumer pattern align to the Reactive Manifesto
3) Concurrency Programming using Single Writer principle to reduce locking contention 
4) Low latency code on implementing Ring Buffer, and bytes array processing on csv data
5) Test automation, adhere to testing triangle, unit, integration, and end-2-end
6) Technique to handle concurrency testings
7) Technique to provide mechnanism for load test

Key design to look out for:
1) All the different technologies are abstracted consistently to provide similar API processing pipleline
- producer->batch->filter->transform->consumer->publisher->repository
2) A clear pattern following open/closed principle to add new streaming technology, new entity type, and new data transformation requirements
3) DataRecordIteratorTest demonstrate reliable concurrency tests
4) All the tests under stream package can switch to load tests by changing test.properties
5) Enable parallel processing of file by fixed batch chunk in Java 8 stream by extending splitIterator
