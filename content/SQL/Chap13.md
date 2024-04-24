+++
title = 'For Beginners to Understand Constraints in Database'
date = 2024-04-13
draft = false
author = "Ashwini Shalke"
weight = 13
tags = ["SQL", "Database", "Beginners","Keys"]
+++


![](https://cdn-images-1.medium.com/max/1600/1*q1j8SNFUfTTDL_STiPZT4g.jpeg)

Think of constraints in a database as rules that ensure data behaves properly, just like rules in a game. For instance, if you’re playing basketball, you can’t use your hands to touch the ball unless you’re dribbling or shooting. Similarly, constraints in a database ensure that data follows certain rules, like not allowing duplicate values in a column or making sure each student has a unique student ID.

Let’s say we have a table called “Students” with columns for StudentID, Name, and Age. We want to enforce some rules on this table using constraints:

1.  **Primary Key :** This ensures that each student has a unique ID.

```html

CREATE TABLE Students ( 
StudentID INT PRIMARY KEY, Name VARCHAR(50), Age INT );

```

_In this example, the PRIMARY KEY constraint on the StudentID column ensures that each student has a unique ID. Just like in a game, where each player has a unique jersey number._

---

**2\. Unique Key :** This ensures that no two students have the same name.

```html

CREATE TABLE Students ( 
StudentID INT PRIMARY KEY, Name VARCHAR(50) UNIQUE, Age INT );

```

_In this example, the UNIQUE constraint on the Name column ensures that no two students can have the same name. It’s like making sure there are no two players on a team with the same name._

---
**3\. Check :** This ensures that the age of each student is within a certain range, like between 10 and 18.

```html

CREATE TABLE Students ( 
StudentID INT PRIMARY KEY, Name VARCHAR(50), 
Age INT CHECK (Age >= 10 AND Age <= 18) );

```

_In this example, the CHECK constraint on the Age column ensures that the age of each student is between 10 and 18. It’s similar to making sure that all players on a basketball team are within a certain age range._

---
**4\. NOT NULL :** The NOT NULL constraint ensures that a column cannot contain NULL values, meaning it must always have a value.


```html

CREATE TABLE Students ( 
StudentID INT PRIMARY KEY, Name VARCHAR(50) NOT NULL, Age INTNOT NULL );

```
_In this example, both the Name and Age columns cannot contain NULL values. It’s like making sure that each player in a game has a jersey number and a position._

---

**5\. DEFAULT :** The DEFAULT constraint specifies a default value for a column when no value is explicitly provided during an INSERT operation.

```html

CREATE TABLE Students ( 
StudentID INT PRIMARY KEY, Name VARCHAR(50), Age INT DEFAULT 18);

```

_In this example, if no age is provided for a student during insertion, the default value of 18 will be used. It’s similar to having a default setting in a game if a player doesn’t choose one._

---

**6\. INDEX :** The INDEX constraint is used to create an index on one or more columns of a table. An index improves the speed of data retrieval operations, such as SELECT queries, by providing faster access to the rows in the table.

```html

CREATE INDEX idx\_name ON Students (Name);

```

_In this example, an index named “idx\_name” is created on the Name column of the Students table. It’s like creating an index in a book to quickly find a specific topic._


> Constraints help maintain data integrity and ensure that the database behaves as expected, just like rules in a game help maintain fairness and order.