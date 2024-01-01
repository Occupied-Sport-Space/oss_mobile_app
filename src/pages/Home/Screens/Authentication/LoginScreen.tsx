import React, { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { homeNativeStackRouteState, userState } from '../../../../state/atoms';
import Input from '../../../../components/Input';
import { StorageKeys, getItem, setItem } from '../../../../utils/asyncStorage';
import { getLogin, getRegister } from '../../../../utils/rest';

const errorCodes = {
  INVALID_CREDENTIALS: 'Invalid credentials!',
  USER_ALREADY_EXISTS: 'User already exists!',
};

const LoginScreen = () => {
  const [_, setHomeRoute] = useRecoilState(homeNativeStackRouteState);
  const [user, setUser] = useRecoilState(userState);
  const [login, setLogin] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseErr, setError] = useState('');
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    name: '',
    passwordConfirm: '',
    errors: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
    },
  });
  const { email, password, name, errors, passwordConfirm } = useMemo(
    () => formState,
    [formState]
  );

  const resetErrors = () =>
    setFormState({
      ...formState,
      errors: {
        email: '',
        name: '',
        password: '',
        passwordConfirm: '',
      },
    });

  const handleError = ({
    response: {
      data: { error },
    },
  }: any) => {
    resetErrors();
    setError(errorCodes[error] || error);
  };

  const handleSubmit = () => {
    setLoading(true);
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

    if (!emailRegex.test(email)) {
      setLoading(false);
      return setFormState({
        ...formState,
        errors: {
          email: "Your email isn't formatted correctly!",
          password: errors.password,
          passwordConfirm: errors.passwordConfirm,
          name: errors.name,
        },
      });
    } else if (!name && !login) {
      setLoading(false);
      return setFormState({
        ...formState,
        errors: {
          email: errors.email,
          password: errors.password,
          passwordConfirm: errors.passwordConfirm,
          name: 'Required!',
        },
      });
    } else if (!passwordRegex.test(password) && !login) {
      setLoading(false);
      return setFormState({
        ...formState,
        errors: {
          email: errors.email,
          name: errors.name,
          passwordConfirm: errors.passwordConfirm,
          password:
            'Password must include an uppercase letter, a number, a special character and should be at least 8 characters long!',
        },
      });
    } else if (password !== passwordConfirm && !login) {
      setLoading(false);
      return setFormState({
        ...formState,
        errors: {
          email: errors.email,
          name: errors.name,
          passwordConfirm: 'Passwords must match!',
          password: 'Passwords must match!',
        },
      });
    }

    if (login) {
      getLogin(email, password)
        .then(({ data }) => {
          setUser(data);
          setItem(StorageKeys.USER, JSON.stringify({ email, password }));
        })
        .catch(handleError)
        .finally(() => setLoading(false));
    } else {
      getRegister(name, password, email)
        .then(({ data }) => {
          setUser(data);
          setItem(StorageKeys.USER, JSON.stringify({ email, password }));
        })
        .catch(handleError)
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    setHomeRoute('MainHome');
    getItem(StorageKeys.USER).then((data) => data && setLocalUser(data));
  }, []);

  if (user || localUser)
    return (
      <View className="bg-black h-full flex justify-center items-center">
        <Text className="text-white text-xl">Loading...</Text>
      </View>
    );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="bg-black w-[100vw] h-[100vh] flex items-center justify-center"
    >
      <Text className="text-white text-3xl mt-3">
        Welcome to <Text className="text-blue-400">OSS</Text>
      </Text>
      <Card className="mt-3 w-[85%]">
        <Card.Content>
          <View className="flex flex-row w-max mb-1">
            <Input
              value={email}
              label="Email"
              styles={`flex flex-1 ${!login ? 'mr-3' : ''}`}
              error={errors.email}
              onChangeText={(text) =>
                setFormState({ ...formState, email: text })
              }
            />
            {!login && (
              <Input
                value={name}
                label="Name"
                styles="flex flex-1"
                onChangeText={(text) =>
                  setFormState({ ...formState, name: text })
                }
              />
            )}
          </View>
          <Input
            value={password}
            label="Password"
            type="password"
            styles={!errors.password ? (login ? 'mb-3' : 'mb-1') : undefined}
            error={errors.password}
            onChangeText={(text) =>
              setFormState({ ...formState, password: text })
            }
          />
          {!login && (
            <Input
              value={passwordConfirm}
              label="Confirm password"
              type="password"
              styles={!errors.passwordConfirm ? 'mb-3' : undefined}
              error={errors.passwordConfirm}
              onChangeText={(text) =>
                setFormState({ ...formState, passwordConfirm: text })
              }
            />
          )}
          {responseErr && (
            <View>
              <Text className="mt-2 mb-4 text-red-400 font-semibold text-center">
                {responseErr}
              </Text>
            </View>
          )}
          <View className="flex flex-row relative">
            {loading && (
              <View className="absolute z-50 flex justify-center items-center top-0 left-0 w-full h-full">
                <View className="w-[30px] h-[30px] rounded-full border-solid border-[5px] border-[#60a5fa] border-t-gray-200" />
              </View>
            )}
            <Button
              mode="contained"
              textColor="white"
              buttonColor="#60a5fa"
              disabled={loading}
              className="mx-auto rounded-md w-[45%]"
              icon="account"
              onPress={() => {
                resetErrors();
                return login ? setLogin(false) : handleSubmit();
              }}
            >
              Register
            </Button>
            <Button
              mode="contained"
              textColor="#60a5fa"
              disabled={loading}
              buttonColor="white"
              className="mx-auto rounded-md w-[45%]"
              icon="account"
              onPress={() => {
                resetErrors();
                return login ? handleSubmit() : setLogin(true);
              }}
            >
              Login
            </Button>
          </View>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
