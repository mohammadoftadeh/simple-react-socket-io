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
