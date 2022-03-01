const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL
    },
    from: 'hoangdev161201@gmail.com',
    port: 465,
    secure: true,
})

module.exports = async function({email, subject, text, html}) {
    await transporter.sendMail({
        from: `"Entership Web" <${process.env.USER_EMAIL}>`,
        to: email,
        subject,
        text,
        html,

    }, (err)=> {
        if(err) return console.log('send mail false')
        return console.log('send mail success') 
    })
}
