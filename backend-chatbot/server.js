const dialogflow = require("dialogflow");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config({ path: ".env" });
const express = require("express");
const app = express();

const LANGUAGE_CODE = "en-US";
const projectId = process.env.PROJECT_ID;
const sessionId = process.env.SESSION_ID;
const query = "today";

let privateKey = process.env.PRIVATE_KEY;
let clientEmail = process.env.CLIENT_EMAIL;
let config = {
  credentials: {
    private_key: privateKey,
    client_email: clientEmail,
  },
};

sessionClient = new dialogflow.SessionsClient(config);

async function sendTextMessageToDialogFlow(textMessage, sessionId) {
  // Define session path
  const sessionPath = this.sessionClient.sessionPath(projectId, sessionId);
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: textMessage,
        languageCode: LANGUAGE_CODE,
      },
    },
  };
  try {
    let responses = await this.sessionClient.detectIntent(request);
    return Object.values(responses)[0].queryResult.fulfillmentText;
  } catch (err) {
    console.error("DialogFlow.sendTextMessageToDialogFlow ERROR:", err);
    throw err;
  }
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    "Express server listening on port %d in %s mode",
    server.address().port,
    app.settings.env
  );
  sendTextMessageToDialogFlow(query, sessionId);
});

// API for send message to backend
app.post("/api/v1/chat", (req, res) => {
  const message = req.body.message;
  console.log(req.body);
  //Send messaget text to Dialoflow
  sendTextMessageToDialogFlow(message, sessionId).then((aiText) => {
    console.log("Bot reply: " + aiText.toString());
    res.status(200).send(aiText);
  });
});


