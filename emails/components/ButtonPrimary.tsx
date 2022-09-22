import { MjmlButton } from "mjml-react";
import { black, grayLight, purple, textSm } from "./theme";
import { leadingTight, textBase, borderBase } from "./theme";

type ButtonPrimaryProps = {
  link: string;
  uiText: string;
};

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ link, uiText }) => {
  return (
    <>
      <MjmlButton
        lineHeight={leadingTight}
        fontSize={textBase}
        height={52}
        padding="0"
        align="left"
        href={link}
        backgroundColor={black}
        borderRadius={borderBase}
        cssClass="light-mode"
      >
        {uiText}
      </MjmlButton>
      <MjmlButton
        lineHeight={leadingTight}
        fontSize={textSm}
        height={24}
        padding="0"
        align="left"
        href={link}
        backgroundColor={purple}
        borderRadius={borderBase}
        cssClass="dark-mode"
      >
        {uiText}
      </MjmlButton>
    </>
  );
};

export default ButtonPrimary;
