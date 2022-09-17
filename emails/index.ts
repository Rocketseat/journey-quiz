import { buildSendMail } from "mailing-core";
import { transport } from "./transports";

const sendMail = buildSendMail({
  transport,
  defaultFrom: "maykrbrito@gmail.com",
  configPath: "./mailing.config.json",
});

export default sendMail;
