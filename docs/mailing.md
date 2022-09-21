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
- [ ] Test send mail with AWSSESOptions
- [ ] Add Rockeseat default mail and name

## Templating mail [ TODO ]
- [-] Mail elements
    - [ ] Branding
        - [ ] Logo
        - [ ] Greetings
        - [ ] Regards
    - [-] Give feedback page
        - [ ] Question (strong), answer (green for correct, red for wrong).
        - [ ] If wrong, show the corret one.
    - [-] Link para completar o cadastro