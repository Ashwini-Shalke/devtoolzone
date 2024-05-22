+++
title = 'Control Transfer Statements in swift- `continue, break, fallthrough in swift'
date = 2024-05-22
draft = false
author = "Anilkumar Kotur"
weight = 9
tags = ["Swift", "Coding", "Beginners","Xcode"]
+++




![](https://cdn-images-1.medium.com/max/1600/1*aIq8XC4Su_DubJUA8b-npg.jpeg)

In this article, we will look at the `continue, break, fallthrough` keywords in swift

> **Continue:** A continue statement ends program execution of the current iteration of a loop statement and move to next iteration.

Ex: Increment the values of odd number in the array

func increment(array: \[Int\]) -> \[Int\] {
    var output: \[Int\] = \[\]
   
    for number in array {
    ///Check if value is even
        if number % 2 == 0 { 
        ///number append to output array and move to next iteration      
           output.append(number)
           continue
        }
       ///This statement is skipped for even number 
       output.append(number + 1)
    }
    return output
}

![](https://cdn-images-1.medium.com/max/1600/1*3rz0jUFaSbyAdraGPMDNUg.png)swiftnil.com: Continue statement

\--------------------------
Input: increment(array: \[1,2,3,4,5,6,7,8\])
Output: \[2, 2, 4, 4, 6, 6, 8, 8\]
--------------------------

---

> **Break:** The Break statement exit the execution of an entire control flow immediately.

Ex: Increment the values the array until value is \`n\`

func increment(array: \[Int\], until: Int) -> \[Int\] {
   var output: \[Int\] = \[\]
    
   for number in array {
      if number == until {
         break
      }
      output.append(number + 1)
   }
   return output
}

![](https://cdn-images-1.medium.com/max/1600/1*5Zjo4fnFRRDy7mvhQmCYGQ.png)swiftnil.com: Break statement

\--------------------------
Input: increment(array: \[1,2,3,4,5,6,7,8\], until: 5)
Output: \[2, 3, 4, 5\]
--------------------------

---

> **Fallthrough:** In Swift, switch statements exist the execution as soon as case is matched so, fallthrough is used to continue to next case even after the case is matched

var index = 10

switch index {
   case 100 :
      print( "Value of index is 100")
      fallthrough
   case 10,15 :
      print( "Value of index is either 10 or 15")
      fallthrough
   case 5 :
      print( "Value of index is 5")
   default :
      print( "default case")
}

![](https://cdn-images-1.medium.com/max/1600/1*LCfO4t4uNXz73p8w017hhQ.png)swiftnil.com: Fallthrough statement

---
#### **Reference**

[https://docs.swift.org/swift-book/LanguageGuide/ControlFlow.html](https://docs.swift.org/swift-book/LanguageGuide/ControlFlow.html)

