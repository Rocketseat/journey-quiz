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
          Você completou o quiz e seu resultado está pronto!
        </>
      }
      ctaText="Baixar o resultado em PDF"
      ctaLink="#"
    />
  );
}
