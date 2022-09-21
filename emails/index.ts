import { buildSendMail } from "mailing-core";
import { transport } from "./transports";

const sendMail = buildSendMail({
  transport,
  defaultFrom: "oi@rocketseat.com.br",
  configPath: "./mailing.config.json",
});

export default sendMail;
