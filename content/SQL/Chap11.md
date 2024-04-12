+++
title = 'CHOOSE and IIF — SQL'
date = 2024-04-11
draft = false
author = "Ashwini Shalke"
weight = 10
+++



![](https://cdn-images-1.medium.com/max/1600/1*aXjqVR057ThEvlN94KeTyQ.jpeg)

Imagine you’re organizing a gaming tournament, and you want to assign a different prize based on the rank players achieved.

Let’s say you have the following rankings:

![](https://cdn-images-1.medium.com/max/1600/1*bVRdYLZ3JfERGonncmaKzQ.png)Ranking Table

#### Using CHOOSE

`CHOOSE` function returns the value from a list of values based on the specified index.

```html

SELECT CHOOSE(Rank, 'Gold Medal', 'Silver Medal', 'Bronze Medal', 
'Participation Prize', 'Participation Prize') AS Prize FROM Rankings;

```

**Result:**

![](https://cdn-images-1.medium.com/max/1600/1*PW14JZ2weh7WaP3_QH1ufA.png)

**Explanation:**

*   The `CHOOSE` function takes the Rank as an index.
*   If Rank is 1, it returns ‘Gold Medal’.
*   If Rank is 2, it returns ‘Silver Medal’.
*   If Rank is 3, it returns ‘Bronze Medal’.
*   If Rank is 4 or 5, it returns ‘Participation Prize’.

#### Using IIF:

`IIF` function returns one of two values depending on whether the specified condition evaluates to true or false.

SELECT Rank, IIF(Rank = 1, 'Gold Medal', 'No Prize') AS Prize FROM Rankings;

**Result:**

![](https://cdn-images-1.medium.com/max/1600/1*2V6UhIr5Tl-4bDo5MnmWUw.png)

**Explanation:**

*   The `IIF` function checks if the Rank is 1.
*   If true, it returns ‘Gold Medal’.
*   If false, it returns ‘No Prize’.

> In simple terms:

> `CHOOSE` function selects a value based on the index provided.

> `IIF` function returns one value if a condition is true, otherwise returns another value.

> These functions are handy when you need to make decisions or select values based on certain conditions in your SQL queries.

