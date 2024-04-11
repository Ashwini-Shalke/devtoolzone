+++
title = 'User-Defined Function (UDF) in SQL'
date = 2024-04-11
draft = false
author = "Ashwini Shalke"
weight = 8
+++



Let’s say, you have a special calculator that can perform a specific calculation, like doubling a number or calculating the average of a set of numbers. You can use this calculator whenever you need to perform that calculation, without having to write out the steps each time. In SQL, a user-defined function is like that special calculator — it’s a custom function that you can create to perform a specific task or calculation.

![](https://cdn-images-1.medium.com/max/1600/1*T-FFvIjPfDPFjyl9IJ0aJw.jpeg)


**Example:**

Now , Let’s say you want to create a user-defined function in SQL that calculates the total score of a student based on their individual test scores.

**Here’s how you can define the UDF:**

```html

CREATE FUNCTION CalculateTotalScore (@Test1 INT, @Test2 INT, @Test3 INT) 
RETURNS INT AS
BEGIN 
  DECLARE @TotalScore INT; 
  SET @TotalScore = @Test1 + @Test2 + @Test3; 
RETURN @TotalScore; 
END;

```

**Explanation:**

*   `CREATE FUNCTION`: This SQL statement is used to create a new user-defined function.
*   `CalculateTotalScore`: This is the name of the user-defined function.
*   `@Test1 INT, @Test2 INT, @Test3 INT`: These are the input parameters of the function, representing the scores of three tests.
*   `RETURNS INT`: This specifies the data type (INT) that the function will return.
*   `AS`: This keyword indicates the beginning of the function's body.
*   `DECLARE @TotalScore INT;`: This line declares a variable `@TotalScore` of type INT to store the total score.
*   `SET @TotalScore = @Test1 + @Test2 + @Test3;`: This line calculates the total score by adding the scores of the three tests.
*   `RETURN @TotalScore;`: This line returns the calculated total score.


Once you’ve created the user-defined function, you can use it in SQL queries just like any built-in function. 

**For example:**

```html

SELECT Name, Test1, Test2, Test3, dbo.CalculateTotalScore(Test1, Test2, Test3)
 AS TotalScore FROM Students;

```

This query selects the names and individual test scores of students from a table called `Students`, and calculates the total score using the `CalculateTotalScore` function.

In simple terms, a user-defined function in SQL is like a custom tool that performs a specific task or calculation for you. You can create these functions to simplify your SQL queries and make them more reusable and easier to manage.
