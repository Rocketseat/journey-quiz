
import sendMail from "../../../emails";
import Welcome from "../../../emails/Welcome";

export default function Mail() {
  sendMail({
    subject: "My First Email",
    to: "maykbrito@gmail.com",
    // cc: "tester+cc@example.com",
    // bcc: ["tester+bcc@example.com", "tester+bcc2@example.com"],
    component: <Welcome name="Amelita" />,
  });
}

