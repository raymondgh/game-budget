exports.handler = function(event, context, callback) {
const https = require('https');

var steamURL = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=XXXXXXXX&steamid=76561198001987954&include_played_free_games=1&format=json";
var stravaURL = "https://www.strava.com/api/v3/athletes/4733270/stats?access_token=XXXXXXXX"
function callSteam() {
  return new Promise(function(resolve, reject) {
    
  https.get(steamURL, (resp) => {
  let data = '';
 
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
 
  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    let steamHours = (JSON.parse(data).response.games.map(x => x.playtime_forever).reduce((a, b) => a + b, 0) / 60).toFixed(2)
    resolve(steamHours)
  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});
}

function callStrava() {
  return new Promise(function(resolve, reject) {
    
  https.get(stravaURL, (resp) => {
  let data = '';
 
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
 
  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    let stravaMiles = (JSON.parse(data).all_run_totals.distance / 1609.344).toFixed(2)
    resolve(stravaMiles);
  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
});
}


function updateBalance() {
  return Promise.all([
    callSteam(),
    callStrava()
  ]).then(function(values) {
      callback(null, values);

  });
}

updateBalance();

};
