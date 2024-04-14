+++
title = 'For Beginners to Understand Triggers in SQL'
date = 2024-04-13
draft = false
author = "Ashwini Shalke"
weight = 15
+++


![](https://cdn-images-1.medium.com/max/1600/1*SjMVyjqqGs-sGvVHnQNyBQ.png)

Lets assume !! you have a magic toy box that automatically does something whenever you put a specific type of toy inside it. Triggers in SQL are like these magical rules that automatically perform actions in the database when certain events happen.

**Example:**

Let’s say you have a database table called “Orders” that stores information about orders placed by customers:

![](https://cdn-images-1.medium.com/max/1600/1*VzHVONH90lsWodEhRYkpzg.png)

**Trigger Example:**

Now, imagine you want to keep track of any large orders (orders with a total amount over $100) automatically. You can create a trigger to do this.

```html

CREATE TRIGGER TrackLargeOrders 
AFTER INSERT ON Orders 
FOR EACH ROW 
BEGIN 
  IF NEW.TotalAmount > 100 
    THEN INSERT INTO LargeOrders (OrderID, TotalAmount) 
            VALUES(NEW.OrderID, NEW.TotalAmount); 
    END IF; 
END;

```


**Explanation:**

*   This trigger, called “TrackLargeOrders”, is set to activate after each new row (order) is inserted into the “Orders” table.
*   It checks if the total amount of the new order is over $100.
*   If it is, it inserts a record into another table called “LargeOrders”, which keeps track of large orders.

### Advantages & Disadvantages of Triggers:

#### Advantages:

1.  Automation: Triggers automate tasks, reducing the need for manual intervention. For example, the trigger above automatically tracks large orders without someone having to do it manually.
2.  Maintaining Data Integrity: Triggers help enforce rules and maintain data integrity. For instance, you can use triggers to ensure that certain conditions are met before allowing changes to be made to the database.

#### Disadvantages:

1.  Complexity: Triggers can make the database more complex and harder to understand, especially when dealing with many triggers.
2.  Performance Impact: Poorly designed triggers can impact database performance, especially if they involve complex logic or operations.

> In simple terms, triggers in SQL are like magical rules that automatically perform actions in the database when certain events happen, such as inserting a new row into a table. While they can automate tasks and maintain data integrity, they can also add complexity and potentially impact performance if not used carefully.Triggers are special stored procedures that are automatically executed in response to certain events (like INSERT, UPDATE, or DELETE) on a table.

