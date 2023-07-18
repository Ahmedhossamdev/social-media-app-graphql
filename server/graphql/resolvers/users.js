const User = require("../../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');
// _ refer to parent
// args refer to register input
const {validateRegisterInput, validateLoginInput} = require('../../util/validators')


function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
    }, process.env.JWT_SECRET, {expiresIn: '1h'});

}

module.exports = {


    Mutation: {
        async login(_, {username, password}) {
            const {errors, valid} = validateLoginInput(username, password);
            const user = await User.findOne({username});

            if (!valid){
                throw new UserInputError('Wrong credentials' , {errors});
            }

            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', {errors});
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', {errors});
            }
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            };

        },

        async register(_, {registerInput: {username, email, password, confirmPassword}}) {
            // TODO Validate user data
            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', {errors});
            }
            // TODO Make sure user doesn't already exist
            const user = await User.findOne({username});

            if (user) {
                throw new UserInputError('User already exists', {
                    errors: {
                        username: 'This username is taken,'
                    }
                });
            }

            // hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                confirmPassword,
                createdAt: new Date().toISOString(),
            });
            const res = await newUser.save();
            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
}