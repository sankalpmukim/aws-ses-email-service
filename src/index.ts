import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { sendBulkTransactionalEmail, sendTransactionalEmail } from "./aws-ses";

export const sendEmail: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { to, subject, body } = JSON.parse(event.body || "{}");

    if (!to || !subject || !body) {
      return {
        statusCode: 400,
        body: "Invalid input",
      };
    }

    const data = await sendTransactionalEmail({ to, subject, body });
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};

export const sendBulkEmail: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { recipients, subject, body } = JSON.parse(event.body || "{}");

    if (!recipients || !subject || !body) {
      return {
        statusCode: 400,
        body: "Invalid input",
      };
    }

    const data = await sendBulkTransactionalEmail({
      recipients,
      subject,
      body,
    });
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
