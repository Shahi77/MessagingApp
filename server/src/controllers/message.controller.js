const asyncHandler = require("../utils/asyncHandler");

//Handle sending message
/*
create a new message object with necessary details like sender, receiver, content, timestamp
Find or create a chat:
    Query the database to check if a chat exists between the sender and receiver.
    If it does, push the new message into the existing chat’s message array.
    If no chat exists, create a new chat document and add the message to it.
Save the chat (whether updated or newly created) back to the database.
 */
const handleSendMessage = asyncHandler(async (req, res) => {});

//Handle fetching messages
/* 
find(Query the database) for chat between sender and receiver
If no chat is found, send an appropriate API response indicating that there is no chat history.
If the chat exists, populate the messages field and send them back to the client.
*/
const handleGetMessage = asyncHandler(async (req, res) => {});

module.exports = { handleSendMessage, handleGetMessage };
