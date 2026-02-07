
const https = require('https');

const url = 'https://shfhvlogmkfnqxcuumfl.supabase.co/rest/v1/';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoZmh2bG9nbWtmbnF4Y3V1bWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MjM4NDksImV4cCI6MjA4MDk5OTg0OX0.ialrVY_ntBQ6vKkB5RxyyKXbAQSRMTM3fCKS2MYgM5o';

console.log(`Checking connection to: ${url}`);

const options = {
  headers: {
    'apikey': anonKey,
    'Authorization': `Bearer ${anonKey}`
  }
};

https.get(url, options, (res) => {
  console.log(`StatusCode: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  res.on('data', (d) => {
    process.stdout.write(d);
  });
}).on('error', (e) => {
  console.error(`Error: ${e.message}`);
});
