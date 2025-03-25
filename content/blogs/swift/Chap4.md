+++
title = 'Final in swift for Begineers'
date = 2024-05-16
draft = false
author = "Anilkumar Kotur"
weight = 4
tags = ["Swift", "Coding", "Beginners","Xcode"]
+++



![](https://cdn-images-1.medium.com/max/1600/1*tg5BW1BMxD8uoGWT20ywiw.png)

### According to Apple document

> You can prevent a method, property, or subscript from being overridden by marking it as final. Do this by writing the final modifier before the method, property, or subscript’s introducer keyword (such as final var, final func, final class func, and final subscript).

> Any attempt to override a final method, property, or subscript in a subclass is reported as a compile-time error. Methods, properties, or subscripts that you add to a class in an extension can also be marked as final within the extension’s definition.You can mark an entire class as final by writing the final modifier before the class keyword in its class definition (final class). Any attempt to subclass a final class is reported as a compile-time error.

---

### When to use final?

1.  To prevent the class in your Framework that can be abused or misused when subclassed.
2.  Can mark methods, properties, and even subscripts of non-final classes.
3.  To tell Swift compiler that, method should be called directly (static dispatch) rather than looking up a function from a method table (dynamic dispatch). This reduces function call overhead and gives you extra performance

**Example:**

```html
open class Book {
} // Anyone can see, anything can subclass 
public class Open {
} // Anyone can see, internal can subclass
internal class Internal {
} // Internal can see, internal can subclasspublic.
final class Final {
} // Anyone can see, nothing can subclass

> In your project/module:

class SubOpen: Open {
} // OK
class SubNormal: Normal {
} // OK
class SubInternal: Internal {
} // OK
class SubFinal: Final {
} // Error: Can’t subclass
```

> In some other project/module:

```html
class SubOpen: Open {
} // OK
class SubNormal: Normal {
} // Error: Can’t subclass
class SubInternal: Internal {
} // Error: \`Internal\` type not found
class SubFinal: Final {
} // Error: Can’t subclass
```

Thank you for reading 👏🏻. do like and share to make this reach more engineers.