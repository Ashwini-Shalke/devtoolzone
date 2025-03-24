+++
title = 'Mastering SQL Transactions: How COMMIT, ROLLBACK, and SAVEPOINT Work (With Fun Examples!)'
date = 2024-04-08
draft = false
author = "Ashwini Shalke"
weight = 4
tags = ["SQL", "Database", "Beginners","TCL"]
+++

  
Imagine you’re a student, and you need to update your information in a school database. Let’s say you’re updating your age, but what if something goes wrong? Or, you decide to make a change but then realize you made a mistake? Don’t worry, SQL has your back! This is where **COMMIT**, **ROLLBACK**, and **SAVEPOINT** come into play.

These SQL commands help you manage changes to your database and make sure things run smoothly. Let’s break it down with some fun examples, so you’ll understand how to use them!

--- 

### 1\. COMMIT: Locking in Your Changes for Good

Think of the **COMMIT** command as a “final decision” button. Once you hit commit, you’re saying, _“Okay, everything I’ve done is locked in and ready to stay.”_

When you make changes to the database (like updating a student’s age or adding a new class), the changes aren’t permanent until you **COMMIT** them. If something happens before the commit, you can cancel or roll back the changes. But once you **COMMIT**, there’s no going back.

![](https://cdn-images-1.medium.com/max/1600/1*JfpB-7rrPqzToe2k0HNVFA.png)

#### Example: Updating Alice’s Age

Let’s say you want to update Alice’s age in the database. Here’s how you’d do it:

```html
BEGIN TRANSACTION; 
UPDATE Students SET Age = 16 WHERE Name = 'Alice'; 
COMMIT;
```

**Step-by-Step:**

1.  **BEGIN TRANSACTION**: This starts your “transaction,” or set of changes.
2.  **UPDATE Students SET Age = 16 WHERE Name = ‘Alice’**: You’re updating Alice’s age to 16.
3.  **COMMIT**: Now, the change is permanent! Alice’s new age of 16 is locked into the database.

After the **COMMIT**, no one can undo the change. Alice’s age is now permanently 16.

---  

### 2\. ROLLBACK: Oops, Let’s Undo That!

What if you made a mistake? Maybe you accidentally updated the wrong student’s age, or maybe something went wrong during the update. The **ROLLBACK** command is your “undo” button. It helps you erase all changes made during a transaction and get back to the way things were before.

![](https://cdn-images-1.medium.com/max/1600/1*u-zyNc20IQ399PhiNzlGRw.png)

#### Example: Rolling Back Alice’s Age Update

Let’s say you updated Alice’s age but realized she’s actually still 15, not 16! Time to hit the **ROLLBACK** button.

```html
BEGIN TRANSACTION; 
UPDATE Students SET Age = 16 WHERE Name = 'Alice'; 
ROLLBACK;
```

**Step-by-Step:**

1.  **BEGIN TRANSACTION**: You start making your changes.
2.  **UPDATE Students SET Age = 16 WHERE Name = ‘Alice’**: You accidentally set Alice’s age to 16.
3.  **ROLLBACK**: Oops! You quickly realize the mistake, and the **ROLLBACK** command erases all changes. Alice’s age remains unchanged.

A **ROLLBACK** can be used if you made any error, or even if you just changed your mind. It cancels everything in that transaction and restores the database to its previous state.

--- 

### 3\. SAVEPOINT: Save Your Progress

Okay, imagine you’re working on a big project, and you want to save your progress at certain points. You don’t want to restart from the beginning if something goes wrong later. That’s exactly what the **SAVEPOINT** command does — it allows you to set a “checkpoint” within a transaction. If something goes wrong later, you can **ROLLBACK** to that specific checkpoint and not lose everything you’ve done.

![](https://cdn-images-1.medium.com/max/1600/1*etvYUqSUzBcctB4hbZ4CRw.png)

#### Example: Updating Multiple Students’ Ages

Let’s say you want to update the ages of two students, Alice and Bob. You want to save your progress after updating Alice’s age, in case something goes wrong when you update Bob’s age. Here’s how:

```html
BEGIN TRANSACTION;
UPDATE Students SET Age = 16 WHERE Name = 'Alice';
SAVEPOINT sp1; 
UPDATE Students SET Age = 17 WHERE Name = 'Bob'; 
-- Uh-oh, something goes wrong!
ROLLBACK TO SAVEPOINT sp1;
COMMIT;
```

**Step-by-Step:**

1.  **BEGIN TRANSACTION**: Start a new transaction.
2.  **UPDATE Students SET Age = 16 WHERE Name = ‘Alice’**: You update Alice’s age to 16.
3.  **SAVEPOINT sp1**: You mark a checkpoint after Alice’s update. If anything goes wrong after this, you can roll back to this point.
4.  **UPDATE Students SET Age = 17 WHERE Name = ‘Bob’**: You try to update Bob’s age to 17, but something goes wrong.
5.  **ROLLBACK TO SAVEPOINT sp1**: Uh-oh, there’s an issue with Bob’s update! You don’t want to undo Alice’s change, so you roll back to the **SAVEPOINT** you set earlier, which keeps Alice’s update but undoes the change to Bob.
6.  **COMMIT**: Now, with no more errors, you **COMMIT** the changes. Alice’s age is updated to 16, and Bob’s age stays as it was.

The **SAVEPOINT** allows you to make sure your changes are only partially undone if you run into trouble. This is super helpful if you’re working with a lot of data and want to make sure some parts of your work stay intact while others can be fixed.

--- 

### In Summary

*   **COMMIT**: Makes your changes permanent, like pressing “save” after a major decision.
*   **ROLLBACK**: Takes everything back to the way it was before you started, like undoing a mistake.
*   **SAVEPOINT**: Creates a checkpoint, so you can go back to a certain point in your work if needed.

With these commands, you can control how your data changes, and prevent mistakes from messing up the entire database. It’s like being able to hit “undo” at any moment, and even save your work at different stages.
