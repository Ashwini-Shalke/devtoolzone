+++
title = 'Basic SQL Queries — SELECT, WHERE,UPDATE and DELETE'
date = 2024-04-08
draft = false
author = "Ashwini Shalke"
weight = 3
tags = ["SQL", "Database", "Beginners","Data"]
+++

  

Imagine this: You have a gigantic snack box filled with all kinds of snacks — chips, cookies, chocolates, and more. But finding exactly what you want is tough, especially with so many options mixed up together! SQL (Structured Query Language) is like a personal assistant for organizing and finding things in your snack box. Just like you would ask your friend to grab a specific snack for you, you can ask SQL to find, add, change, or remove data in a database.

![](https://cdn-images-1.medium.com/max/1600/1*vNplI8uTYKWAVEIJUb7GYA.png)

In the world of databases, SQL is essential. Databases are structured collections of data — kind of like super-organized snack boxes. SQL helps manage that data by allowing you to ask questions, or _queries_, to quickly retrieve or manipulate information.

**Types of SQL Queries We’ll Explore**:

1.  **SELECT** — Helps you find specific information.
2.  **WHERE** — Allows you to set conditions.
3.  **INSERT** — Adds new data.
4.  **UPDATE** — Changes existing data.
5.  **DELETE** — Removes data.

Now, let’s break down each command using the snack box analogy to make things fun and easy to understand.

---

### SELECT Query: Picking Your Favorite Snacks

The `SELECT` query is the most basic and commonly used SQL command. Think of it as a way to see all the snacks in your box.

Let’s say you have a table named `Snacks` listing all your favorite treats, their types, and how many you have. To see everything, you can use the `SELECT` command like this:

```html
SELECT * FROM Snacks;
```

In plain language, this command tells SQL, “Show me everything in my snack box.” The `*` symbol means _everything_, so the output will include all snacks and their quantities.

Imagine your friend lays out each snack in front of you, along with the details about it. This is a lot easier than looking through the box yourself!

#### Example Table: Snacks

![](https://cdn-images-1.medium.com/max/1600/1*MQ73_FvMTbez1SiA3pLliw.png)

When you run `SELECT * FROM Snacks;`, SQL returns a table like this one, showing you everything in the box.

#### Real-Life Application:

Imagine your school has a database of all students and you need to list everyone in your grade. Using `SELECT * FROM Students;` would show you a complete list.

![](https://cdn-images-1.medium.com/max/1600/1*Rj-wJIoYTzyVWtZsthBGYA.png)

 SQL can display a list just like you’d see laid out on a table.

---

### WHERE Clause: Finding Specific Snacks

The `WHERE` clause is like giving SQL a bit more guidance about what you’re looking for. For example, maybe you’re craving something salty — you can use `WHERE` to filter out the snacks by type.

```html
SELECT * FROM Snacks WHERE Type = 'Salty';
```

This command tells SQL, “Show me only the salty snacks.” Now SQL goes through the snack box and finds just the salty treats for you.

#### Example Table: Salty Snacks Only

![](https://cdn-images-1.medium.com/max/1600/1*idUkY05OiD_LF5HvYmvnKw.png)

With `WHERE`, you can be as specific as you like. Maybe you want the salty snacks that are also fewer than 5 in quantity. Here’s how you’d write that:

```html
SELECT * FROM Snacks WHERE Type = 'Salty' AND Quantity < 5;
```

#### Fun Twist:

Imagine you’re looking for only chocolate-flavored snacks with more than 8 pieces. You’d use `WHERE` to filter by `Snack = 'Chocolate' AND Quantity > 8`.

---

### INSERT Query: Adding New Snacks

The `INSERT` command is like adding something new to your snack box. If you went shopping and picked up some gummy bears, you’d use `INSERT` to add them to your list.

```html
INSERT INTO Snacks (Snack, Quantity, Type) VALUES 
('Gummy Bears', 7, 'Sweet');
```

This command tells SQL to add “Gummy Bears” with a quantity of 7 to the snack list.

#### Example Table: After INSERT

![](https://cdn-images-1.medium.com/max/1600/1*X74Ul1oHsEeXOtmvVA4yHQ.png)

Now, when you check the list again, you see Gummy Bears added to the snack lineup!

#### Real-Life Application:

Think of a school library adding a new book to its database. They’d use a command similar to `INSERT` to add the new title, author, and other details.

![](https://cdn-images-1.medium.com/max/1600/1*Zt2WTCS8tcpKvGOxnkyd2A.png)

---

### UPDATE Query: Changing Snack Quantities

The `UPDATE` command is for when you need to change something about an item already in the box. Maybe you ate a few chips, so you need to adjust the quantity.

```html
UPDATE Snacks SET Quantity = 2 WHERE Snack = 'Chips';
```

This tells SQL, “Change the quantity of chips to 2.” With `UPDATE`, you can modify any information, whether it’s the type, name, or quantity.

#### Example Table: After UPDATE

![](https://cdn-images-1.medium.com/max/1600/1*zP6hi56u3tO6wJcLh-FrOA.png)

Now the chips show up with a quantity of 2 instead of 3.

#### Real-Life Application:

A shop might use `UPDATE` to change the prices of items in their inventory database. If the price of a candy bar goes up, they use `UPDATE` to reflect the new cost.

####   

---

### DELETE Query: Removing Snacks from the Box

The `DELETE` command is like asking your friend to throw out something you don’t want anymore. Maybe you’re over cookies and want to clear them from the snack box.

```html
DELETE FROM Snacks WHERE Snack = 'Cookies';
```

This tells SQL, “Remove cookies from the list.” The snack box is now one item lighter.

#### Example Table: After DELETE

![](https://cdn-images-1.medium.com/max/1600/1*9xHOMJ078HMQgRpaxpxuTg.png)

SQL removes the row for cookies, making more room in the snack box for new treats!

#### Real-Life Application:

A school might use `DELETE` to remove students who have graduated from the enrollment database. SQL makes it easy to update records with each new year.

  

### Conclusion: SQL and Your Snack Box

SQL is like having a super-organized friend who helps you manage all your snacks with just a few simple commands. Whether you want to find, add, change, or remove items, SQL has you covered. In the world of databases, these commands let you keep track of large amounts of data, just like you manage your snack box.


