+++
title = 'Beginners Guide — Inner,Outer,left and right JOINS in SQL'
date = 2024-04-13
draft = false
author = "Ashwini Shalke"
weight = 14
tags = ["SQL", "Database", "Beginners","Joins"]
+++



### What are Joins?

Imagine you have two lists of friends — one list with their names and another list with their hobbies. Now, you want to find out which friend has which hobby. This is where joins come in handy!

In databases, tables are like lists, and joins help us combine information from different tables based on a common piece of information, like a friend’s name or an ID.

![](https://cdn-images-1.medium.com/max/1600/1*idKF1paMcs8YuAJKlNMjLA.jpeg)

Let’s consider two tables: `friends` and `hobbies`.
#### friends
![](https://cdn-images-1.medium.com/max/2400/1*gihTTDef5i_xD2wj3jhb7w.png)

#### hobbies
![](https://cdn-images-1.medium.com/max/2400/1*oMbzlAs10el6uX6mKA5_yA.png)



### Types of Joins:

**Inner Join:** This type of join combines rows from two tables based on a matching condition. Only the rows where the condition is true in both tables are included in the result.

```html

SELECT friends.name, hobbies.hobby
FROM friends
INNER JOIN hobbies ON friends.id = hobbies.id;

```

**Result**
![](https://cdn-images-1.medium.com/max/1600/1*vAXbUGmYrirxJeaG-YGLhw.png)

---

**Left Join:** This type of join returns all rows from the left table and matching rows from the right table. If there’s no match in the right table, it returns NULL values.

```html

SELECT friends.name, hobbies.hobby
FROM friends
LEFT JOIN hobbies ON friends.id = hobbies.id;

```

**Result:**
![](https://cdn-images-1.medium.com/max/1600/1*cFpZYYIu7CNC9zCSbWgfHA.png)


---
**Right Join:** This is similar to a left join, but it returns all rows from the right table and matching rows from the left table. If there’s no match in the left table, it returns NULL values.

```html

SELECT friends.name, hobbies.hobby
FROM friends
RIGHT JOIN hobbies ON friends.id = hobbies.id;

```


**Expected Result:**
![](https://cdn-images-1.medium.com/max/1600/1*K4Pz3wUGGZ1FKiMiAYIz4w.png)


---
**Full Outer Join:** This type of join returns all rows when there’s a match in either the left or right table. If there’s no match, it returns NULL values for the missing side.

```html

SELECT friends.name, hobbies.hobby
FROM friends
FULL OUTER JOIN hobbies ON friends.id = hobbies.id;

```

**Expected Result:**
![](https://cdn-images-1.medium.com/max/1600/1*cmHJAfPtaUXh86c1Wiq0ng.png)

These results show how different types of joins combine data from two tables based on a common identifier (in this case, the ID column). The output includes all or selected rows from both tables, depending on the type of join used.

> So, joins help us combine information from different tables, allowing us to see relationships between data in a database._