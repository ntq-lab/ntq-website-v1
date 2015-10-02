'use strict';

module.exports = {
    db: 'mongodb://localhost/mean-dev',
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
        clientID: '544651093698-v8hpj0qni0tqbpekeh8jlusde94mp734.apps.googleusercontent.com',
        clientSecret: 'cou8wkscVcAhdfp2b-A8EEFh',
        callbackURL: 'http://backend.ntq.solutions/oauth/google/callback'
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

