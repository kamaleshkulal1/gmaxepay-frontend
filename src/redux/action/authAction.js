import { LOGIN_SUCCESS, LOGOUT, RESTORE_AUTH } from '../actionType/authActionType';

export const loginSuccess = (user, permissions = null) => {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      ...user,
      permissions: permissions || user?.permissions || null,
    },
  };
};
export const logout = () => ({
  type: LOGOUT,
});

export const restoreAuth = () => ({
  type: RESTORE_AUTH,
});
