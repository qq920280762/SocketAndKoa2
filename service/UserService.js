const BaseOrm = require('./BaseOrm');

class UserService extends BaseOrm {
    constructor(){
        super("user");
    };
}

module.exports = UserService;