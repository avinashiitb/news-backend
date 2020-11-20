function createRoleFromArray(roleNameArray) {
  return new Promise((resolve, reject) => {
    const saveRoles = roleNameArray.map((roleName) => {
      const newRole = new Parse.Object("_Role");
      newRole.set("name", roleName);

      const aclObj = new Parse.ACL();
      aclObj.setRoleWriteAccess("admin", true);
      aclObj.setRoleReadAccess("admin", true);

      newRole.setACL(aclObj);
      return newRole;
    });
    Parse.Object.saveAll(saveRoles).then((savedRoles) => {
      resolve(savedRoles);
    }, (err) => {
      reject(err);
    });
  });
}

function addUserToRoles(userData, roleArray) {
  return new Promise((resolve, reject) => {
    const promises = [];
    const Role = new Parse.Query(Parse.Role);
    Role.containedIn("name", roleArray);
    Role.find({useMasterKey: true}).then(function (roles) {

      roles.forEach((role) => {
        role.getUsers().add(userData);
        promises.push(role.save(null, {useMasterKey: true}));
      });
      Promise.all(promises)
      .then(result => {
        resolve(promises)
      })
      .catch(error => {
         reject(error);
      });
    });
  });

}

// const Role = new Parse.Query(Parse.Role);
// Role.containedIn("name", roleArray);
// Role.find({useMasterKey: true}).then(function (roles) {
//   return new Promise((resolve, reject) => {
//     const saveRoles = [];
//     roles.forEach((role) => {
//       const newRole = role.getUsers().add(userData);
//       return newRole;
//     });
//     Parse.Object.saveAll(saveRoles).then((savedRoles) => {
//       resolve(savedRoles);
//     }, (err) => {
//       reject(err);
//     });
//   });
// });



// const Role = new Parse.Query(Parse.Role);
// Role.containedIn("name", roleArray);
// Role.find({useMasterKey: true}).then(function (roles) {
//   const promises = [];
//   const promises = roles.map((result) => {
//     // Start this delete immediately and add its promise to the list.
//     role.getUsers().add(userData);
//     return role.save();
//   });
//   // Return a new promise that is resolved when all of the deletes are finished.
//   return Promise.all(promises);
//
// }).then(function() {
//   return true;
// });
// const promises = [];
// const Role = new Parse.Query(Parse.Role);
// Role.containedIn("name", roleArray);
// Role.find({useMasterKey: true}).then(function (roles) {
//
//   const promises = roles.forEach((role) => {
//     role.getUsers().add(userData);
//     return role.save(null, {useMasterKey: true});
//   });
//   Promise.all(promises)
//   .then(result => {
//     console.log(result);
//   })
//   .catch(error => {
//     console.log(error);
//   });
// });

module.exports = {
  createRoleFromArray: createRoleFromArray,
  addUserToRoles: addUserToRoles
};
