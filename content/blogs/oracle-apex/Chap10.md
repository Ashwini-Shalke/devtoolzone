+++
title = 'Adding a Custom Button with Delete Functionality — Oracle APEX Interactive Grid'
date = 2024-08-09
draft = false
author = "Ashwini Shalke"
weight = 10
tags = ["Oracle", "APEX", "Beginners","Low-Code","Custom Button"]
+++



To begin, let’s familiarize ourselves with the layout of the Interactive Grid toolbar. The toolbar is divided into seven distinct sections, each serving a specific function. Understanding this layout is crucial as we’ll use it to strategically assign our custom buttons. Here’s an overview of these sections:

![](https://cdn-images-1.medium.com/max/2400/1*pDr9amyN2_tF0ojIT9ScGw.png)

![](https://cdn-images-1.medium.com/max/1600/1*4CNZQJ3THSyU9p2F1wCH7w.png)

![](https://cdn-images-1.medium.com/max/2600/1*c29oG2SCJTP0-jF2TKp3cQ.png)

### Step by step guide :

Navigate to your Oracle APEX application and locate the page containing the Interactive Grid where you want to add the custom button.

#### **1\. Enable Edit and Delete Options**

*   Click on the Interactive Grid region to select it.
*   In the “Properties” pane, find and enable the following options under the “Attributes” section:
*   **Edit**: Set to “Enabled” to allow users to edit rows directly in the grid.
*   **Delete Row**: Set to “Enabled” to allow users to delete selected rows from the grid.

![](https://cdn-images-1.medium.com/max/2400/1*t7J7tRQlUENZKY8iXxcOnQ.png)

_These settings ensure that users can interact with data effectively within the grid._

#### **2\. Add Custom JavaScript Code**

Navigate to the “Advanced” section under the Interactive Grid region’s attributes. Here’s where we’ll write JavaScript code to add a custom button to the toolbar:

![](https://cdn-images-1.medium.com/max/2400/1*EoTFbt7XIUcNWRr2aWxD6g.png)

function(config) {
    let $ = apex.jQuery; // Utilize jQuery provided by APEX for ease of DOM manipulation

    // Copy the default toolbar configuration to customize it
    let toolbarData = $.apex.interactiveGrid.copyDefaultToolbar();

    // Find the toolbar group where you want to add your custom controls
    let toolbarGroup = toolbarData.toolbarFind("actions3");

    // Define properties for your custom button and add it to the toolbar controls
    toolbarGroup.controls.push({
        type: "BUTTON",
        id: "customDeleteButton",
        label: "Delete",
        icon: false, // Set to true and specify an icon class to display an icon
        iconBeforeLabel: true,
        disabled: false,
        action: "selection-delete" // Specify the action to perform on click, such as deleting selected rows
    });

    // Update the configuration with the modified toolbar data
    config.toolbarData = toolbarData;

    // Return the updated configuration object
    return config;
}

*   **_Function Definition_**_: The code begins with a JavaScript function that takes a_ `_config_` _parameter. This function initialises the configuration for the Interactive Grid._
*   **_Toolbar Customization_**_: Using_ `_$.apex.interactiveGrid.copyDefaultToolbar()_`_, we copy the default toolbar configuration. This allows us to customize the toolbar without affecting the original settings._
*   **_Adding a Custom Button_**_: We find the specific toolbar group (_`_"actions3"_`_) where we want to add our custom button. Properties like_ `_type_`_,_ `_id_`_,_ `_label_`_, and_ `_action_` _are defined for the button. Here,_ `_action: "selection-delete"_` _specifies that clicking the button will perform a delete action on selected rows._
*   **_Updating Configuration_**_: We update_ `_config.toolbarData_` _with our modified toolbar configuration to ensure the custom button appears in the Interactive Grid._
*   **_Updating Configuration_**_: We update_ `_config.toolbarData_` _with our modified toolbar configuration to ensure the custom button appears in the Interactive Grid._
*   **_Enabling Features_**_: To enable edit and delete functionalities within the grid, we configure_ `_config.features_`_:_

_By following this guide, you’ve learned how to incorporate a custom button while ensuring delete capabilities are readily available within the grid._

_Happy developing!_

###