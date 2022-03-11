const nodemailer = require('nodemailer')
const {google} = require('googleapis')

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_url = 'https://developers.google.com/oauthplayground'
const refreshToken = process.env.REFRESH_TOKEN_EMAIL


const oauth2Client = new google.auth.OAuth2({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_url
})

oauth2Client.setCredentials({
    refresh_token: refreshToken
})


module.exports = async function({email, subject, text, html}) {
    const accessToken = await oauth2Client.getAccessToken()

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.USER_EMAIL,
            clientId: client_id,
            clientSecret: client_secret,
            refreshToken: refreshToken,
            accessToken
        },
        from: 'hoangdev161201@gmail.com',
        port: 465,
        secure: true,
    })


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
