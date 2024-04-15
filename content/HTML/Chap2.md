+++
title = 'HTML : Formatting Text — Beginners'
date = 2024-04-15
draft = false
author = "Ashwini Shalke"
weight = 2
+++


![](https://cdn-images-1.medium.com/max/1600/1*dksQ7QVjDNbw476pgh3JwA.png)

HTML, the cornerstone of web development, not only structures content but also allows for the formatting of text. In this article, we’ll explore various HTML tags used for text formatting along with practical examples to demonstrate their usage.

### 1\. Bold Text:

The `<strong>` tag is used to represent text with strong importance, typically rendered as bold by browsers.

```html
<p>This is <strong>bold</strong> text.</p>
```

![](https://cdn-images-1.medium.com/max/1600/1*bgynh6hpXqlWBKBeoU6n2Q.png)

---

### 2\. Italic Text:

The `<em>` tag is used to emphasize text, typically rendered as italic by browsers.

```html
<p>This is <em>italic</em> text.</p>
```

![](https://cdn-images-1.medium.com/max/1600/1*D9Ss83Cw7ELBYwXhQdCS2A.png)

---

### 3\. Underlined Text:

While HTML does not have a native tag for underlining text, it’s commonly achieved using CSS. However, the `<u>` tag can be used for semantic underlining, though it's deprecated in HTML5.

```html
<p>This is <u>underlined</u> text.</p>
```

![](https://cdn-images-1.medium.com/max/1600/1*73SHPQsfW67n1sJBf57gWQ.png)

---

### 4\. Strikethrough Text:

The `<s>` tag is used to represent text that is no longer accurate or relevant, typically rendered with a strikethrough effect by browsers.

```html
<p>This is <s>strikethrough</s> text.</p>
```

![](https://cdn-images-1.medium.com/max/1600/1*5OL1wZAxGmJ2m--O0VJRdw.png)

---

### 5\. Subscript and Superscript Text:

The `<sub>` tag is used to render text as subscript, while the `<sup>` tag is used for superscript.

```html
<p>This is H<sub>2</sub>O (water).</p> <p>This is 10<sup>th</sup> Street.</p>
```

![](https://cdn-images-1.medium.com/max/1600/1*kMI5aORyi19VJfTDh0eK-w.png)

---

### 6\. Code Text:

The `<code>` tag is used to represent computer code within text.

```html
<p>To install a package, use <code>npm install package-name</code>.</p>
```

![](https://cdn-images-1.medium.com/max/1600/1*4i0ngm5zyCs0kEsSLIKMyg.png)

---

### 7\. Blockquote:

The `<blockquote>` tag is used to designate quoted content, typically rendered with indentation

```html
<blockquote> <p>This is a quoted text.</p> </blockquote>
<p>this is normal text</p>
```

![](https://cdn-images-1.medium.com/max/1600/1*hlwNDtVpGXBsAk64utvz_w.png)

---

### 8\. Line Break:

The `<br>` tag is used to insert a line break within text content.

```html
<p>This is the first line.<br>This is the second line.</p>
```

![](https://cdn-images-1.medium.com/max/1600/1*7ScdCwtI-nihmgMX6EMHtQ.png)

---

### 9\. Horizontal Rule:

The `<hr>` tag is used to insert a thematic break or horizontal rule between paragraphs.

```html
<p>This is the first paragraph.</p> <hr> <p>This is the second paragraph.</p>
```

![](https://cdn-images-1.medium.com/max/1600/1*k4TS0ebD-rWUA5WTOuRagw.png)

---

### 10\. Preformatted Text:

The `<pre>` tag is used to render text exactly as it appears in the HTML code, preserving whitespace and line breaks.

```html
<pre> This text retains whitespace </pre>
```

![](https://cdn-images-1.medium.com/max/1600/1*CAlwQHrziV44WxqGbnZqkA.png)

---

### 11\. `<ul>, <ol>, and <li>`:

These tags create unordered and ordered lists with list items.

```html
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>

<ol>
    <li>First</li>
    <li>Second</li>
</ol>
```

![](https://cdn-images-1.medium.com/max/1600/1*VeNWKKa4p6V6S26Q7kLIwA.png)


By utilizing these HTML tags for text formatting, you can enhance the visual appeal and readability of your web content. Whether you need to emphasize certain words, quote external sources, or display code snippets, HTML provides a versatile set of tools to meet your formatting needs.