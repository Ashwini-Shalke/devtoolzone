+++
title = 'Understanding REF_CURSOR in SQL: Explained Simply with Examples'
date = 2024-04-15
draft = false
author = "Ashwini Shalke"
weight = 18
+++


![](https://cdn-images-1.medium.com/max/1600/1*u66i5hiSMOCEqgoudUQw4Q.png)

Ever heard of something called REF\_CURSOR? Don’t worry if it sounds like gibberish right now. I’m here to break it down for you in the simplest way possible, so grab a snack and let’s dive in!

Imagine you’re at a library, and you ask the librarian to recommend some good books. Instead of giving you a list of book titles right away, the librarian hands you a special kind of card called a REF\_CURSOR. This card doesn’t contain the actual book titles; rather, it tells you where to find the books on the shelves.

In SQL, a REF\_CURSOR works similarly. It’s like a placeholder that points to a result set (or a set of rows) in a database, but it doesn’t contain the actual data. Instead, it holds a reference to where the data can be found.

**Now, let’s break it down with an example:**

Suppose we have a database table called “books” with columns for book ID, title, author, and genre. We want to create a stored procedure that returns a list of books written by a specific author.

**Here’s how we can use a REF\_CURSOR to achieve this:**

CREATE OR REPLACE PROCEDURE get\_books\_by\_author(
    p\_author\_name IN VARCHAR2,
    p\_books\_cur OUT SYS\_REFCURSOR
) AS
BEGIN
    OPEN p\_books\_cur FOR
    SELECT title, author, genre
    FROM books
    WHERE author = p\_author\_name;
END;

**Let’s break it down:**

*   We define a stored procedure called “get\_books\_by\_author” that takes an author name as input (p\_author\_name) and returns a REF\_CURSOR (p\_books\_cur) as output.
*   Inside the procedure, we use the OPEN statement to associate the REF\_CURSOR with a SELECT query that fetches books written by the specified author.
*   The result set returned by the SELECT query is stored in the REF\_CURSOR, ready to be fetched by the caller.

**Now, let’s see how we can use this stored procedure in a SQL script:**

```html
DECLARE
    books\_cursor SYS\_REFCURSOR;
    book\_title books.title%TYPE;
    book\_author books.author%TYPE;
    book\_genre books.genre%TYPE;
BEGIN
    get\_books\_by\_author('J.K. Rowling', books\_cursor);

    LOOP
        FETCH books\_cursor INTO book\_title, book\_author, book\_genre;
        EXIT WHEN books\_cursor%NOTFOUND;
        -- Do something with the fetched data (e.g., print it)
        DBMS\_OUTPUT.PUT\_LINE('Title: ' || book\_title || ', Author: ' || book\_author || ', Genre: ' || book\_genre);
    END LOOP;

    CLOSE books\_cursor;
END;
```

**In this script:**

*   We declare a REF\_CURSOR variable called “books\_cursor” along with variables to hold book details.
*   We call the “get\_books\_by\_author” procedure, passing ‘J.K. Rowling’ as the author name and receiving the result set in the “books\_cursor” variable.
*   We then fetch each row from the result set using a loop and print the book details.

So, in simple terms, a REF\_CURSOR is like a magic wand that points to a list of data, allowing you to fetch and work with that data in your SQL code.