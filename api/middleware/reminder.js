require("dotenv").config();
const Queue = require('bull');
const reminder = new Queue('reminder', process.env.REDIS_URL)
  // Your Auth Token from www.twilio.com/console
var accountSid = "AC8916bf9b44ef5f352455b80e5b0ace8e"; // Your Account SID from www.twilio.com/console
var authToken = "adae08c31a409aabdd8311d1280a31f6"; 
const client = require('twilio')(accountSid, authToken);
var moment = require('moment');


reminder.process(function(job, done){

  const reservation = job.data[0]
  const user = job.data[1]
  // let hour = new Date(reservation.departureTime).getHours();
  // const am_pm = hour >= 12 ? 'pm' : 'am';
  // hour %= 12;
  // const minutes = new Date(reservation.departureTime).getMinutes();
  let date = moment(reservation.departureTime).format("hh:mm A")

  client.messages.create({
    body: `Hello ${user.firstName} ${user.lastName}! Your flight departing for ${date} is ${reservation.flightStatus}, check out www.aa.com/update for more info` ,
    to: `${user.phone}`,  // Text this number
    from: '+19728467640' // From a valid Twilio number 
  })
  .then((message) => console.log(message.sid), done())
  .catch((err) => console.log(err))
  console.log(date);
  done();
});

reminder.on('failed', function (job, result) {
  console.log('failed', result);
})

reminder.on('completed', (job, result) => {
  console.log('Job completed ' + result);
})

reminder.clean(0, 'delayed');
reminder.clean(0, 'wait');
reminder.clean(0, 'active');
reminder.clean(0, 'completed');
reminder.clean(0, 'failed');

let multi = reminder.multi();
multi.del(reminder.toKey('repeat'));
multi.exec();

module.exports ={
  reminder: reminder
}

