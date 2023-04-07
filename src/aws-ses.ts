import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION ?? `ap-south-1`,
});
// verify credentials are loaded
AWS.config.getCredentials(function (err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials?.accessKeyId);
    console.log("Secret access key:", AWS.config.credentials?.secretAccessKey);
  }
});
const SES = new AWS.SES({
  apiVersion: "2010-12-01",
  region: process.env.AWS_REGION ?? `ap-south-1`,
});

export const sendTransactionalEmail = async ({
  to,
  from,
  subject,
  body,
}: {
  to: string;
  from?: string;
  subject: string;
  body: string;
}) => {
  const params: AWS.SES.SendEmailRequest = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: from ?? process.env.FROM_EMAIL!,
  };

  const sendPromise = SES.sendEmail(params).promise();

  const data = await sendPromise;
  return data;
};

export const sendBulkTransactionalEmail = async ({
  recipients,
  from,
  subject,
  body,
}: {
  recipients: string[];
  from?: string;
  subject: string;
  body: string;
}) => {
  const params: AWS.SES.SendEmailRequest = {
    Destination: {
      BccAddresses: recipients,
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: from ?? process.env.FROM_EMAIL!,
  };

  const sendPromise = SES.sendEmail(params).promise();

  const data = await sendPromise;
  console.log(data);
  return data;
};
