+++
title = 'Class vs structure in Swift'
date = 2024-05-22
draft = false
author = "Anilkumar Kotur"
weight = 10
tags = ["Swift", "Coding", "Beginners","Xcode"]
+++



![](https://cdn-images-1.medium.com/max/1600/1*kpF4-dWmpx0Ug7c3Dt2_gw.jpeg)

In this article, we will learn about classes and Structs, the Difference between classes and structs and common features.

### **Class**

Classes are reference types. It means that if you assign an instance of the class to a variable, it will hold only **the reference** to the instance and **not the copy.**

class Person {
    var name: String
    init(name: String) {
        self.name = name
    }
}

var ceo = SomeClass(name: "steve")
var newCeo = ceo 
//ceo and newCeo now reference the same instance!
newCeo.name = "Tim"

println(ceo.name) // "Tim"
println(newCeo.name) // "Tim"

---

### **Struct**

Structs are value types. It means that if you copy the instance of the structure to another variable, it's just copied to the variable.

struct Person {
    var name: String
    init(name: String) {
        self.name = name
    }
}

var ceo = Person(name: "Steve")
var newCeo = ceo 
//ceo and newCeo are two structs with the same value!
newCeo.name = "Tim"

println(ceo.name) // "Steve"
println(newCeo.name) // "Tim"


---
### Common features between classes and structs

*   Define properties to store values
*   Define methods to provide functionality
*   Can be extended using the extensions (very powerful)
*   Can conform to protocols (protocol orientation)
*   Define initializers
*   Define Subscripts to provide access to their variables
*   They can work with generics to provide flexible and reusable types

---

### Difference between classes and structs

*   A class supports Type casting but struct doesn't.
*   A class can have deinitializer as its a reference type but a struct doesn’t as it is a value type.
*   A class supports Inheritance but a struct doesn’t.
*   A class allows reference counting for multiple references but a struct doesn’t.
*   Struct properties are stored on Stack and Class instances are stored on Heap memory
*   Struct is thread safe or singleton at any point in time.

---

### FAQ

**Q1.** Can structs have retain cycle? 

**ans: No,** [more info](https://stackoverflow.com/questions/38457064/swift-structs-reference-count)

**Q2.** Can structs be weak? 

**ans:** **No,** As structs are value type they can’t be weak, strong or unowned

---

### Related Links

*   [https://docs.swift.org/swift-book/LanguageGuide/ClassesAndStructures.html](https://docs.swift.org/swift-book/LanguageGuide/ClassesAndStructures.html)
*   [https://learnappmaking.com/struct-vs-class-swift-how-to/](https://learnappmaking.com/struct-vs-class-swift-how-to/)
*   [https://stackoverflow.com/questions/24217586/structure-vs-class-in-swift-language/24217633](https://stackoverflow.com/questions/24217586/structure-vs-class-in-swift-language/24217633)
