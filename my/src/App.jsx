let promise = new Promise(function(resolve, reject){
let success = true;
if(success){
resolve("Data Loaded Successfully");
}
else{
reject("Error Loading Data");
}
});
promise.then(function(result){
console.log(result);
});
promise.catch(function(error){
console.log(error);
});
