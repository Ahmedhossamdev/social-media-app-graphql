const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');


module.exports = (context) => {
    // context = { ... headers }
    // console.log(context.req.headers.authorization);
    // console.log("========================")
    const token = context.req.headers.authorization;
    if (token) {
        // Bearer ....
        // const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, process.env.JWT_SECRET);
                return user;
            }
            catch (err) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error("Authentication token must be 'Bearer [token]");
    }
    throw new Error('Authorization header must be provided');
};