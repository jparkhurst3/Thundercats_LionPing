var searchService = require('../service/search.js');

var searchAll = function(req, res) {
  searchService.searchAll(req.query.term).then((results)=>{
    res.statusCode = 200;
    res.send(JSON.stringify(results));
  }).catch((error)=>{
    console.log(error);
    res.statusCode = 500;
    res.end("error");
  })
}

module.exports = {
    searchAll : searchAll
}