+++
title = 'Basic SQL Queries — SELECT, WHERE,UPDATE and DELETE'
date = 2024-04-08
draft = false
author = "Ashwini Shalke"
weight = 3
+++

Think of SQL queries as requests you make to find specific snacks in your snack box. Just like asking your friend to find your favorite candy in the snack box, SQL queries help you find specific information from a database.

![](https://miro.medium.com/v2/resize:fit:1252/1*fyjzim8_G6znKgroCzTD0A.jpeg)

**Example:**

Let’s say you have a table that lists all your favorite snacks and their quantities in your snack box, like this:

![](https://miro.medium.com/v2/resize:fit:1400/1*h8shvj86PCwP01jVQ_jS_w.png)

Now, using SQL queries, you can ask questions to find out specific information from this table.

**1\. SELECT Query:**

The SELECT query is like asking your friend to show you all the snacks in the snack box.

```html

SELECT \* FROM Snacks;

```

This query tells SQL to show you all the snacks and their quantities from the table.

**2\. WHERE Clause:**

The WHERE clause is like telling your friend to find a specific snack for you in the snack box.

```html

SELECT \* FROM Snacks WHERE Snack = 'Chips';

```

This query tells SQL to show you the quantity of chips in the snack box.

**3\. INSERT Query:**

The INSERT query is like adding a new snack to your snack box.

```html

INSERT INTO Snacks (Snack, Quantity) VALUES ('Chocolate', 4);

```

This query tells SQL to add a new snack called “Chocolate” with a quantity of 4 to the snack box.

**4\. UPDATE Query:**

The UPDATE query is like telling your friend to change the quantity of a snack in the snack box.

```html

UPDATE Snacks SET Quantity = 6 WHERE Snack = 'Chips';

```

This query tells SQL to update the quantity of chips to 6 in the snack box.

**5\. DELETE Query:**

The DELETE query is like telling your friend to remove a snack from the snack box

```html

DELETE FROM Snacks WHERE Snack = 'Cookies';

```

This query tells SQL to remove the cookies from the snack box.


> _So, basic SQL queries are like asking your friend to find, add, change, or remove snacks from your snack box, but instead, you’re asking the SQL database to find, add, change, or remove information from your database._