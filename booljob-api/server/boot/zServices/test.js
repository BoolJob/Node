var loopback = require('loopback');

module.exports = function(app) {
    //get User model from the express app
    var UserModel = app.models.User;

    app.post('/login', function(req, res) {

        console.log(req.body);
        //parse user credentials from request body
        const userCredentials = {
            "username": req.body.username,
            "password": req.body.password
        }

        UserModel.findOne({
            "where": {
                "username": userCredentials.username
            }
        }, function(err, user) {

            // Custom Login - Put the stored procedure call here 

            if (err) {
                //custom logger
                console.error(err);
                res.status(401).json({
                    "error": "login failed"
                });
                return;
            }

            // Create the accesstoken and return the Token
            user.createAccessToken(5000, function(err, token) {
                console.log(token)
                res.json({
                    "token": result.id,
                    "ttl": result.ttl
                });
            })
        })
    });
}