const express = require('express');
const app = express();
const https = require('https');
const bodyParser = require('body-parser');
const querystring = require('querystring');
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));

app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/pokeinfo', async(req,res)=>{
  res.sendFile(__dirname+'/pokeinfo.html');

});

app.post('/pokeinfo',async (req,res)=>{
   const pokemon= req.body.pokemon;
   const pokeinfo= await fetchinfo('https://pokeapi.co/api/v2/pokemon/'+pokemon+'/');
   const movepromises = await pokeinfo.moves.map( move => fetchinfo(move.move.url));
   const moveinfo= await Promise.all(movepromises);
   res.json({pokeinfo: pokeinfo, moveinfo:moveinfo});
});

function fetchinfo(url){
  return new Promise((resolve,reject)=>{
    let data='';
    https.get(url, (response)=>
    { response.on('data', (chunk)=> data+=chunk);
      response.on('end',()=>
      { try{
         const info= JSON.parse(data);
         resolve(info);
      }
      catch(error){
        reject(error);
      }
      });
    });    
  });
}
app.listen(process.env.PORT || 8080, () => console.log("Server is running on port 8080"));