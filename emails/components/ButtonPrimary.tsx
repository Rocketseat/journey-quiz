import { MjmlButton } from "mjml-react";
import { black, grayLight, purple, textSm } from "./theme";
import { leadingTight, textBase, borderBase } from "./theme";

type ButtonPrimaryProps = {
  link: string;
  uiText: string;
  height?: number;
  backgroundColor?: string;
};

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ link, uiText, height, backgroundColor }) => {
  return (
    <>
      <MjmlButton
        lineHeight={leadingTight}
        fontSize={textBase}
        height={height || 52}
        padding="0"
        align="left"
        href={link}
        backgroundColor={black}
        borderRadius={borderBase}
        textTransform="uppercase"
        fontWeight={700}
        cssClass="light-mode"
      >
        {uiText}
      </MjmlButton>
      <MjmlButton
        lineHeight={leadingTight}
        fontSize={textSm}
        height={height || 52}
        padding="0"
        align="left"
        href={link}
        backgroundColor={backgroundColor || purple}
        borderRadius={borderBase}
        textTransform="uppercase"
        fontWeight={700}
        cssClass="dark-mode"
      >
        {uiText}
      </MjmlButton>
    </>
  );
};

export default ButtonPrimary;
