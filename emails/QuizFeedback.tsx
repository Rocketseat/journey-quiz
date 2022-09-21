import TextEmail from "./TextEmail";

interface GiveFeedbackProps {
  name: string
}

export function GiveFeedback({ name }: GiveFeedbackProps) {
  return (
    <TextEmail
      headline="Quiz Feedback"
      name={name}
      body={
        <>
          Parabéns por completar o Quiz.
        </>
      }
      ctaText="Complete seu cadastro"
    />
  );
}
