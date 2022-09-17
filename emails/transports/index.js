import nodemailer from 'nodemailer'

// Here we can implement the transport options
// We can use Default or another, for eg.: AWSSESOptions
// see more at: https://nodemailer.com/transports/
import { options } from './DefaultOptions'

export const transport = nodemailer.createTransport(options)