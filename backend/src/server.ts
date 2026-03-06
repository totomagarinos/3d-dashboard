import app from "./app";

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Server is running on port ${port}`);
});

export default server;
