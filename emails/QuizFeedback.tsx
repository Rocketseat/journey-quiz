import Head from "./components/Head";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ButtonPrimary from "./components/ButtonPrimary";
import {
  leadingTight,
  leadingRelaxed,
  textBase,
  textLg,
  grayLight,
} from "./components/theme";

import {
  Mjml,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlText,
  MjmlSpacer,
} from "mjml-react";

type QuizFeedbackProps = {
  userName: string;
  quizName: string;
};

const QuizFeedback: React.FC<QuizFeedbackProps> = ({ userName, quizName }) => {
  return (
    <Mjml>
      <Head />
      <MjmlBody width={600}>
        <Header />
        <MjmlSection padding="0 24px 0" cssClass="smooth">
          <MjmlColumn>
            <MjmlText
              padding="24px 0 8px"
              fontSize={textLg}
              lineHeight={leadingTight}
              cssClass="paragraph"
            >
              Quiz Feedback
            </MjmlText>
            <MjmlText
              padding="16px 0 16px"
              fontSize={textBase}
              lineHeight={leadingRelaxed}
              cssClass="paragraph"
            >
              🎉 Parabéns, <strong>{userName}</strong>!
            </MjmlText>
            <MjmlText
              cssClass="paragraph"
              padding="0"
              fontSize={textBase}
              lineHeight={leadingRelaxed}
            >
              <>
                Você completou o quiz e seu relatório está pronto!
              </>
            </MjmlText>
            <MjmlSpacer height="8px" />

            <MjmlText
              cssClass="paragraph"
              padding="0"
              fontSize={textBase}
              lineHeight={leadingRelaxed}
              fontWeight={700}
            >
              <>
                <a href="#" style={{ textDecoration: 'none' }}>
                  &gt;&gt;&gt; Clique aqui para baixar
                </a>
              </>
            </MjmlText>

            <MjmlSpacer height="24px" />

            <MjmlText
              cssClass="paragraph"
              padding="0"
              fontSize={textBase}
              lineHeight={leadingRelaxed}
            >
              <>...E você acaba de ganhar acesso exclusivo a uma <strong>Masterclass de React</strong> (com 1 hora de duração) pra acelerar ainda mais sua evolução.
                <br />
                <br />
                Toque no botão abaixo pra assistir gratuitamente:
              </>
            </MjmlText>

            <MjmlSpacer height="24px" />
            <ButtonPrimary link={"#"} uiText={"ACESSAR MASTERCLASS DE " + quizName} />
            <MjmlSpacer height="24px" />

            <MjmlText
              padding="16px 0"
              fontSize={textBase}
              lineHeight={leadingRelaxed}
              cssClass="paragraph"
            >
              O aprendizado é contínuo, então nunca pare de aprender 🚀
            </MjmlText>

            <MjmlSpacer height="24px" />

            <MjmlText
              padding="16px 0"
              fontSize={textBase}
              lineHeight={leadingRelaxed}
              cssClass="paragraph"
            >
              ♥ Rocketseat
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <Footer />
      </MjmlBody>
    </Mjml>
  );
};

export default QuizFeedback;
