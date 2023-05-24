const UserSuccess = {
  SUCCESS_DELETING_USER: 'Success deleting user',
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
};

const MovieErrors = {
  FAIL_CREATING_MOVIE: 'Fail creating movie',
  FAIL_UPDATING_MOVIE: 'Fail updating movie',
  FAIL_SEARCHING_MOVIES: 'Fail searchinng movies',
  FAIL_SEARCHING_MOVIE_BY_ID: 'Fail searching movie by Id',
  FAIL_SEARCHING_MOVIE_BY_NAME: 'Fail searching movie by Name',
  FAIL_DELETING_MOVIE: 'Fail deleting movie',
};

const MovieSuccess = {
  SUCCESS_DELETING_MOVIE: 'Success deleting movie',
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

const CharacterErrors = {
  FAIL_UPDATING_CHARACTER: 'Fail updating character',
  FAIL_CREATING_CHARACTER: 'Fail creating character',
  FAIL_SEARCHING_CHARACTERS: 'Fail searching characters',
  FAIL_SEARCHING_CHARACTER_BY_ID: 'Fail searching character by Id',
  FAIL_SEARCHING_CHARACTER_BY_NAME: 'Fail searching character by Name',
  FAIL_DELETING_CHARACTER: 'Fail deleting characer',
};

const CharacterSuccess = {
  SUCCESS_UPDATING_CHARACTER: 'Success updating character',
};

module.exports.UserSuccess = UserSuccess;
module.exports.UserErrors = UserErrors;
module.exports.MovieErrors = MovieErrors;
module.exports.MovieSuccess = MovieSuccess;
module.exports.MobileDevErrors = MobileDevErrors;
module.exports.MobileDevSuccess = MobileDevSuccess;
module.exports.CharacterErrors = CharacterErrors;
module.exports.CharacterSuccess = CharacterSuccess;
module.exports.AppErrors = AppErrors;
module.exports.AppSuccess = AppSuccess;
