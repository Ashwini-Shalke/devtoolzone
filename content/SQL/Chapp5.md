+++
title = 'Window Functions in SQL'
date = 2024-04-10
draft = false
author = "Ashwini Shalke"
weight = 5
tags = ["SQL", "Database", "Beginners","Window", "Functions"]
+++



![](https://cdn-images-1.medium.com/max/1600/1*x-ZWz0wStOYljKcElhLAzg.jpeg)

Window functions are a type of function in SQL that allow you to perform calculations across a set of rows related to the current row, called a “window,” without collapsing the result set. They are used to perform aggregate calculations (like sum, average, count) and ranking operations (like row number, rank) within a specific partition or window of data.

## Syntax Types of Window Functions:

**There are a few common window functions you might encounter:**

1.  **Aggregate Functions:** These functions perform calculations across a set of rows and return a single value for each row. Examples: `SUM()`, `AVG()`, `COUNT()`
2.  **Ranking Functions:** These functions assign a rank to each row based on the specified criteria. Examples: `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`
3.  **Analytic Functions:** These functions compute an aggregate value based on a group of rows and return multiple rows for each input row. Examples: `LAG()`, `LEAD()`, `FIRST_VALUE()`, `LAST_VALUE()` 

---

Let’s say we have a simple table called `student_scores` with columns `student_id`, `subject`, and `score`. Here's some sample data:

![](https://cdn-images-1.medium.com/max/1600/1*OM7cYE2E4Ngnek2NoraD5w.png)

**Example:** Now, let’s say we want to find the average score for each subject, the rank of each student and also to find the next highest score within their subject. We can use window functions to achieve this:

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

*   The `AVG(score) OVER (PARTITION BY subject)` calculates the average score for each subject. This means it calculates the average of all scores for each subject.
*   The `RANK() OVER (PARTITION BY subject ORDER BY score DESC)` assigns a rank to each student within their subject, based on their score. The `ORDER BY score DESC` part orders the scores in descending order, so the highest score gets the lowest rank.
*   The `LEAD(score) OVER (PARTITION BY subject ORDER BY score DESC)` function calculates the next highest score for each student within their subject. The `ORDER BY score DESC` orders the scores in descending order, so the next highest score will be the score of the next row.

**Result :**

![](https://cdn-images-1.medium.com/max/1600/1*oHNQbb0XzQVPlydgUifSRQ.png)


> _This result shows each student’s score, the average score for each subject, and their rank within each subject._