import { EmailAddress, EmailClient, EmailMessage } from "@azure/communication-email";
import { infoLogger } from "@utils/logger";

const connectionString = "endpoint=https://mailing-service.unitedstates.communication.azure.com/;accesskey=2bBZlMjX3P7nX9dBxA4qaS3w4lSaYERXC96GT34D4x1JZRNtQD5aJQQJ99ALACULyCp3wfdgAAAAAZCSziec";
const client = new EmailClient(connectionString);

interface IEmailContent {
  subject: string,
  plainText: string,
  html: string
  recipients: EmailAddress[]
}

const senderAddress = "DoNotReply@3a9f3f5e-5273-495e-b1cf-890e48711502.azurecomm.net"

// FIX: Write docs
const sendMail = async ({ subject, plainText, html, recipients }: IEmailContent) => {
  infoLogger({ status: 'INFO', message: "sending verification email" })
  const emailMessage: EmailMessage = {
    senderAddress,
    content: {
      subject,
      plainText,
      html
    },
    recipients: {
      to: recipients
    }
  }

  const poller = await client.beginSend(emailMessage)
  await poller.pollUntilDone();
  infoLogger({ status: 'success', message: "mail sent successfully" })

}

async function main() {
  const emailMessage = {
    senderAddress: senderAddress,
    content: {
      subject: "Test Email",
      plainText: "Hello world via email.",
      html: `
			<html>
				<body>
					<h1>Hello world via email.</h1>
				</body>
			</html>`,
    },
    recipients: {
      to: [{ address: "prateeksingh9741@gmail.com" }],
    },

  };

  const poller = await client.beginSend(emailMessage);
  const result = await poller.pollUntilDone();
}

main();
