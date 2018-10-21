require("dotenv").config();
const Queue = require('bull');
const reminder = new Queue('reminder queue', process.env.REDIS_URL)

reminder.process(async function(job, data){
  console.log(data)
});

reminder.on('completed', (job, result) => {
  console.log(`Job completed with result ${result}`);
})

module.exports ={
  reminder: reminder
}

