Parse.Cloud.define('TopHeadlines', (request, response) => {
    const fetch = require('node-fetch');
    let url = "http://newsapi.org/v2/top-headlines?country=gb&apiKey=4fa772c7e06049f4b248178d46cd92a5";
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          console.log("Result", result);
          response.success(result.articles)
        },
        (error) => {
          response.error(error);
        }
      )
});
