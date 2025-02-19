import app from "./app";

const port = 12346;

app.listen(port, () => {
  console.log(`Listening on http://localhost: ${port}`);
});
