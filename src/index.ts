import "./configEnvironment";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { sendBulkTransactionalEmail, sendTransactionalEmail } from "./aws-ses";

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// health check
app.get("/", (req: Request, res: Response) => {
  return res.sendStatus(200);
});

// Transactional email endpoint (one to one)
app.post("/send-email", async (req: Request, res: Response) => {
  try {
    const { to, subject, body } = req.body;
    // input validation
    if (!to || !subject || !body) {
      return res.status(400).send("Invalid input");
    }
    const data = await sendTransactionalEmail({ to, subject, body });

    console.log(`⚡️[aws]:`, data);
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// Marketing email endpoint (one to many)
app.post("/send-bulk-email", async (req: Request, res: Response) => {
  try {
    const { recipients, subject, body } = req.body;
    // input validation
    if (!recipients || !subject || !body) {
      return res.status(400).send("Invalid input");
    }
    const data = await sendBulkTransactionalEmail({
      recipients,
      subject,
      body,
    });
    console.log(`⚡️[aws]:`, data);
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
