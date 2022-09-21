import { MjmlSection, MjmlColumn, MjmlImage } from "mjml-react";

type HeaderProps = {
  big?: boolean;
};

const Header: React.FC<HeaderProps> = ({ big }) => {
  return (
    <MjmlSection padding={big ? "48px 0 40px" : "48px 0 24px"}>
      <MjmlColumn>
        <MjmlImage
          padding="0 24px 0"
          width={big ? "146px" : "91px"}
          height={big ? "32px" : "20px"}
          align="left"
          src="https://www.rocketseat.com.br/assets/logos/rocketseat.svg"
          cssClass="logo"
        />
      </MjmlColumn>
    </MjmlSection>
  );
};

export default Header;
