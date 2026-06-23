async function message() {
    return "data received";
}

message().then(function(result) {
    console.log(result);
});