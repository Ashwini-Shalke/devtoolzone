const inputArea = document.querySelector(".large-area--input");
const outputArea = document.querySelector(".large-area--output");
const btnFormat = document.querySelector(".controls__button--format");
const btnMinify = document.querySelector(".controls__button--minify");

btnFormat.addEventListener("click", () => {
  try {
    const formatted = JSON.stringify(JSON.parse(inputArea.value), null, 4);
    outputArea.value = formatted;
  } catch (error) {
    // Handle parsing errors..
    console.error("Error parsing JSON:", error);
    outputArea.value = "Invalid JSON input";
  }
});


btnMinify.addEventListener("click", () => {
  try {
    const minified = JSON.stringify(JSON.parse(inputArea.value));
    outputArea.value = minified;
  } catch (error) {
    //Handle parsing errors...
    console.error("Error parsing JSON:", error);
    outputArea.value = "Invalid JSON input";
  }
});

