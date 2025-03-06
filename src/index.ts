import app from "./app.js";

const port = 12346;

app.listen(port, () => {
  console.log(`Listening on http://localhost: ${port}`);
  console.log(`Time is ${new Date().toLocaleTimeString()}`);
});

// test c
