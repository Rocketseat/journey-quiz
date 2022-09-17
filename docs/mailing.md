# Mailing

To send mail at the end of the quiz.
The mail body must have be the correct and wrong answers.

## Tools

- Amazon SES
- https://github.com/sofn-xyz/mailing

## TODO

- [x] Install deps
    - [x] `npm install --save mailing mailing-core`
    - [x] `npm install aws-sdk` 
- [x] Configure mailing lib `npx mailing`
- [x] Start preview (development) of mailing `npx mailing preview`
- [x] Configure your email transport and defaultFrom in emails/index.ts. 
- [x] Configure env vars
- [x] test send mail with DefaultOptions
- [x] Create AWS SES Transport
- [] test send mail with AWSSESOptions