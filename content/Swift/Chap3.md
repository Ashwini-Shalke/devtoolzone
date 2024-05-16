+++
title = 'Access specifier in Swift'
date = 2024-05-16
draft = false
author = "Anil Kotur"
weight = 3
tags = ["Swift", "Coding", "Beginners","Xcode"]
+++



#### Control your code’s accessibility

![](https://cdn-images-1.medium.com/max/1600/1*IOd-VBlPMSnyHuq-k48KrA.png)

#### What is Access specifier?

Access specifier is keyword which helps in _Access control of_ code block. _Access control_ restricts access to the parts of your code from code in other source files and modules.

> Encapsulation is one pillar of Object Oriented Programming and access specifiers helps in encapsulating.

---

**What is Encapsulation?**

Encapsulation is defined as the wrapping up of data under a single unit. It is the mechanism that binds together code and the data it manipulates.Other way to think about encapsulation is, it is a protective shield that prevents the data from being accessed by the code outside this shield.

---
### Types of Access levels in swift

#### 1\. Open & Public :

Enable an entity to be used outside the defining module (target/framework). You typically use `open` or `public`access when specifying the public interface to a framework.

However, `**open**` **access applies only to classes and class members**, and it differs from `public`access as follows:

*   `open` classes and class members can be subclassed and overridden both within and outside the defining module (target/framework).
*   `public` classes and class members can only be subclassed and overridden within the defining module (target/framework).

> Like open access level, public access level enable an entity to be used outside the defining module (target). But open access level allows us to subclass it from another module where in public access level, we can only subclass or overridde it from within the module it is defined.

//First.framework – A.swift
open class A {}
//First.framework – B.swift
public class B: A {} // ok
//Second.framework – C.swift
import First
internal class C: A {} // ok
//Second.framework – D.swift
import First
internal class D: B {} // error: B cannot be subclassed

[**Anil Sk**](http://buymeacoffee.com/anilsk)

[_engineer blogger and a curious cat_buymeacoffee.com](http://buymeacoffee.com/anilsk)

---

#### 2\. Private:

Restricts the use of an entity to its enclosing declaration. You typically use `private` access to hide the implementation details of a specific piece of functionality when those details are used only within a single declaration.

// First.framework – A.swift
internal struct A {
  private static let x: Int
  internal static func doSomethingWithX() {
    x // ok
  }
}
A.x // error: x is unavailable

---
#### 3\. FilePrivate:

Restricts the use of an entity to its defining source file. You typically use `fileprivate` access to hide the implementation details of a specific piece of functionality when those details are used within an entire file.

// First.framework – A.swift
internal struct A {
  fileprivate static let x: Int
}
A.x // ok
// First.framework – B.swift
A.x // error: x is not available

---

#### 4\. Internal:

Enables an entity to be used within the defining module (target). You typically use `internal` access when defining an app’s or a framework’s internal structure.

// First.framework – A.swift
internal struct A {
  fileprivate static let x: Int
}
// First.framework – A.swift
internal struct A {}
// First.framework – B.swift
A() // ok

// Second.framework – C.swift
import First
A() // error: A is unavailable

**Note:** Default access specifier in swift is **Internal,** Then how about **final** let’s read this [article](https://medium.com/@anilkotur/final-in-swift-625b534b2412).

Thank you for reading 👏🏻. do like and share to make this reach more engineers.