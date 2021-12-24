# simple-react-socket-io

A simple example of react app with node.js, express.js, socket.io, created to answer a question in stack overflow.

### Stack overflow question:

[Sending data from the client to the server and displaying to the terminal using sockets][2]

[![React and Socket.io with Express in 15 minutes , 2022 🕒 😳](https://github.com/mohammadoftadeh/repo-assets/blob/main/React%20and%20Socket.io%20with%20Express%20in%2015%20minutes%20%2C%202022.png)

**SERVER - BACK-END**

Follow the steps below:

1. The Built-in HTTP Module
   - Node.js has a built-in module called HTTP, which allows Node.js to transfer data over the Hyper Text Transfer Protocol (HTTP). The HTTP module can create an HTTP server that listens to server ports and gives a response back to the client.
   - Use the `createServer()` method to create an HTTP server:

```js
const http = require("http");
const express = require("express");
const app = express();

const server = http.createServer(app);
```

2. Create a utility file with a custom name, here is the name of this `socketUtils.js` :
   - Here we set up the socket with custom configs, and instantiate.

```js
// <root-project-dir>/utils/socketUtils.js

const socketIO = require("socket.io");

exports.sio = (server) => {
  return socketIO(server, {
    transports: ["polling"],
    cors: {
      origin: "*",
    },
  });
};

exports.connection = (io) => {
  io.on("connection", (socket) => {
    console.log("A user is connected");

    socket.on("message", (message) => {
      console.log(`message from ${socket.id} : ${message}`);
    });

    socket.on("disconnect", () => {
      console.log(`socket ${socket.id} disconnected`);
    });
  });
};
```

3. Well now it's time to use the `socketUtils.js` file:

```js
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({
  path: "./config.env",
});

const express = require("express");
const app = express();
const socketUtils = require("./utils/socketUtils");

const server = http.createServer(app);
const io = socketUtils.sio(server);
socketUtils.connection(io);
```

4. Create a socket middleware:
   - To access the socket globally in each request, we create a middleware.

```js
const socketIOMiddleware = (req, res, next) => {
  req.io = io;

  next();
};
```

5. Use the `listen()` method:
   - You can write other middleware according to the priority that exists with the routes you need and then put the `listen()` method at the end.

```js
// CORS
app.use(cors());

// ROUTES
app.use("/api/v1/hello", socketIOMiddleware, (req, res) => {
  req.io.emit("message", `Hello, ${req.originalUrl}`);
  res.send("hello world!");
});

// LISTEN
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
```

**The final file should look like this:**

```js
// <root-project-dir>/index.js

const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({
  path: "./config.env",
});

const express = require("express");
const app = express();
const socketUtils = require("./utils/socketUtils");

const server = http.createServer(app);
const io = socketUtils.sio(server);
socketUtils.connection(io);

const socketIOMiddleware = (req, res, next) => {
  req.io = io;

  next();
};

// CORS
app.use(cors());

// ROUTES
app.use("/api/v1/hello", socketIOMiddleware, (req, res) => {
  req.io.emit("message", `Hello, ${req.originalUrl}`);
  res.send("hello world!");
});

// LISTEN
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
```

> Finally, to test the server, you can use [**SocketIO Client Tool**][1]
> online tool, which is very useful.

---

**CLIENT - FRONT-END**

After setting up the server, you can use it as follows in the React app and emit an event:

```js
import { useEffect, useRef } from "react";
import "./App.css";

import { io } from "socket.io-client";

function App() {
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:9013");

    socket.current.on("connnection", () => {
      console.log("connected to server");
    });
  }, []);

  const handleClick = () => {
    socket.current.emit("message", new Date().getTime());
  };

  return (
    <div className="App">
      <p>Socket.io app</p>

      <button type="button" onClick={handleClick}>
        Emit a time message
      </button>
    </div>
  );
}

export default App;
```

[1]: https://amritb.github.io/socketio-client-tool/
[2]: https://stackoverflow.com/questions/67388378/sending-data-from-the-client-to-the-server-and-displaying-to-the-terminal-using
