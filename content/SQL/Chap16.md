+++
title = 'SQL — Temporary Tables'
date = 2024-04-13
draft = false
author = "Ashwini Shalke"
weight = 16
tags = ["SQL", "Database", "Beginners","Tables"]
+++



![](https://cdn-images-1.medium.com/max/1600/1*iSgVume5k5pPTkDsAL9NQg.jpeg)

Temporary tables are like a temporary workspace or desk that you set up when you need some extra space to work on a project. You can use this space to organize and manipulate data without affecting your main workspace (or database) permanently. Once you’re done with your task, you can clean up and remove the temporary workspace, and everything goes back to how it was before.

### **Example:**

Suppose you’re working on a school project where you need to analyze data about students’ grades and attendance. You don’t want to mess up your main desk (or database) with all your messy calculations and temporary data, so you set up a temporary workspace (or temporary table) to work on your project.

### 1.  Local Temporary Tables:

```html

CREATE TABLE #TempGrades ( StudentID INT, Subject VARCHAR(50), 
Grade VARCHAR(2) );

```

In this example, the pound sign “#” before the table name indicates that it’s a _local temporary table_. You can use this table within the current session or connection, and it’s automatically dropped (deleted) when the session ends.

```html

INSERT INTO #TempGrades (StudentID, Subject, Grade) 
SELECT StudentID, Subject, Grade FROM Grades WHERE StudentID = 1;

```

This query inserts data into the temporary table #TempGrades from the Grades table for a specific student.

---
### 2.  Global Temporary Tables:

```html

CREATE TABLE ##TempGrades ( StudentID INT, Subject VARCHAR(50), 
Grade VARCHAR(2) );

```

In this example, the double pound sign “##” before the table name indicates that it’s a _global temporary table_. You can use this table across different sessions or connections, and it’s automatically dropped when all sessions referencing it are closed.

```html

INSERT INTO ##TempGrades (StudentID, Subject, Grade) 
SELECT StudentID, Subject, Grade FROM Grades WHERE Grade = 'A';

```

This query inserts data into the global temporary table ##TempGrades from the Grades table for students who received an ‘A’ grade.

> Temporary tables provide a convenient way to work with data temporarily without affecting the main database structure. Just like setting up a temporary workspace for your project, you can use temporary tables to organise and manipulate data for specific tasks or analyses, and then clean up when you’re done.