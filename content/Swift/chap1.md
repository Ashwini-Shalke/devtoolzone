+++
title = 'Wireless Debugging on Xcode 9'
date = 2024-05-16
draft = false
author = "Anil Kotur"
weight = 1
tags = ["Swift", "Coding", "Beginners","Xcode"]
+++

![](https://cdn-images-1.medium.com/max/2600/1*1Os0QxwoxLRZv6Easi2MOg.jpeg)


Apple announced wireless debugging feature on Xcode 9 at WWDC 17.

#### Apple say Cut the Cord

> _Choose any of your iOS or tvOS devices on the local network to install, run, and debug your apps — without a USB cord plugged into your Mac. Simply click the ‘Connect via Network’ checkbox the first time you use a new iOS device, and that device will be available over the network from that point forward. Wireless development also works in other apps, including Instruments, Accessibility Inspector, Quicktime Player, and Console._

### **Steps to Cut the Cord**

> Make sure you have at least **Xcode 9 or later** and a device with **iOS 11 or later**

1.  Open your project on Xcode
2.  Plug in your iPhone with USB cable (Just for the first time)
3.  Open Window > Devices and Simulators (cmd + shift + 2)

You should see your device as connected devices

4\. Select your device from left and Check the “Connect via network” box

![](https://cdn-images-1.medium.com/max/1600/1*QXxdbshQ4v2dkRSIdMJF3g.png)

5\. Now if Xcode can connect to your device via network, you should see a network icon after your phone name

![](https://cdn-images-1.medium.com/max/1600/1*oKSV1hTjKqCzM1fQ1w7J9A.png)

6\. Unplug your USB cord

7\. Go back to Xcode and Hit the Run button.

### 👏 Congratulations on your first wireless debugging.