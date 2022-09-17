export const options = {
    pool: true,
    host: process.env.MAILING_HOST || "smtp.example.com",
    port: process.env.MAILING_PORT || 465,
    secure: true, // use TLS
    auth: {
        user: process.env.MAILING_USER,
        pass: process.env.MAILING_PASS,
    },
}