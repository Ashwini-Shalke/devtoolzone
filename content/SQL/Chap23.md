+++
title = 'The differences in SQL'
date = 2024-04-16
draft = false
author = "Ashwini Shalke"
weight = 23
+++



![](https://cdn-images-1.medium.com/max/1600/1*m5sIrT6qVE8gJkgmNRvSWw.png)

### Truncate and Delete:

**Truncate:** Truncate is like clearing the entire table at once. It removes all the rows from a table but keeps the table structure intact. It’s faster than DELETE but doesn’t allow for conditions.

```html
TRUNCATE TABLE Students;
```

**Delete:** Delete removes specific rows from a table based on conditions. It’s slower than TRUNCATE but allows for specifying conditions.

```html
DELETE FROM Students WHERE Age > 18;
```
---

### Merge and Insert:

**Merge:** Merge performs an INSERT, UPDATE, or DELETE operation based on the condition provided. It’s useful for synchronizing data between two tables.

```html
MERGE INTO TargetTable USING SourceTable ON (condition) 
WHEN MATCHED THEN UPDATE SET... WHEN NOT MATCHED THEN INSERT ...
```

**Insert:** Insert adds new rows of data into a table.

```html
INSERT INTO Students (Name, Age) VALUES ('Alice', 15);
```
---

### Alter and Rename:

**Alter:** Alter modifies the structure of a table, such as adding or dropping columns.

```html
ALTER TABLE Students ADD COLUMN GPA FLOAT;
```

**Rename:** Rename changes the name of a table.

```html
RENAME TABLE Students TO ClassMembers;
```
---

### Group by and Order by:

**Group by:** Group by groups rows that have the same values into summary rows, typically used with aggregate functions like COUNT, SUM, AVG.

```html
SELECT Department, AVG(Salary) FROM Employees GROUP BY Department;
```

**Order by:** Order by sorts the result set by one or more columns either ascending (default) or descending.

```html
SELECT Name, Age FROM Students ORDER BY Age DESC;
```
---

### Where and Having:

Where: Where filters rows based on specified conditions before grouping.

```html
SELECT Department, COUNT(\*) FROM Employees WHERE Salary > 50000 GROUP BY Department;
```

Having: Having filters group rows based on specified conditions after grouping.

```html
SELECT Department, AVG(Salary) FROM Employees GROUP BY Department HAVING AVG(Salary) >50000;
```
---

### All and Forall:

**All:** All returns true if all of the subquery values meet the condition.

```html
SELECT Name FROM Students WHERE Age > ALL (SELECT Age FROM Students);
```

**Forall:** Forall performs a specified action for all elements in a collection.

```html
FORALL i IN 1..students.count SAVE EXCEPTIONS INSERT INTO Grades 
VALUES(students(i).id, students(i).grade);
```

### Varchar and Char

**Varchar:** Varchar stores variable-length character data. It allocates storage only for the characters entered, making it more flexible but potentially less efficient for fixed-length data.

**Char:** Char stores fixed-length character data. It allocates the full storage space for each value, padding with spaces if necessary, ensuring consistent storage size.


> These explanations and examples should help you understand the differences between each concept in SQL!