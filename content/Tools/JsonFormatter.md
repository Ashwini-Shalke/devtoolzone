<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE-Edge">
    <meta name="viewport" content="width-device-width", intial-scale=1.0">
    <title>JSON Formatter with JavaScript</title>
    <link rel="stylesheet" href="main.css">
    <script src="main.js" defer></script>
</head>

<body>
    # JSON Formatter
    
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

## CSS

```css
.Title {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 15px; /* Adjust as needed */
    border-radius: 1px;
    border: none;
    outline: none;
    background: #009578;
    color: #ffffff;
    font-weight: bold;
}

.Title p {
    margin: 0;
}

.Title p span {
    font-family: Calibri;
    font-size: 72pt;
}

.Title p span:nth-child(2) {
    letter-spacing: 15.25pt;
}

body {
    margin: 0;
    background: #333333;
}

.container {
    display: grid;
    grid-template-columns: 1fr 100px 1fr;
    align-items: center;
    height: 100vh;
    box-sizing: border-box;
    padding: 20px;
    gap: 20px;
}

.large-area {
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    color: #aaaaaa;
    background: #444444;
    border: none;
    border-radius: 10px;
    outline: none;
    resize: none;
    font-family: monospace;
    font-size: 16px; 
    transition: background 0.25s,color 0.25s;
}

.large-area:hover,
.large-area:focus{
    background: #4a4a4a;
}

.large-area:focus {
    color: #eeeeee;
}

.controls__button{
    padding: 8px 14px;
    width: 100%;
    margin-bottom: 10px;
    border-radius: 5px;
    border: none;
    outline: none;
    cursor: pointer;
    background: #009578;
    color: #ffffff;
    font-weight: bold;
}

.controls__button:active{
    background: #00705a;
}
