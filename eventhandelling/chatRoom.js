// Import the EventEmitter class from the 'events' module
const EventEmitter = require("events");

// Create a ChatRoom class that extends EventEmitter
class ChatRoom extends EventEmitter {
  constructor() {
    super(); // Call the parent constructor
    this.users = new Set(); // Track users in the room using a Set

    // Handle the 'join' event
    this.on("join", (username) => {
      this.users.add(username); // Add user to the Set
      console.log(`${username} joined the room`);
      // Notify everyone in the room via a system message
      this.emit("message", { from: "System", text: `${username} has joined!` });
    });

    // Handle the 'message' event
    this.on("message", ({ from, text }) => {
      console.log(`[${from}]: ${text}`); // Log the message to the console
    });

    // Handle the 'leave' event
    this.on("leave", (username) => {
      this.users.delete(username); // Remove user from the Set
      console.log(`${username} left the room`);
      // Notify everyone in the room via a system message
      this.emit("message", { from: "System", text: `${username} has left!` });
    });
  }

  // Method to trigger a user joining
  join(username) {
    this.emit("join", username);
  }

  // Method to trigger sending a message
  sendMessage(from, text) {
    this.emit("message", { from, text });
  }

  // Method to trigger a user leaving
  leave(username) {
    this.emit("leave", username);
  }
}

// Create an instance of the ChatRoom
const chatRoom = new ChatRoom();

// Simulate a chat scenario
chatRoom.join("Alice"); // Alice joins the room
chatRoom.sendMessage("Alice", "Hello everyone!"); // Alice sends a message
chatRoom.join("Bob"); // Bob joins the room
chatRoom.sendMessage("Bob", "Hey Alice!"); // Bob sends a message
chatRoom.leave("Alice"); // Alice leaves the room
