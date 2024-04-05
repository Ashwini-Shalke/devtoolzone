+++
title = 'SQL language — DDL, DML, DCL, and TCL'
date = 2024-04-05T12:28:23+05:30
draft = false
+++

## DDL (Data Definition Language):

DDL is used to define and manage the structure of database objects. Here are some common DDL commands:

  

**CREATE**: Used to create new database objects such as tables, views, indexes, etc.

![](https://miro.medium.com/v2/resize:fit:1400/1*Mf9vT1po8ze3gWy8_zHVdw.png)

**ALTER:** Used to modify the structure of existing database objects, such as adding, modifying, or dropping columns.

**Here are few examples :-**

1.Adding a new column:

![](https://miro.medium.com/v2/resize:fit:1400/1*_St1Rak7m7KLCe4icjAkAg.png)

This command adds a new column named “Email” to the “Students” table with a data type of VARCHAR(100).

2\. Modifying a column’s data type:

![](https://miro.medium.com/v2/resize:fit:1400/1*pwv2wfs-Ac9M3l1d3NisrQ.png)

This command modifies the data type of the “Age” column in the “Students” table to INT and specifies that it cannot contain NULL values.

3\. Dropping a column:

![](https://miro.medium.com/v2/resize:fit:1400/1*rlVAOnh6HCNZviy6uofBbg.png)

This command removes the “Email” column from the “Students” table.

4\. Renaming a table:

![](https://miro.medium.com/v2/resize:fit:1400/1*wQNJddQxy2ig_eNlMgflnA.png)

This command renames the “OldTableName” table to “NewTableName”.

**DROP:** Used to delete existing database objects like tables, views, indexes, etc.

![](https://miro.medium.com/v2/resize:fit:1400/1*Kcx2oN6JauFZJiyxQWE5HA.png)

**TRUNCATE:** Used to remove all records from a table, but the table itself remains intact.

![](https://miro.medium.com/v2/resize:fit:1400/1*SW0iCaA7IXPA_7tzdoSw4A.png)

\===============================================================

## DML (Data Manipulation Language):

DML is used to manage data within database objects. Here are some common DML commands:

  

**INSERT:** Used to add new records (rows) into a table

![](https://miro.medium.com/v2/resize:fit:1400/1*0Vz9rvChheOS2o147QVoWQ.png)

**Inserting Multiple Rows at Once:** You can insert multiple rows into a table using a single INSERT statement by providing multiple sets of values.

![](https://miro.medium.com/v2/resize:fit:1400/1*jfGgIHJXz_dW6ZPvDJDQ0Q.png)

**UPDATE:** Used to modify existing records in a table.

![](https://miro.medium.com/v2/resize:fit:1400/1*1YmpmEBKgO8l-Q0zjqqxDQ.png)

**DELETE:** Used to remove records from a table.

![](https://miro.medium.com/v2/resize:fit:1400/1*WLH6m70fMbbTHsaXqTKvzQ.png)

**SELECT:** Used to retrieve data from one or more tables.

![](https://miro.medium.com/v2/resize:fit:1400/1*f-oj-LQ4axCbg-QLbfxegA.png)

## DCL (Data Control Language):

DCL is used to control access to data within the database. Here’s a common DCL command:

  

**GRANT:** Used to grant specific privileges to users or roles.

![](https://miro.medium.com/v2/resize:fit:1400/1*UG0tvR8Yx7Bt2ngqyn7mdQ.png)

**REVOKE:** Used to revoke previously granted privileges from users or roles.

![](https://miro.medium.com/v2/resize:fit:1400/1*WjyzpBcAn7GoOCCS6zTU0Q.png)

## TCL (Transaction Control Language):

TCL is used to manage transactions within the database. Here are common TCL commands:

  

**COMMIT:** Used to permanently save changes made during the current transaction.

![](https://miro.medium.com/v2/resize:fit:1400/1*xSzFsov45nmDzrjJFI5utw.png)

**ROLLBACK:** Used to discard changes made during the current transaction and restore the database to its state before the transaction began.

![](https://miro.medium.com/v2/resize:fit:1400/1*UHA3a-xXUKEXUBnwYhB8Rw.png)

**SAVEPOINT:** Used to set a point within the current transaction from which you can later roll back.

![](https://miro.medium.com/v2/resize:fit:1400/1*EMkGSbkRFp_cF41Ljk9Oxw.png)

These commands are essential for managing and manipulating the structure and data within a database, controlling access to it, and ensuring transactional integrity.