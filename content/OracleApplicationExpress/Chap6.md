+++
title = 'Progressive Web App in Oracle APEX'
date = 2024-04-26
draft = false
author = "Ashwini Shalke"
weight = 6
tags = ["Oracle", "APEX", "Beginners","Low-Code"]
+++



![](https://cdn-images-1.medium.com/max/1600/1*qex2M-1aaA735XdRh8847Q.jpeg)

Progressive Web Applications leverage modern web APIs giving users an experience that looks and feels like a native application. Your APEX applications can easily be defined as a PWA or Progressive Web Application to take advantage of advanced caching and improved performance. These applications can also be installed on your smartphone of choice with device-specific installation instructions.

### Install Progressive Web App:

*   The “Install Progressive Web App” feature in Oracle APEX allows developers to leverage the capabilities of PWAs within their applications.
*   When users access an APEX application that has PWA functionality enabled, they are presented with the option to “install” the application on their device.
*   You can create a Progressive Web Application when creating a new application with the Create Application Wizard, or by editing attributes of an existing APEX application.

![](https://cdn-images-1.medium.com/max/1600/1*rhdXU1RnJw6K6rV5W8fZ9A.png)

### Requirements for a Progressive Web Application:

The APEX application must be served over a secure HTTPS environment or local host. If you are using an unsecured environment, PWA features will not be rendered. The application Definition, Properties, Friendly URLs attributes must be set to On.

![](https://cdn-images-1.medium.com/max/1600/1*Z6kxf9LhDK-eAeWTjlIrYQ.png)

### What happens with enabling PWA functionality in your APEX application?

It adds the ability to install the application as a Progressive Web App. **It adds a new navigation bar entry named Install App to your application**. It optimizes page loading speed on the mobile device. It improves page load rendering time with a new browser cache architecture for static files.

Enabling PWA functionality enables users to install the application on their devices. It provides a customizable offline page when users are offline and cannot request the network.

> In summary, the “Install Progressive Web App” feature in Oracle APEX allows developers to create PWAs that offer native-like experiences to users accessing their applications. By adhering to PWA requirements and enabling PWA functionality in APEX applications, developers can deliver faster, more reliable, and engaging web experiences across various devices and platforms.