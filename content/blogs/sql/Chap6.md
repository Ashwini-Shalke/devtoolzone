+++
title = 'SQL Window Functions: Get Smarter with Data Analysis'
date = 2024-04-08
draft = false
author = "Ashwini Shalke"
weight = 6
tags = ["SQL", "Database", "Beginners","Clause"]
+++


  
If you’ve ever wanted to perform complex calculations on your data without losing details or collapsing your results into a single row, you’re in the right place. Enter **Window Functions** in SQL! 

These powerful tools allow you to perform calculations across a set of rows, called a “window,” but without changing the number of rows you see in your results. It’s like using a magnifying glass to zoom into specific parts of your data without losing the overall picture.

![](https://cdn-images-1.medium.com/max/1600/1*HrQm8auRrkq97XjemKcmvg.png)

---

### What Exactly Are Window Functions?

Window functions let you perform calculations across a “window” of rows related to the current row, without collapsing the result into a single output. Imagine you have a table with student scores, and you want to know not only how each student performed, but also the average score for their subject, their rank, and even the next highest score in their subject. Window functions can do all that and more!

Let’s break down the types of window functions you’ll encounter:

---

### Types of Window Functions

1.  **Aggregate Functions**
These functions perform calculations across multiple rows and return a single value for each row in the result set. They’re like summarizing data but still keeping individual rows.
  **Examples**: `SUM()`, `AVG()`, `COUNT()`
2.  **Ranking Functions**
These assign ranks to rows based on a specific order. You can use them to assign a position or rank within a partition (a group of related rows).
**Examples**: `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`
3.  **Analytic Functions**
 These functions allow you to calculate something like an aggregate value but still return multiple rows, keeping the original dataset intact. For example, you can calculate the next highest score or the first and last values in a set.
**Examples**: `LAG()`, `LEAD()`, `FIRST_VALUE()`, `LAST_VALUE()`

  

---

### Let’s See Window Functions in Action!

Suppose you have a table called `student_scores` that tracks students' scores in different subjects. The table looks like this:

![](https://cdn-images-1.medium.com/max/1600/1*XELn_mUQXV19aljy8F0OhQ.png)

### The Task:

You want to know:

*   The average score for each subject
*   The rank of each student in their subject based on score
*   The next highest score within each subject

---

### SQL Query with Window Functions

Here’s how we can achieve this using window functions:

```html
SELECT 
    student\_id,
    subject,
    score,
    AVG(score) OVER (PARTITION BY subject) AS avg\_score,
    RANK() OVER (PARTITION BY subject ORDER BY score DESC) AS rank\_within\_subject,
    LEAD(score) OVER (PARTITION BY subject ORDER BY score DESC) AS next\_highest\_score
FROM 
    student\_scores;
```


#### Step-by-Step Breakdown:

####   

*   `**AVG(score) OVER (PARTITION BY subject)**`: This calculates the average score for each subject. The `PARTITION BY subject` part ensures that the calculation is done separately for each subject, and the result will show the average for Math, History, etc.
*   `**RANK() OVER (PARTITION BY subject ORDER BY score DESC)**`: This ranks each student within their subject, with the highest score getting rank 1. The `ORDER BY score DESC` ensures that the ranks are assigned from highest to lowest.
*   `**LEAD(score) OVER (PARTITION BY subject ORDER BY score DESC)**`: This function gives the score of the next student in the list, based on the ranking within each subject. So, if you want to know who scored higher than a student, you can use `LEAD()` to grab the next score in the ordered list.

### Result:

After running the query, you’ll get something like this:

![](https://cdn-images-1.medium.com/max/1600/1*Kpg1_cBPdkpXIihVU1YiWw.png)

--- 

### What’s Happening Here?

###   

*   `**avg_score**`: This shows the average score for each subject. For Math, the average is 87.67, and for History, it's 88.67.
*   `**rank_within_subject**`: This ranks students based on their score in descending order. The student with the highest score gets rank 1. For Math, the ranking is:
*   Student 1 (90) is rank 1
*   Student 3 (88) is rank 2
*   Student 2 (85) is rank 3

    
*   `**next_highest_score**`: This gives the score of the next student in line based on their rank. So, for Student 1 (Math), the next highest score is 88. For Student 3 (Math), the next highest score is 85. If there’s no next score (like for the lowest rank in a subject), it shows `NULL`.

--- 

### Why Are Window Functions So Cool?

###   

Window functions allow you to do complex calculations **without losing any data**. Normally, when you use aggregate functions (like `SUM()` or `AVG()`), your query would return a single row per group. But with window functions, you can keep all the rows intact while still getting powerful insights—like ranks, averages, or even the next item in line.

### Real-Life Analogy:

###   

Think of **window functions** like being in a race. Each runner (row) has a score, but instead of just seeing the winner (the aggregate result), you get a detailed report on:

*   The runner’s position (rank)
*   Their time compared to the average time for all runners (average)
*   The next runner’s time (next highest score)

This way, you get all the info you need without losing the details of the individual racers.

---

### Wrapping Up

Now you know how **window functions** work and how they can be used to perform complex calculations without changing your data structure. With tools like `RANK()`, `AVG()`, and `LEAD()`, you can analyze your data in ways that go beyond simple queries and unlock deeper insights.

So, whether you’re calculating averages, ranks, or even finding the next highest score, window functions are your new best friend in SQL!