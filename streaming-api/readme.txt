This source code is inspired by the reactive manifesto
https://www.reactivemanifesto.org/

This is an introduction to a number of different technologies I have used:

(RxJava) http://reactivex.io 
(LMAX Distruptor) https://www.lmax.com/disruptor
(AKKA) https://doc.akka.io/docs/akka/2.5.4/scala/stream/index.html
(SpringBatch) https://spring.io/projects/spring-batch
(Java 8 Stream) https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html

Although the technolgies used is introductory, it is just a mean to create a demo to showcase how
to build small, testable, and readable code, providing clear abstraction. 
 
1) Consistent use of Design Patterns to provide generic abstraction
2) Message processing is based on Producer->Consumer patterns
3) Concurrency Programming using Single Writer principle to provide better parallelisim
4) Low latency coding on implementing Ring Buffer, Reading bytes array from file and processing for csv data
5) Automated testing align to testing triangle, unit, integration, end-2-end
6) Include technique to handle concurrency testings
7) load testing via configuration to add more load


