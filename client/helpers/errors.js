Errors = new Mongo.Collection(null);

throwError = function(message, type) {
  Errors.insert({message: message, type: type})
};
    
