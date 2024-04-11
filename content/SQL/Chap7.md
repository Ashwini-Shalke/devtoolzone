+++
title = 'Aggregate Functions in SQL'
date = 2024-04-08
draft = false
author = "Ashwini Shalke"
weight = 7
+++


Imagine you’re at a party with a bunch of friends, and there’s a big bowl of candies on the table. Now, you want to know some information about those candies, like how many candies are there in total, what’s the average number of candies each person has, or which friend has the most candies.

In SQL, aggregate functions are like magical candy counters that help you answer these questions by performing calculations on groups of data.

Example: Let’s say you have a table called “Candies” that lists the number of candies each person has:

![](https://cdn-images-1.medium.com/max/1600/1*f3ia0fh0UHQRtBObfB2Khw.png)Candies

## Aggregate Function Examples:

### COUNT():

Count the total number of candies.
```html
SELECT COUNT(Candies) AS TotalCandies FROM Candies;
```

This query will count the total number of candies from all friends combined.

### SUM():

Find the total number of candies.

```html 
SELECT SUM(Candies) AS TotalCandies FROM Candies;
```

This query will add up all the candies from all friends to give you the total number of candies.

### AVG():

Calculate the average number of candies per person.

```html 
SELECT AVG(Candies) AS AverageCandies FROM Candies;
```


This query will calculate the average number of candies by dividing the total number of candies by the number of friends.

### MAX():

Find out who has the most candies.

```html 
SELECT Person, MAX(Candies) AS MaxCandies FROM Candies;
```


This query will tell you which friend has the highest number of candies.

### MIN():

Find out who has the fewest candies.

```html 
SELECT Person, MIN(Candies) AS MinCandies FROM Candies;
```

This query will tell you which friend has the lowest number of candies.


> _So, in simple terms, aggregate functions in SQL are like magical tools that help you perform calculations on groups of data. Just like counting candies at a party, you can use these functions to count, sum, average, find the maximum, or minimum values in a dataset._ 