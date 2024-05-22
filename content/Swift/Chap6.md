+++
title = 'How to update the view height with animation programmatically'
date = 2024-05-16
draft = false
author = "Anilkumar Kotur"
weight = 6
tags = ["Swift", "Coding", "Beginners","Xcode"]
+++

Common problems of writing `NSLayoutConstraint`

![](https://cdn-images-1.medium.com/max/1600/1*bYTK8iOt_b4OQ-3LldUOnQ.png)

Hello swift programmers, in this article we will look at how to use `NSLayoutConstraint` to elegantly handle the resize of view using some animation. let’s take an example

![](https://cdn-images-1.medium.com/max/1600/1*qH1hQg-Cyx2FB0KW85TEgg.gif)

In apple notes app if you notice as soon as the keyboard comes up the text fields height changes with sweet animation. which look good to eyes and gives thoughts to the brain how to they do it?

This very common problem with a simple solution. the solution can be used to any UI element like a UIButton, UIImageView, UILable so on and so forth.

#### **Overview:**

*   We will learn how to construct\`NSLayoutConstraint\`
*   How to update the NSLayoutConstraint
*   How to use simple animation

**Note**

To change the hight of view we need to update the constant value of the constraint. if you add a new constraint it creates the conflict in auto layout and you can see those error in the console like this

```html
(
"<NSLayoutConstraint:0x600002586030 UITextView:0x7ff602006600.height == 520   (active)>",
"<NSLayoutConstraint:0x6000025fcc80 UITextView:0x7ff602006600.height == 20   (active)>"
)
```

---

**Step 1: Add UITextfiled with following constraints**

*   Top, left and right constraints as shown below with your preferred constant value. I am giving it as 16.


```html
NSLayoutConstraint.activate(\[
textViewToUse.topAnchor.constraint(equalTo: view.topAnchor, constant: 0),
textViewToUse.leftAnchor.constraint(equalTo: view.leftAnchor, constant: 16),
textViewToUse.rightAnchor.constraint(equalTo: view.rightAnchor, constant: -16),
\])
```

---

#### Step 2: Create height constraint separately and make it accessible within the class.

private var heightConstraint: NSLayoutConstraint?

Also creating default height values

```html
lazy var textFieldFullHeight:CGFloat = {
   self.view.frame.size.height - 100
}()
var textFieldHalfHeight:CGFloat = 200
```

---
#### Step 3: Add initial value to \`heightConstraint\`

```html
heightConstraint = NSLayoutConstraint(item: textViewToUse,
                                 attribute: .height,
                                 relatedBy: .equal,
                                    toItem: nil,
                                 attribute: .notAnAttribute,
                                multiplier: 1,
                                  constant: textFieldFullHeight)
```                              

> Note: you can assign the vlaue at the declaration of \`heightConstraint\` to avoid option value.

---

**Step 4: Add height Constraint to Textfield**

```html
textViewToUse.addConstraint(heightConstraint!)
```

#### Step 5: Listen to keyboard notification

As we are animating the \`UITextfield\` height based on keyboard appearance status

```html
//Adding this in viewDidLoad
NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow(notification:)), name: UIResponder.keyboardWillShowNotification, object: nil)
NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillHide(notification:)), name: UIResponder.keyboardWillHideNotification, object: nil)
//Adding this outside viewDidLoad
@objc func keyboardWillShow(notification: NSNotification){
}
@objc func keyboardWillHide(notification: NSNotification){
}
```

> Note: Don’t forget to remove the keyboard notification observer in \`viewWillDisappear\`

```html
override func viewWillDisappear(\_ animated: Bool) {
NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillShowNotification, object: nil)
NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillHideNotification, object: nil)
}
```

---

#### Step 6: Change the height on keyboard notification

*   While keyboard showing

```html
@objc func keyboardWillShow(notification: NSNotification){
guard let userInfo = notification.userInfo else { return }
guard let keyboardSize = userInfo\[UIResponder.keyboardFrameBeginUserInfoKey\] as? NSValue else { return }
let keybardFrame = keyboardSize.cgRectValue
textFieldHalfHeight = self.view.frame.size.height - keybardFrame.height - 30
UIView.animate(withDuration: 0.2,
delay: 0.2,
options: UIView.AnimationOptions.curveEaseIn,
animations: {
self.heightConstraint?.constant = self.textFieldHalfHeight
self.view.layoutIfNeeded()
},completion: nil)
}
```

*   On keyboard hide

```html
@objc func keyboardWillHide(notification: NSNotification){
UIView.animate(withDuration: 0.2, delay: 0.2, options: UIView.AnimationOptions.curveEaseIn, animations: {
self.heightConstraint?.constant = self.textFieldFullHeight
self.view.layoutIfNeeded()
}, completion: nil)
}
```

There you go. you have animated the height change of UITextfield based on the keyboard status.

Download sample code from [https://github.com/Anilkumarkotur/App-note-screen-demo](https://github.com/Anilkumarkotur/App-note-screen-demo)

### Thanks for reading 😊. For more good reads visit [www.swiftnil.com](http://www.swiftnil.com/)