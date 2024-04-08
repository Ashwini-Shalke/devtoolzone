+++
title = 'For Beginners — TCL Commands in SQL with Example'
date = 2024-04-08T12:28:23+05:30
draft = false
+++


![](https://cdn-images-1.medium.com/max/1600/1*avRCwOaJClWVvRGqnO11QA.jpeg)

TCL commands are COMMIT, ROLLBACK, and SAVEPOINT.

### COMMIT:

*   The COMMIT command is used to permanently save the changes made during the current transaction.
*   Once a COMMIT command is executed, all changes made within the transaction become permanent and are visible to other users.

**Example:**
Suppose we have a transaction that updates the age of a student in the database:

```html
BEGIN TRANSACTION; 
UPDATE Students SET Age = 16 WHERE Name = 'Alice'; 
COMMIT;
```

**In this example:**

*   The BEGIN TRANSACTION command marks the start of a transaction.
*   The UPDATE statement modifies the age of the student named ‘Alice’.
*   Finally, the COMMIT command is executed, which permanently saves the changes made in the transaction.
*   After the COMMIT, the age of ‘Alice’ will be updated to 16 in the database.

### ROLLBACK:

*   The ROLLBACK command is used to discard changes made during the current transaction and restore the database to its state before the transaction began.
*   It is typically used to undo changes if an error occurs during the transaction or to cancel incomplete or incorrect transactions.

**Example:**

Suppose we have started a transaction to update the age of a student but encounter an error:

```html
BEGIN TRANSACTION; 
UPDATE Students SET Age = 16 WHERE Name = 'Alice'; 
-- Error occurs, transaction needs to be rolled back 
ROLLBACK;
```

**In this example:**

*   The BEGIN TRANSACTION command marks the start of a transaction.
*   The UPDATE statement modifies the age of the student named ‘Alice’.
*   However, if an error occurs (e.g., due to a database constraint violation or network issue), the ROLLBACK command is executed. This undoes any changes made in the transaction, ensuring that the database remains in a consistent state.

### SAVEPOINT:

*   SAVEPOINT allows you to set a point within the current transaction from which you can later roll back.
*   It is useful for dividing a transaction into smaller parts and selectively rolling back to specific points in the transaction.

**Example:**
Suppose we want to update the age of multiple students but want to be able to roll back changes for each student individually:

```html
BEGIN TRANSACTION; 
UPDATE Students SET Age = 16 WHERE Name = 'Alice';
SAVEPOINT sp1; 
UPDATE Students SET Age = 17 WHERE Name = 'Bob'; 
-- Error occurs, need to roll back to the savepoint 
ROLLBACK TO SAVEPOINT sp1; 
COMMIT;
```

**In this example:**

*   The BEGIN TRANSACTION command marks the start of a transaction.
*   The UPDATE statement modifies the age of the student named ‘Alice’.
*   The SAVEPOINT command is used to set a savepoint named ‘sp1’ within the transaction.
*   The UPDATE statement modifies the age of the student named ‘Bob’.
*   If an error occurs during the second UPDATE statement, we can roll back to the savepoint ‘sp1’ using the ROLLBACK TO SAVEPOINT command. This will undo only the changes made after the savepoint.
*   Finally, if no errors occur, the changes are permanently saved using the COMMIT command.

> _These examples illustrate how COMMIT, ROLLBACK, and SAVEPOINT commands are used to manage transactions and ensure data integrity in SQL._