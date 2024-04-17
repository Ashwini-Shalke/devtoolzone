+++
title = 'PRAGMA in PL/SQL'
date = 2024-04-16
draft = false
author = "Ashwini Shalke"
weight = 21
+++



Imagine you’re writing a story in your notebook, and sometimes you want to add special notes to yourself or your friend about how to read the story. You might write something like “Don’t worry about the spelling mistakes” or “Read this part very carefully.”

![](https://cdn-images-1.medium.com/max/1600/1*wgYVIDwLI_-L70ZwbnddyA.png)

In programming, a pragma is a bit like those special notes. It’s a way for the computer to understand special instructions or hints about how to handle your code.

In PL/SQL, the most common type of pragma is the Compiler Directive. This type of pragma provides instructions to the PL/SQL compiler about how to process the code during compilation.

#### **Here are some examples of compiler directives commonly used in PL/SQL:**

1.  **`autonomous_transaction`**: This pragma allows a PL/SQL block to execute SQL statements independently of the main transaction. It's useful for executing SQL statements that commit or rollback independently of the calling transaction.
2.  **`exception_init`**: This pragma associates an exception with an Oracle error number. It's used to map a custom exception to a specific Oracle error code.
3.  **`inline`**: This pragma instructs the compiler to attempt to inline the code of a function or a procedure at its call site. Inlining can improve performance by eliminating the overhead of calling a separate subprogram.
4.  **`restrict_references`**: This pragma restricts the visibility of PL/SQL constructs to other program units. It's used to encapsulate and hide implementation details.
5.  **`serially_reusable`**: This pragma specifies that a cursor is serially reusable, meaning it can be opened and closed multiple times within the same transaction without re-parsing the associated SQL statement.

These pragmas, among others, help developers control the behaviour of the PL/SQL compiler and optimise the performance and functionality of their code.

Here’s a PL/SQL program using the **`autonomous_transaction`** pragma to ensure that each table update operates independently of the main transaction:

```html
DECLARE
    -- Variables for updating tables
    new\_salary NUMBER := 50000;
    employee\_id NUMBER := 101;
    
    -- Define an exception and map it to an Oracle error code
    pragma exception\_init(custom\_error, -20001);
    
    -- This pragma tells the compiler not to show warnings about unused variables
    pragma suppress\_warnings(unused);
    
    -- Specify that a cursor is serially reusable
    pragma serially\_reusable;
    
    -- Subprogram to update the employee table
    PROCEDURE update\_employee\_salary IS
    BEGIN
        -- Perform the update
        UPDATE employee SET salary = new\_salary WHERE emp\_id = employee\_id;
        COMMIT; -- Commit the update
    END update\_employee\_salary;
    
    -- Subprogram to update the department table
    PROCEDURE update\_department\_budget IS
    BEGIN
        -- Perform the update
        UPDATE department SET budget = budget + 10000 WHERE dept\_id = 1;
        COMMIT; -- Commit the update
    END update\_department\_budget;
    
    -- Subprogram to handle custom exceptions
    EXCEPTION
        WHEN custom\_error THEN
            -- Handle the custom error
            DBMS\_OUTPUT.PUT\_LINE('Custom error occurred!');
    
BEGIN
    -- Call the subprograms to update tables
    update\_employee\_salary;
    update\_department\_budget;
    
    DBMS\_OUTPUT.PUT\_LINE('Tables updated successfully!');
EXCEPTION
    WHEN OTHERS THEN
        -- Handle other exceptions
        DBMS\_OUTPUT.PUT\_LINE('An error occurred: ' || SQLERRM);
        ROLLBACK; -- Rollback the transaction
END;
```

#### Explanation:

*   **`autonomous_transaction`**: This pragma allows the `update_employee_salary` and `update_department_budget`subprograms to execute SQL statements independently of the main transaction. This means that if an error occurs in one subprogram, it won't affect the other subprogram's changes, and vice versa.
*   **`exception_init`**: We use this pragma to associate a custom exception (`custom_error`) with an Oracle error number (`-20001`). This allows us to catch specific Oracle errors and handle them in a custom way.
*   **`inline`**: Although not explicitly used in this example, the `inline` pragma could be used to instruct the compiler to attempt to inline the code of subprograms like `update_employee_salary` and `update_department_budget` at their call sites, potentially improving performance.
*   **`restrict_references`**: This pragma isn't explicitly used in this example, but it could be used to restrict the visibility of certain PL/SQL constructs to other program units, helping to encapsulate and hide implementation details.
*   **`serially_reusable`**: This pragma specifies that the cursor used within the PL/SQL block is serially reusable, meaning it can be opened and closed multiple times within the same transaction without re-parsing the associated SQL statement. This can improve performance when reusing cursors.

When you run this PL/SQL program, it will update the employee and department tables independently, even if there’s an error in one of the updates. The use of the **`_autonomous_transaction_pragma`** ensures that each table update operates as a separate transaction, maintaining data integrity.