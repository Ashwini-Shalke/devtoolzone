+++
title = 'Swift Dispatch 101: Understanding Static, Dynamic, and V Tables!'
date = 2024-05-22
draft = false
author = "Anilkumar Kotur"
weight = 12
tags = ["Swift", "Coding", "Beginners","Xcode"]
+++



![](https://cdn-images-1.medium.com/max/1600/1*KTHOxAx9lGeatAK62ZARwA@2x.jpeg)

#### Static Dispatch:

Static dispatch refers to the process of determining which function or method to call at compile-time, based on the declared type of the variable or object. In simpler terms, it’s like deciding what action to take when you know exactly what type of thing you’re dealing with.

For example, if you have a Swift function that adds two numbers:

```html
func add(\_ a: Int, \_ b: Int) -> Int {
  return a + b
}
```

And you call it like this:

let result = add(5, 3)

In this case, the Swift compiler knows at compile-time exactly which \`add\` function to call because the types of \`a\` and \`b\` are known (both are \`Int\`). This is static dispatch in action.

---

#### Dynamic Dispatch:

Dynamic dispatch, on the other hand, happens at runtime. It’s like deciding what action to take when you’re dealing with an object whose specific type isn’t known until the program is actually running. This is common when working with classes and inheritance.

For example, if you have a hierarchy of classes:

```html
class Animal {
  func speak() {
    print("Animal makes a sound")
  }  
}

class Dog: Animal {
  override func speak() {
    print("Dog barks")
  }
}

class Cat: Animal {
  override func speak() {
    print("Cat meows")
  }
}
```

And you create instances of these classes:

```html
let someAnimal: Animal = Dog()
let anotherAnimal: Animal = Cat()
```

Now, if you call \`speak()\` on these instances:

```html
someAnimal.speak() // Output: “Dog barks”
anotherAnimal.speak() // Output: "Cat meows"
```

Even though the variables are of type \`Animal\`, the specific method that gets called is determined at runtime based on the actual type of the object. This is dynamic dispatch.

---

#### V Table (Virtual Table)

A v table is a behind-the-scenes mechanism that Swift (and many other object-oriented languages) uses to implement dynamic dispatch. It’s like a table of function pointers associated with a class or object. Each entry in the table points to the correct implementation of a method for a particular class.

In the example above, when you called \`someAnimal.speak()\` with a \`Dog\` object, the v table for \`Dog\` was consulted to find the \`speak\` method that should be executed.

> _In summary, static dispatch happens at compile-time when the compiler knows the types involved, while dynamic dispatch occurs at runtime when the specific types aren’t known until the program runs. The v table is a crucial part of making dynamic dispatch work efficiently. Understanding these concepts will help you write more flexible and polymorphic Swift code in your iOS projects._