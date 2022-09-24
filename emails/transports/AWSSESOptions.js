import aws from 'aws-sdk'

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "us-east-1",
})

export const options = {
  SES: { ses, aws }
}