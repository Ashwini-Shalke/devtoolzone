+++
title = 'Exploring Data Load Definitions in Oracle APEX: A Beginner’s Guide'
date = 2024-08-09
draft = false
author = "Ashwini Shalke"
weight = 11
tags = ["Oracle", "APEX", "Beginners","Low-Code","Data Load"]
+++



![](https://cdn-images-1.medium.com/max/1600/1*8xBXBo3CIx2rsRlGQ1-QOg.png)

### What is a Data Load Definition?

Imagine you have a super cool app that needs to bring in lots of data from different files like Excel or CSV. A data load definition in Oracle APEX is like a set of instructions that tells your app how to do this properly. It’s like giving your app a map to follow when it gets new data.

### How Do You Add Data Loading to Your App?

First, you create a data load definition. This includes details about where the data will come from (like which file types are allowed) and where it will go in your app (like which table in your database). You can even set rules to make sure the data is correct and fits perfectly.

### Creating a data load page involves several steps

#### Lets start by creating a Data Load Definition

*   Navigate to Shared Components, then select Data Load Definitions under Data Sources, and click on the Create button to begin.

![](https://cdn-images-1.medium.com/max/1600/1*JhGqoNwEPuMscllHYpviZA.png)

> A Data Load Definition is comprised of a Data Load Definition, Data Profile and Data Profile Columns. Data can be loaded either to an existing table in your schema or to a collection. You can define SQL Expression, SQL Query, Lookups or Transformation Rules for each data profile column. These definitions are used in the Native Data Loading page process type.

*   Select your source type; in this example, we’ve chosen to use an Excel spreadsheet.

![](https://cdn-images-1.medium.com/max/1600/1*FFaINV9avJUljbuegDBKKA.png)

*   When creating a Data Load Definition, the wizard gives you the option to include a Data Loading page in your application if needed.

![](https://cdn-images-1.medium.com/max/1600/1*cjvSo05Ve9l8we_h5igtqA.png)

*   Data Load definition has been created.

![](https://cdn-images-1.medium.com/max/1600/1*qs3KmtLkc6HM8TtgLRaPKg.png)

#### Now, lets Create a Data Load Page

Once you have your data load definition ready, you create a data load page. This page is where the magic happens! Users can upload files or copy data, and the app will check everything to make sure it’s okay. It’s like having a special page just for bringing in new data.

> If a Data Load definition exists, you can use Create Page wizard to add a Data Loading page. A single page will be created with Native Data Loading page process to provide the ability to upload data from a file or by copy and paste, and then upload the data. This page allows end users to manage the loading of data. This page can be customized after it is created to meet the needs of your application.

*   Choose your application and click the Create Page button. Then, select Data Loading Page and proceed by clicking Next.

![](https://cdn-images-1.medium.com/max/1600/1*s_0ltMMmFcSTykVHoASNkw.png)

*   Provide all the necessary information. Here, you’ll find an option to select the Data Load Definition. In the Data Load Attributes section, click the dropdown menu next to Data Load and choose your Data Load Definition.

![](https://cdn-images-1.medium.com/max/1600/1*z5p7vUQGK03IRXag5nREEw.png)

*   Data Load Page has been created.

![](https://cdn-images-1.medium.com/max/1600/1*AFTCgu5wn4kpmecco0dZuA.png)

![](https://cdn-images-1.medium.com/max/1600/1*yK4PZkkaCtULds9i4w0_Qw.png)

![](https://cdn-images-1.medium.com/max/1600/1*qIN7UMVn4HJ3Pjo5E8xG-w.png)

*   Click on “Choose File” to upload your Excel sheet, or simply drag and drop it onto the designated area.

![](https://cdn-images-1.medium.com/max/1600/1*s9wS3XxV-mwZIS_OiPxmDw.png)Data Loading Page

*   Click on the “Load” button to import the data, or click on “Clear” to remove the data from the temporary table.

![](https://cdn-images-1.medium.com/max/1600/1*Jxwk57YFWlpladzC7AJTSQ.png)

![](https://cdn-images-1.medium.com/max/1600/1*-7I5qw33SCCu1sKZHd5xpQ.png)

### _I hope this guide was helpful and that you’re excited to dive deeper into the world of Oracle APEX. Keep exploring and learning !!!_