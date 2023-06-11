const UserSuccess = {
  SUCCESS_DELETING_USER: 'Success deleting user',
  SUCCESS_CHANGING_USER_EMAIL: 'Success changing user email',
};

const UserErrors = {
  FAIL_CREATING_USER: 'Fail creating user',
  FAIL_UPDATING_USER: 'Fail updating user',
  FAIL_SEARCHING_USER: 'Fail searching users',
  FAIL_SEARCHING_USER_BY_ID: 'Fail searching user by Id',
  FAIL_SEARCHING_USER_BY_NAME: 'Fail searching user by Name',
  FAIL_DELETING_USER: 'Fail deleting user',
  FAIL_MATCHING_PASSWORDS: `Fail matching passwords`,
  FAIL_REGISTRERING_USER: `Fail registering user`,
  FAIL_CHANGING_USER_EMAIL: 'Fail changing user email',
  FAIL_LOGIN_PASSWORD: 'Wrong password, please try again',
  FAIL_LOGIN_EMAIL: 'Wrong email address, please try again', 
};

const MobileDevErrors = {
  FAIL_CREATING_MOBILEDEV: 'Fail creating mobile dev',
  FAIL_UPDATING_MOBILEDEV: 'Fail updating mobile dev',
  FAIL_SEARCHING_MOBILEDEV: 'Fail searching mobile dev',
  FAIL_SEARCHING_MOBILEDEV_BY_ID: 'Fail searching mobile dev by Id',
  FAIL_SEARCHING_MOBILEDEV_BY_NAME: 'Fail searching mobile dev by Name',
  FAIL_DELETING_MOBILEDEV: 'Fail deleting mobile dev',
};

const MobileDevSuccess = {
  SUCCESS_DELETING_MOBILEDEV: 'Success deleting mobile dev',
  SUCCESS_UPDATING_MOBILEDEV: 'Success updating mobile dev', //Añadida recientemente por J
};

const AppErrors = {
  FAIL_UPDATING_APP: 'Fail updating app',
  FAIL_CREATING_APP: 'Fail creating app',
  FAIL_SEARCHING_APP: 'Fail searchinng app',
  FAIL_SEARCHING_APP_BY_ID: 'Fail searching app by Id',
  FAIL_SEARCHING_APP_BY_NAME: 'Fail searching app by AppName',
  FAIL_DELETING_APP: 'Fail deleting app',
  FAIL_DELETING_APP_TEST: 'Fail deleting app at test',
};

const AppSuccess = {
  SUCCESS_UPDATING_APP: 'Success updating app',
  SUCCESS_DELETING_APP: 'Success deleting app',
};

module.exports.UserSuccess = UserSuccess;
module.exports.UserErrors = UserErrors;
module.exports.MobileDevErrors = MobileDevErrors;
module.exports.MobileDevSuccess = MobileDevSuccess;
module.exports.AppErrors = AppErrors;
module.exports.AppSuccess = AppSuccess;
