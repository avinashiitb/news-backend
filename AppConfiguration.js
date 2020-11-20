/*global module */
var AppConfig = {
  LOCALHOST: {
    databaseUri: "mongodb+srv://project:avinash1992@cluster0-egtfo.mongodb.net/socialApp?retryWrites=false&w=majority",
    appId: "myAppId",
    masterKey: "master",
    serverUrl: "https://test.hopperstores.com/parse",
    port: 8081
  },
  PRODUCTION: {
    databaseUri: "mongodb+srv://project:avinash1992@cluster0-egtfo.mongodb.net/hopperStore-Prod?retryWrites=false&w=majority",
    appId: "myAppId",
    masterKey: "master",
    serverUrl: "https://prod.hopperstores.com/parse",
    port: 8081
  }
};

var dashboard =
{
  apps: [
    {
      appId: AppConfig.LOCALHOST.appId,
      serverURL: AppConfig.LOCALHOST.serverUrl,
      masterKey: AppConfig.LOCALHOST.masterKey,
      appName: "Localhost",
      iconsFolder: ""
    },
    {
      appId: AppConfig.PRODUCTION.appId,
      serverURL: AppConfig.PRODUCTION.serverUrl,
      masterKey: AppConfig.PRODUCTION.masterKey,
      appName: "Production",
      iconsFolder: ""
    }
  ],
  iconsFolder: null,
  users: [
    {
      user: "rollingbanners",
      pass: "Banners@321"
    }
  ]
};

module.exports = {
  serverConfig: AppConfig,
  dashboardConfig: dashboard
};
