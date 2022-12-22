


const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors()); 



var terminal_operation_router = require("./birkeland_router/terminal_operation_router/terminal_operation_router");
app.use('/terminal',terminal_operation_router);

app.get("/",(req,res)=>{

    res.status(200).send({success:true, message : "Balances of Statoshi API endpoint is running"});
  });

  const port = 9990;
  
  app.listen(port, () => 
{
    console.log('Running on port ' + port);
});

module.exports = app;