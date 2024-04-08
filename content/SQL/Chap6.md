+++
title = 'SQL Clause: Group By, Having, IN and NOT IN'
date = 2024-04-08T12:28:23+05:30
draft = false
+++



Let’s say we have a table named “Games” with the following data:

![](https://cdn-images-1.medium.com/max/1600/1*ipZ2swWlZ1ef1SWIkiC7xA.png)

### GROUP BY:

Think of `GROUP BY` like organizing your games into groups based on their ratings. It's like sorting them into piles of similar ratings.

```html
SELECT Rating, COUNT(\*) AS NumOfGames FROM Games GROUP BY Rating;
```

This query will count the number of games for each rating group. For example, it will show how many games have a rating of 4.5, how many have a rating of 4.0, and so on.


### HAVING:

Now, imagine you want to filter out groups with fewer than 2 games. `HAVING` helps you do this. It's like saying, "Show me only the rating groups that have at least 2 games."

```html
SELECT Rating, COUNT(\*) AS NumOfGames FROM Games GROUP BY Rating HAVING COUNT(\*) >= 2;
```

This query will only show the rating groups that have at least 2 games. So, if there’s a rating with only one game, it won’t be shown.

_These clauses are commonly used in combination with aggregate functions to perform operations on groups of data within a database table._

### IN:

`IN` is like picking out specific games from your collection. It's like saying, "Show me games with ratings of 4.5 or 4.7."

```html
SELECT Game, Rating FROM Games WHERE Rating IN (4.5, 4.7);
```

This query will show you games that have a rating of either 4.5 or 4.7.

### NOT IN:

On the other hand, `NOT IN` is like saying, "Show me games that don't have a rating of 4.5 or 4.7."

```html
SELECT Game, Rating FROM Games WHERE Rating NOT IN (4.5, 4.7);
```

This query will show you games that have a rating other than 4.5 or 4.7.

`_IN_` _and_ `_NOT IN_` _are operators used in SQL to filter data based on a specified set of values. They are used in the_ `_WHERE_`_clause of SQL queries to match values in a column against a list of predefined values._

**So, in simple terms,**

* `GROUP BY` helps organize your data into groups.

* `HAVING` filters those groups based on condition.

* `IN` helps you select specific values, and `NOT IN` helps you exclude specific values from your selection.

They're like different tools you use to organize, filter, and select games from your collection based on their ratings.

