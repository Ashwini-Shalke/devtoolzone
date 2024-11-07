+++
title = 'User-Defined Function (UDF) in SQL'
date = 2024-04-11
draft = false
author = "Ashwini Shalke"
weight = 8
tags = ["SQL", "Database", "Beginners","Data"]
+++



![](https://cdn-images-1.medium.com/max/1600/1*f_xb9ikTC4RgBUn8MMMd9g.png)

Imagine you run a smoothie shop, and each customer can customize their smoothie with different add-ons, like protein powder, extra fruit, and chia seeds. You want a quick way to calculate the total sale price of each smoothie based on its base price and the cost of each add-on. Instead of calculating the total price manually every time, we’ll create a **user-defined function** to do it for us!

 --- 

### Example: Defining the Function

Let’s say you have a `SmoothieSales` table, and you want to calculate each smoothie’s total price by adding the base price and each add-on.

Here’s how we can define a SQL function to calculate this total price:

```html
CREATE FUNCTION CalculateTotalPrice (@BasePrice DECIMAL(5,2), @AddOn1 DECIMAL(5,2), @AddOn2 DECIMAL(5,2)) 
RETURNS DECIMAL(5,2) AS
BEGIN 
  DECLARE @TotalPrice DECIMAL(5,2); 
  SET @TotalPrice = @BasePrice + @AddOn1 + @AddOn2; 
  RETURN @TotalPrice; 
END;
```

### Explanation

Let’s go over each part of the function:

*   `**CREATE FUNCTION**`: This SQL statement is used to create a new user-defined function.
*   `**CalculateTotalPrice**`: This is the name of our custom function.
*   `**@BasePrice DECIMAL(5,2), @AddOn1 DECIMAL(5,2), @AddOn2 DECIMAL(5,2)**`: These are input parameters for the function, representing the base price and two add-on prices. The **DECIMAL(5,2)** data type specifies that these values are decimal numbers with two decimal places.
*   `**RETURNS DECIMAL(5,2)**`: This indicates that the function will return a decimal value with two decimal places.
*   `**AS**`: This signals the start of the function’s body.
*   `**DECLARE @TotalPrice DECIMAL(5,2);**`: Here, we declare a variable called `@TotalPrice` to store the calculated total price.
*   `**SET @TotalPrice = @BasePrice + @AddOn1 + @AddOn2;**`: This line calculates the total price by adding up the base price and the add-on prices.
*   `**RETURN @TotalPrice;**`: This returns the calculated total price.

  
---
### Using the Function in a Query

Once you’ve created this user-defined function, you can use it to quickly calculate the total price for each smoothie in your `SmoothieSales` table.

```html
SELECT CustomerName, BasePrice, AddOn1, AddOn2,
       dbo.CalculateTotalPrice(BasePrice, AddOn1, AddOn2) AS TotalPrice
FROM SmoothieSales;
```

In this query:

*   We select the customer’s name, base price, and add-on prices.
*   We use the `CalculateTotalPrice` function to calculate the total price for each smoothie.
*   This makes it easy to calculate the final price without manually summing up each price component every time!

---  

### In Summary

In SQL, a user-defined function is like a handy calculator or custom formula. You can create functions like this one to calculate totals, averages, or any other custom calculation you need. This makes your SQL queries more efficient and easier to manage — just like using a special recipe or formula whenever you need it.