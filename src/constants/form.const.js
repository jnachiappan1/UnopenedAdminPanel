export const FormValidationMessages = {
    EMAIL: {
        required: 'Email is required',
        invalid: 'Must be a valid email address',
    },
    BUSINESSNAME: {
        required: 'Business Name is required',
    },
    BUSINESSADDRESS: {
        required: 'Business Address is required',
    },
    MOBILENUMBER: {
        required: 'Mobile Number is required',
    },
    PASSWORD: {
        required: 'Password is required',
        minLength: 8,
        minLengthErrorMessage: 'Password must be min 8 characters, and have 1 Special Character, 1 Uppercase, 1 Number and 1 Lowercase',
        // pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        patternErrorMessage: 'Password must be min 8 characters, and have 1 Special Character, 1 Uppercase, 1 Number and 1 Lowercase'
    },   
    CONFIRM_PASSWORD: {
        required: 'Confirm Password is required',
        minLength: 8,
        minLengthErrorMessage: 'Confirm Password must be min 8 characters, and have 1 Special Character, 1 Uppercase, 1 Number and 1 Lowercase',
        // pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        patternErrorMessage: 'Confirm Password must be min 8 characters, and have 1 Special Character, 1 Uppercase, 1 Number and 1 Lowercase'
    },
}