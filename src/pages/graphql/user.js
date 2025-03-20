export const queryLogin = `mutation LoginWithEmail($email: String!, $password: String!) {
    loginWithEmail(email: $email, password: $password) {
      token
      user{
        id
        avatar
        name
        email
      }
    }
}`;

export const queryLoginGG = `mutation Mutation($googleId: String!, $name: String!, $email: String!) {
  loginWithGoogle(googleId: $googleId, name: $name, email: $email) {
    avatar
    email
    name
    id
  }
}`;

export const mutation = `mutation Mutation($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    name
    email
  }
}`;

export const updateUser = `mutation Mutation($updateInfoId: String!) {
  updateInfo(id: $updateInfoId) {
    id
    email
    name
  }
}`;

export const resetPass = `mutation ResetPassword($email: String!) {
  resetPassword(email: $email)
}`;
