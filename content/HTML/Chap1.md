+++
title = 'Understanding HTML: Structural Tags — Beginners'
date = 2024-04-15
draft = false
author = "Ashwini Shalke"
weight = 1
tags = ["HTML", "Beginners", "code", "Tags"]
+++



![](https://cdn-images-1.medium.com/max/1600/1*cgj7j0bkyCplP9hpFG43Wg.png)

HTML, or HyperText Markup Language, is the backbone of web development. It is the standard markup language for creating web pages and applications. In this article, we’ll delve into the fundamentals of HTML, including its introduction and basic tags, to help you kickstart your journey into web development.

### Introduction to HTML:

HTML is a markup language used to structure content on the web. It provides a set of elements or tags that define the structure of a web page. Each HTML tag serves a specific purpose, such as defining headings, paragraphs, images, links, and more.

At its core, HTML consists of a series of elements, enclosed within angle brackets (< >), which are interpreted by web browsers to render content on a webpage. These elements can be nested within each other to create complex layouts and structures.

### Structural HTML Tags:

Structural HTML tags are essential for organizing and formatting content on a webpage. They provide a hierarchical structure that helps browsers understand the relationship between different parts of the content.

Let’s explore some of the most commonly used structural HTML tags along with examples:

1.  **`<!DOCTYPE html>`:** This declaration specifies the HTML version being used, which is HTML5 in most modern web pages.
2.  **`<html>`:** The `<html>` element serves as the root element of an HTML document, encapsulating the entire content of the page.
3.  **`<head>`:** Inside the `<head>` element, you include meta-information about the document, such as the title, character set, CSS stylesheets, and JavaScript scripts.
4.  **`<title>`:** The `<title>` element defines the title of the webpage, which appears in the browser’s title bar or tab.
5.  **`<body>`:** The `<body>` element contains the main content of the webpage, including text, images, links, and other elements visible to users
6.  **`<header>`:** The `<header>` element typically contains introductory content or navigational links at the top of the webpage.
7.  **`<nav>`:** Inside the `<nav>` element, you include navigation links or menus for navigating the website.
8.  **`<main>`:** The `<main>` element represents the main content of the webpage, excluding header, footer, and navigational elements.
9.  **`<section>`:** The `<section>` element defines sections within a webpage, typically containing related content grouped together.
10.  **`<article>`:** The `<article>` element represents self-contained content that can be independently distributed or reused, such as blog posts, news articles, or forum posts.
11.  **`<aside>`:** The `<aside>` element contains content related to the main content but not necessarily crucial to the understanding of the page, such as sidebars, advertisements, or supplementary information
12.  **`<footer>`:** The `<footer>` element contains footer information or copyright notices at the bottom of the webpage.

### Example:

```html

<!DOCTYPE html>
<html>
<head>
    <title>Sample Web Page</title>
</head>
<body>
    <header>
        <h1>Welcome to Our Website</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="about">
            <h2>About Us</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquet ac urna non ultricies.</p>
        </section>

        <article>
            <h2>Blog Post Title</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquet ac urna non ultricies.</p>
        </article>
    </main>

    <footer>
        <p>&copy; 2024 Sample Website. All rights reserved.</p>
    </footer>
</body>
</html>
```

The **`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>`** elements help maintain a clear hierarchy and improve accessibility and SEO.


![](https://cdn-images-1.medium.com/max/2400/1*a2pyQsWxHes7XoGKU-LQzQ.png)


> HTML is the foundation of web development, and understanding its basic tags is essential for building web pages. With this knowledge, you can start creating your own web content and exploring more advanced HTML features to enhance your websites.