const {
    check
} = require('express-validator');

exports.validSign = [
    check('firstname', 'FirstName is required').notEmpty()
    .isLength({
        min:4,
        max:32
    }).withMessage('firstname must be between 3 to 32 characters'),
    check('lastname', 'LastName is required').notEmpty()
    .isLength({
        min:4,
        max:32
    }).withMessage('lastname must be between 3 to 32 characters'),
    check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
    check('password', 'password is required').notEmpty(),
    check('password').isLength({
        min: 6
    }).withMessage('Password must contain atleast 6 characters').matches(/\d/).withMessage('Password must contain a number')
]

exports.validLogin = [
    check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
    check('password', 'Password is required').notEmpty(),
    check('password').isLength({
        min:6
    }).withMessage('Password must contain atleast 6 characters').matches(/\d/).withMessage('Password must contain a number')
]

exports.forgotPasswordValidator = [
    check('email')
        .not()
        .isEmpty()
        .isEmail()
        .withMessage('Must be a valid email address')
];

exports.resetPasswordValidator = [
    check('newPassword')
        .not()
        .isEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must be at least  6 characters long')
];