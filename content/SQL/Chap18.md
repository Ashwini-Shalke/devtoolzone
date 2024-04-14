+++
title = 'What is a Cursor in SQL ?'
date = 2024-04-15
draft = false
author = "Ashwini Shalke"
weight = 18
+++


![](https://cdn-images-1.medium.com/max/1600/1*9-ijUDukA8XFpPf9ZC8bWw.jpeg)

Think of a cursor in SQL like a pointer that allows you to navigate through a set of rows returned by a query, one row at a time. It’s like a virtual hand that can grab one row of data from a table, process it, and then move on to the next row.

### Types of Cursors:

There are mainly two types of cursors in SQL:

1.  **Implicit Cursors:** These cursors are created by default when you execute a SQL query. They are easy to use but have limited functionality.
2.  **Explicit Cursors:** These cursors are explicitly defined by the programmer using the `DECLARE CURSOR` statement. They offer more control and flexibility but require more coding.

### Sample Data:

Let’s say we have a simple table called `students` with columns `student_id`, `name`, and `age`. Here's some sample data:

![](https://cdn-images-1.medium.com/max/1600/1*rKIWV2_u8R2neU7GirRFKQ.png)students


### Query Example with Explicit Cursor:

Here’s an example of using an explicit cursor to fetch and process data from the `students` table:

```html

DECLARE cursor\_students CURSOR FOR
    SELECT student\_id, name, age
    FROM students;
    

OPEN cursor\_students;

FETCH NEXT FROM cursor\_students INTO @student\_id, @name, @age;

WHILE @@FETCH\_STATUS = 0
BEGIN
    -- Process the current row
    PRINT 'Student ID: ' + CAST(@student\_id AS VARCHAR) + ', Name: ' + @name + ', Age: ' + CAST(@age AS VARCHAR);

    FETCH NEXT FROM cursor\_students INTO @student\_id, @name, @age;
END;

CLOSE cursor\_students;
DEALLOCATE cursor\_students;

```

### Result Explanation:
*   In this example, we first declare a cursor named `cursor_students` for selecting data from the `students` table.
*   We then open the cursor to start fetching rows from the result set.
*   The `FETCH` statement is used to retrieve rows one at a time from a cursor result set. It fetches the next row from the cursor's result set.There are different types of fetch operations, such as `FETCH NEXT`, `FETCH PRIOR`, `FETCH FIRST`, `FETCH LAST`, etc., which specify the direction of fetching and the number of rows to fetch.
*   `NEXT` is a keyword used in the `FETCH` statement to specify that we want to retrieve the next row from the cursor's result set.In the context of the query, `FETCH NEXT` retrieves the next row from the cursor's result set.
*   Using a loop, we fetch each row one by one and process it. Inside the loop, we can perform any operations or calculations on the fetched data.
*   The loop continues until there are no more rows to fetch (`@@FETCH_STATUS = 0`).
*   `CAST` is a SQL function used to convert a value from one data type to another. It allows you to explicitly specify the data type conversion.
*   For example, `CAST(@student_id AS VARCHAR)` converts the `@student_id` variable (presumably an integer) to a string (VARCHAR) data type.
*   Finally, we close and deallocate the cursor to release its resources.


**Result:**
The result would be printed in the console, showing each student’s ID, name, and age:

```html
Student ID: 1, Name: Alice, Age: 15
Student ID: 2, Name: Bob, Age: 16
Student ID: 3, Name: Charlie, Age: 14
```

> This process of fetching and processing one row at a time using a cursor allows for more complex and flexible data manipulation in SQL. However, it’s important to use cursors judiciously, as they can impact performance when dealing with large result sets.