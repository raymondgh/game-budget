// call both APIs and update html with responses
function updateBalance() {
  return Promise.all([
    callStrava(),
    callSteam(),
  ]).then(function(values) {
    document.getElementById("fitness-value").innerHTML=values[0].toFixed(2);
    document.getElementById("gaming-value").innerHTML=values[1].toFixed(2);
    document.getElementById("balance-value").innerHTML=(values[0] - values[1]).toFixed(2);
  });
}

// call strava api for total miles run
function callStrava() {
  return new Promise(function(resolve, reject) {
    fetch("https://www.strava.com/api/v3/athletes/4733270/stats?access_token=" + stravaToken, {})
    .then(function(response) {
      if (!response.ok) {
        console.log(response);
      } else {
        response.text().then(function(text) {
          user = JSON.parse(text)
          stravaMiles = (user.all_run_totals.distance / 1609.344).toFixed(2) - 67.44
          resolve(stravaMiles)
        });
      };
    }
  ).catch(function(error) {
    console.log(error);
  });
})
}

// call steam api for total hours played
function callSteam() {
  return new Promise(function(resolve, reject) {
    fetch("https://crossorigin.me/http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + steamKey + "&steamid=76561198001987954&include_played_free_games=1&format=json", {})
    .then(function(response) {
      if (!response.ok) {
        console.log(response);
      } else {
        response.text()
        .then(function(text) {
          user = JSON.parse(text)
          steamHours = (user.response.games.map(x => x.playtime_forever).reduce((a, b) => a + b, 0) / 60).toFixed(2) - 1780.47
          resolve(steamHours)
        });

      };
    })
    .catch(function(error) {
      console.log(error);
    });
  })
}
