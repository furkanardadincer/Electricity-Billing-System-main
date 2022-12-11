const http = require('http');
const app = require('./app');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}


// const port = 3001

// app.listen(port, () => {
//     console.log(`Listening app at http://localhost:${port}`);
//   });

const server = http.createServer(app);

server.listen(port, () => {
  console.log("Server started Sucessfully");
});
