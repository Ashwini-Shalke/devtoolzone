
---
title: "JSON Formatter"
type: "custom"
---

{{< rawhtml >}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE-Edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSON Formatter with JavaScript</title>
    <link rel="stylesheet" href="jsonFormatter.css">
    <script src="jsonFormatter.js" defer></script>
</head>

<body>
    <div class="Title">
        <h1>JSON <span> </span> Formatter</h1>
    </div>
    <div class="container">
        <textarea class="large-area large-area--input" placeholder="Enter your JSON here..">
            {"name": "Dom"}
        </textarea>
        <div class="controls">
            <button type="button" class="controls__button controls__button--format">Format</button>
            <button type="button" class="controls__button controls__button--minify">Minify</button>
        </div>
        <textarea readonly class="large-area large-area--output" placeholder="Your JSON will appear here"></textarea>
    </div>
</body>
</html>
{{< /rawhtml >}}
