import sendMail from "../../../emails";
import QuizFeedback from "../../../emails/QuizFeedback";

export default function Mail() {
  sendMail({
    subject: "My First Email",
    to: "maykbrito@gmail.com",
    component: <QuizFeedback userName="Mayk Brito" quizName="React" />,
  });
}