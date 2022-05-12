export interface AccountLoginResponse {
  responseMessage: string;
  accountUuid: string;
  username: string;
  email: string;
  phoneNumber: string;
  accountRole: string;
  lastLogin: string;
  token: {
    token: string;
  }
}
