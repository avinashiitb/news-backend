Parse.Cloud.define('GetHistory', (request, response) => {
  console.log("Get History", request.params);

  const params = request.params;
  const currentUser = request.user;
  let customerId = ""

  if(params.customerId){
    customerId = params.customerId;
  } else{
    customerId = currentUser.id
  }

  console.log("customer ID ", customerId);
  const opt = {
    sessionToken: request.user.getSessionToken()
  };

  const store = new Parse.Object("StoreDetails");
  store.id = params.storeId;

  const UserList = new Parse.Object("_User");
  UserList.id = customerId;

	var query = new Parse.Query("Order");
  query.include("customer");
  query.equalTo("customer", UserList);
  query.include("store");
  query.descending("createdAt");
	query.find(opt).then( orderData => {
    console.log(orderData);
    const returnArray = [];
    orderData.forEach(item => {
      // historyList.push(data.toJSON());
      const returnObj = {
        "objectId": item.id,
        "customer": item.get("customer").toJSON(),
        "store": item.get("store").toJSON(),
        "totalCost": item.get("totalCost"),
        "quantity": item.get("quantity"),
        "status": item.get("status"),
        "createdAt": item.get("createdAt"),
        "updatedAt": item.get("updatedAt")
      };
      returnArray.push(returnObj);
    });
    response.success(returnArray);
	}).catch( (error) => {
    console.log(error);
	});
});
