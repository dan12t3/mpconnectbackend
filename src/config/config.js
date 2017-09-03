let server = 'http://localhost:5000';
let front = 'http://localhost:3000';

if(process.env.NODE_ENV == 'production'){
  server = 'https://mpconnect-backend.herokuapp.com';
  front = 'https://mpconnectapp.herokuapp.com';
}

const config = {
  apiKey: '84f3302b4c6a4c2f3ce6fd4aad2ff99c',
  secret: 'e1b7b1cf4f381e406226b2a68821492b',
  scope: 'read_content, read_products, read_customers,read_reports',
  redirect: server + '/auth/exchange',
  host: server,
  front: front,
  port: 5000,
  JWTsecret: 'smellyfeet321'
}

module.exports = config;
