import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-north-1_02lH3Sz7f",
      userPoolClientId: "55i7f8r208o08o36en23d8bb1j",
      loginWith: {
        email: true,
      },
    },
  },
});