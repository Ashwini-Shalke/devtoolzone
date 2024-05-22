+++
title = 'Demystifying Bitcode: Understanding What, Why, and How for iOS Engineers'
date = 2024-05-22
draft = false
author = "Anilkumar Kotur"
weight = 11
tags = ["Swift", "Coding", "Beginners","Xcode"]
+++



![](https://cdn-images-1.medium.com/max/1600/1*YYvWNQOTssCTJQQYNwe-uQ@2x.jpeg)

### **Introduction**

In the world of making iOS apps, there are lots of new things to learn. One of these things is Bitcode. If you’ve ever sent your app to the App Store, you might have heard about it. But what exactly is Bitcode, and why should iOS engineers care about it? In this blog post, we will break down what Bitcode is, its benefits, and how it fits into the way we make apps

#### What is Bitcode?

Bitcode is like a intermediate step when we’re making our app. Instead of sending the complete app (compiled binary) to the App Store, we send Bitcode. Apple server then take this Bitcode and make the final app (binary) that people download on their phones. This way, the app is made just right for each type of phone.

![](https://cdn-images-1.medium.com/max/1600/1*cfspXXZfG1Aa_Lah9dOAdA@2x.jpeg)

![](https://cdn-images-1.medium.com/max/1600/1*CNDYrA2CHaCw1ZqJVlY2yw@2x.jpeg)

---

#### Why Should You Care?

*   **Optimization for Various Architectures:** One of the primary benefits of Bitcode is that it allows Apple to optimize your app for different device architectures without requiring you to submit multiple versions of your app. This includes optimizations for different CPU architectures, device capabilities, and future hardware changes.
*   **App Thinning:** Bitcode plays a crucial role in app thinning. App thinning ensures that users only download the necessary resources for their specific device, reducing the app’s download size. Bitcode enables the App Store to generate and deliver a customized binary to each user, containing only the code that’s relevant to their device.
*   **Keeps Apps Safe and Ready for the Future**: Bitcode helps improve the security of your app by allowing Apple to apply security patches or optimizations without you having to rebuild and resubmit the entire app. It also ensures that your app remains compatible with future iOS releases and changes in device architectures.

---

**How Does Bitcode Fit into the Development Workflow?**

*   **Compilation and Upload:** When you build your app in Xcode, an additional step is taken if you choose to include Bitcode. Xcode generates the Bitcode representation alongside the usual compiled binary. When you submit your app to the App Store, you upload the Bitcode instead of the final binary.
*   **Server-side Compilation:** Upon submission, Apple’s servers compile the Bitcode into the final binary. This compilation is tailored to the specific device architecture of the user downloading the app.
*   **Symbolication**: If you encounter crashes and need to analyze crash reports from your users, symbolication is a critical step. Symbolication maps memory addresses in crash reports to human-readable function names and file paths in your source code. Bitcode symbolication is slightly different due to the intermediate representation, but Apple handles this process transparently.

---

### The Xcode 14 Unintended Effect

However, even as Bitcode offers numerous advantages, there are instances where changes in development tools can inadvertently impact app size optimization. A prime example is the release of Xcode 14, which introduced unexpected size increases in several iOS apps. These apps experienced significant growth in size due to Xcode 14's default disabling of bitcode.

**Xcode 14 deprecates bitcode** – https://developer.apple.com/documentation/xcode-release-notes/xcode-14-release-notes#Deprecations

**The Underlying Mechanism**

Bitcode optimization involves stripping binary symbols, which are non-essential metadata for production. However, with Xcode 14's default bitcode disabling, apps that relied on this process to reduce their size were affected. Binary symbols that were once stripped out in production were now included, leading to a bloated app size.

#### Mitigating the Impact

1.  Xcode Build Settings: By configuring specific build settings in Xcode, developers can reintroduce the binary symbol stripping process during the Archive build action. This requires careful configuration to ensure consistency across all targets.
2.  Shell Scripting: Another approach is to implement a shell script that strips binary symbols manually at the end of the build process, just before signing. This method provides more control but demands precise timing.

Script from emerge tool – https://docs.emergetools.com/docs/strip-binary-symbols

---

#### Conclusion

Bitcode remains a powerful tool for iOS engineers to optimize app size, improve performance, and ensure compatibility across different device architectures. While it’s an essential aspect of the iOS development workflow, changes in development tools like Xcode 14 can lead to unintended consequences, as observed with the increase in app size due to disabled bitcode Understanding the intricacies of Bitcode, its advantages, and potential pitfalls empowers iOS engineers to make informed decisions about optimizing their apps for the best user experience.

---

**References**

[**Strip Binary Symbols (iOS)**](https://docs.emergetools.com/docs/strip-binary-symbols)

[_How to strip symbols from swift binaries and avoid unnecessary app size bloat (must read before switching to Xcode 14)._docs.emergetools.com](https://docs.emergetools.com/docs/strip-binary-symbols)

[**App size increased(almost doubled) with Xcode 14 and Bitcode Disabled**](https://stackoverflow.com/questions/74130168/app-size-increasedalmost-doubled-with-xcode-14-and-bitcode-disabled/74142041#74142041)

[_Apple has deprecated the usage of Bitcode and is longer accepting any submissions with Bitcode enabled apps starting…_stackoverflow.com](https://stackoverflow.com/questions/74130168/app-size-increasedalmost-doubled-with-xcode-14-and-bitcode-disabled/74142041#74142041)

