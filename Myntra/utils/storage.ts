import * as SecureStore from "expo-secure-store";

export const saveUserData = async (
  _id: string,
  name: string,
  email: string,
  token: string
) => {
  await Promise.all([
    SecureStore.setItemAsync("userid", _id),
    SecureStore.setItemAsync("userName", name),
    SecureStore.setItemAsync("userEmail", email),
    SecureStore.setItemAsync("userToken", token),
  ]);
};

export const getUserData = async () => {
  const _id = await SecureStore.getItemAsync("userid");
  const name = await SecureStore.getItemAsync("userName");
  const email = await SecureStore.getItemAsync("userEmail");
  const token = await SecureStore.getItemAsync("userToken");

  return { _id, name, email, token };
};

export const clearUserData = async () => {
  await SecureStore.deleteItemAsync("userid");
  await SecureStore.deleteItemAsync("userName");
  await SecureStore.deleteItemAsync("userEmail");
  await SecureStore.deleteItemAsync("userToken");
};