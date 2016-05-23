'use strict';

let express = require('express');
let router = express.Router();
let request =  require('request');
let qs = require('querystring');           // query string to parse accessToken.
let User = require('../models/user');
let GITHUB_SECRET = process.env.GITHUB_SECRET;
console.log('GITHUB_SECRET: ', GITHUB_SECRET || 'GITHUB_SECRET= EMPTY');
router.post('/github', (req, res) => {

  let accessTokenUrl='https://github.com/login/oauth/access_token';
  let userApiUrl = 'https://api.github.com/user';
  let headers = {
    'User-Agent' : 'Satellizer'
  };

  let params={
    code          : req.body.code,
    client_id     : req.body.clientId,
    redirect_uri  : req.body.redirectUri,
    client_secret : GITHUB_SECRET
  };

  request.get({ url : accessTokenUrl, qs  : params}, (err, response, tokenBody) => {
    let accessToken = qs.parse(tokenBody);
    // Step 2. Retrieve profile information about the current user.

    request.get({url : userApiUrl, qs : accessToken,headers : headers,json : true}, (err, response, profile) => {
      if(err) return res.status(400).send({ message : 'User not found' });

      User.findOne({github: profile.id }, (err, existingUser) => {
        if(err) return res.status(400).send(err);

        // console.log('existingUser', existingUser);

        if(existingUser){
          let token = existingUser.createToken();
          res.send({ token : token , existingUser : existingUser});
          console.log('existingUser\n',existingUser);
        } else {
          let user = new User();
          user.github = profile.id;
          user.image = profile.avatar_url;
          user.username = profile.login;
          user.name.first = profile.name.split(' ').slice(0, 1);
          user.name.last = profile.name.split(' ').slice(1);

          user.save((err, savedUser) => {
            console.log('user\n', user);
            let token = savedUser.createToken();

            res.cookie('accessToken', data.token).send({token: token});
          });
        };
      });
    });
  });
});

module.exports = router;
