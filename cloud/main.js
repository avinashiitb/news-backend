Parse.Cloud.define('hello', function(req, res) {
  return 'Hi';
});

const getTopHealines = require("./getTopHealines");
const getNewsByCategory = require("./getNewsByCategory");
const getNewsBySource = require("./getNewsBySource");
const search = require("./search");
// const login = require("./login");
// const getProfile = require("./getProfile");
// const deleteVersion = require("./deleteVersion");
// const addStore = require("./addStore");
// const getStoreType = require("./getStoreType");
// const getStore = require("./getStore");
// const getMyStore = require("./getMyStore");
// const liveOrder = require("./liveOrder");
// const getOrder = require("./getOrder");
// const getBuyer = require("./getBuyer");
// const updatePrice = require("./updatePrice");
// const addOrder = require("./addOrder");
// const getHistory = require("./getHistory");
// const getStoreInfo = require("./getStoreInfo");
// const confirmOrder = require("./confirmOrder");
// const api = require("./api");
// const notification = require("./notification");
// const addNotification = require("./addNotification");
// const test = require("./test");
// const addAddress = require("./addAddress");
