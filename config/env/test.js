'use strict';

module.exports = {
    db: 'mongodb://localhost/ntq-website',
    app: {
        name: 'NTQ SOLUTION'
    },
    // facebook: {
    //     clientID: 'APP_ID',
    //     clientSecret: 'APP_SECRET',
    //     callbackURL: 'http://localhost:3000/auth/facebook/callback'
    // },
    // twitter: {
    //     clientID: 'CONSUMER_KEY',
    //     clientSecret: 'CONSUMER_SECRET',
    //     callbackURL: 'http://localhost:3000/auth/twitter/callback'
    // },
    // github: {
    //     clientID: 'APP_ID',
    //     clientSecret: 'APP_SECRET',
    //     callbackURL: 'http://localhost:3000/auth/github/callback'
    // },
    google: {
        clientID: '544651093698-6v5n2hrr47sbucpfhvlfplspjomotm00.apps.googleusercontent.com',
        clientSecret: 'g9faHSfY-rjYX_USVp0KyJKT',
        callbackURL: 'http://ntq.com/oauth/google/callback'
    },
    // linkedin: {
    //     clientID: 'API_KEY',
    //     clientSecret: 'SECRET_KEY',
    //     callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    // },
    // emailFrom : 'SENDER EMAIL ADDRESS', // sender address like ABC <abc@example.com>
    // mailer: {
    //     service: 'SERVICE_PROVIDER',
    //     auth: {
    //         user: 'EMAIL_ID',
    //         pass: 'PASSWORD'
    //     }
    // }
};
