const nodemailer = require('nodemailer')

// Step1: create transporter
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL
    },
    from: 'hoangdev161201@gmail.com',
    port: 465,
    secure: true,
})

// Step2: config email to send
let mailOptions = ({email, url})=> ({
    from: `"Website hoang huy trong " <${process.env.USER_EMAIL}>`, 
      to: email, 
      subject: "Reset your password", 
      text: "click active token to reset password", 
      html: `<div style='position: relative'></div><div style='padding: 30px; border: 3px solid #07456F; border-radius: 10px; max-width: 400px; position: absolute; top: 50%; left: 50% ; margin: auto'><h1 style='padding-bottom: 30px; color: black'>Resset password:</h1><a href='${url}' style='text-decoration: none ; cursor: pointer; text-align: center;background: #009F9D; padding: 15px; color: white; cursor: pointer; font-size: 16px; border-radius: 5px;  margin-left: 28%'>Reset your password</a><p style='margin-top: 45px; color: black'>If this button can not active, you can click link below:</p><a href='${url}'>${url}</a></div>`
})

module.exports = async function({email, url}) {
    await transporter.sendMail(mailOptions({email, url}), (err)=> {
        if(err) return console.log('send mail false')
        return console.log('send mail success') 
    })
}