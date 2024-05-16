+++
title = 'Generate timebase UUID in swift'
date = 2024-05-16
draft = false
author = "Anil Kotur"
weight = 2
tags = ["Swift", "Coding", "Beginners","Xcode"]
+++

  


Everything you need to know about UUID

![](https://cdn-images-1.medium.com/max/1600/1*gGgdeiSnJ-auNuxb7eoaWw.png)

### **First of all what is UUID?**

In software development as soon as we encounter assigning/fetching piece of data uniquely first thing that pops up in mind is UUID(**universally unique identifier**). so this is how wikipedia defines it.

> A universally unique identifier (UUID) is an identifier standard used in software construction. A UUID is simply a 128-bit value. The meaning of each bit is defined by any of several variants.

**Still not clear?**

A UUID is a 16-octet (128-bit) number in with digit having hyphens in the form of, 8–4–4–4–12, which can be both unique and random 😎

ex: b99d95a0–20c5–11ea-a092–59756dff43fc

---

**Types of UUID**

1.  Version 1 (date-time and MAC address)
2.  Version 2 (date-time and MAC address, DCE security version)
3.  Versions 3 and 5 (namespace name-based)
4.  Version 4 (random)

  

For this article will only discuss about Version 1 and 4

Ok, let see what is the difference between these two

*   Version 1: This generates a unique ID based on a network card MAC address and a timer. These IDs are easy to predict (given one, I might be able to guess another one) and can be traced back to your network card. It’s not recommended to create these.
*   Version 4: These are generated from random (or pseudo-random) numbers. If you just need to generate a UUID, this is probably what you want.

---

### **So let create UUID in swift**

1.  **UUID Version 4**

By default in Swift/iOS UUID’s is version version 4, here is the apple documentation

A universally unique value that can be used to identify types, interfaces, and other items.
Initializes a new UUID with RFC 4122 version 4 random bytes.

so to create UUID version 4

let uuidToUse = UUID() 

2\. UUID Version 1

Creating the version 1 type UUID is not straight forward, but version 1 are very helpful in sorting because they are time based. so the we can make C call to generate the version 1

```html
func generateVersionOneAkaTimeBasedUUID() -> String? {
// figure out the sizes
let uuidSize = MemoryLayout<uuid\_t>.size
let uuidStringSize = MemoryLayout<uuid\_string\_t>.size
// get some ram
let uuidPointer = UnsafeMutablePointer<UInt8>.allocate(capacity: uuidSize)
let uuidStringPointer = UnsafeMutablePointer<Int8>.allocate(capacity: uuidStringSize)
// do the work in C
uuid\_generate\_time(uuidPointer)
uuid\_unparse(uuidPointer, uuidStringPointer)
// make a Swift string while we still have the C stuff
let uuidString = NSString(utf8String: uuidStringPointer) as String?
// avoid leaks
uuidPointer.deallocate()
uuidStringPointer.deallocate()
assert(uuidString != nil, "uuid (V1 style) failed")
return uuidString
}
```

Thank you for Reading the article ☺️

**Reference**

1.  Stackoverflow- [https://stackoverflow.com/questions/41232049/uuid-in-swift3-but-version-1-style-uuid](https://stackoverflow.com/questions/41232049/uuid-in-swift3-but-version-1-style-uuid)
2.  More about UUID- [https://www.sohamkamani.com/blog/2016/10/05/uuid1-vs-uuid4/](https://www.sohamkamani.com/blog/2016/10/05/uuid1-vs-uuid4/)