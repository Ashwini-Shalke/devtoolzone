+++
title = 'Views in SQL'
date = 2024-04-15
draft = false
author = "Ashwini Shalke"
weight = 17
+++


![](https://cdn-images-1.medium.com/max/2400/1*OE_zkDzyO_E0penaJO3esw.png)

Imagine you have a favourite playlist on your music app. Instead of going through all your songs every time you want to listen to your favorite tracks, you create a playlist that contains only the songs you love.

A view in a database is like that playlist — it’s a saved query that contains only the data you’re interested in, making it easier and faster to access.

**Suppose**
we have a database with a table called “Students” that contains information about students, including their names and ages. Now, let’s say we want to create a view that shows only the names of students who are teenagers (aged 13 to 19).


```html
CREATE VIEW TeenageStudents 
AS SELECT Name FROM Students WHERE Age >= 13 ANDAge <= 19;
```

**In this example,** we’re creating a view called “TeenageStudents” that selects the names of students from the “Students” table where their age is between 13 and 19. It’s like creating a playlist of your favorite songs, but in this case, it’s a list of teenage students.


Now, whenever we want to see the names of teenage students, we can simply query the view:

```html
SELECT \* FROM TeenageStudents;
```

This query will return only the names of teenage students, making it easier for us to see who falls into that category without having to sift through the entire **“Students”** table.


> In simple terms, a view in a database is like a saved query that shows you only the data you’re interested in, similar to a playlist that contains only your favorite songs. It helps make accessing and analyzing data more convenient and efficient.