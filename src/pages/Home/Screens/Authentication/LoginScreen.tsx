import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { useRecoilState } from 'recoil';
import { homeNativeStackRouteState, userState } from '../../../../state/atoms';
import Input from '../../../../components/Input';
import { pb } from '../../../../utils/pocketbase';
import { StorageKeys, setItem } from '../../../../utils/asyncStorage';

const LoginScreen = () => {
  const [_, setHomeRoute] = useRecoilState(homeNativeStackRouteState);
  const [user, setUser] = useRecoilState(userState);
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    setHomeRoute('MainHome');
  }, []);

  const handleLogin = async () =>
    pb.collection('users').authWithPassword(email, password);

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
    } else if (!passwordRegex.test(password)) {
      setLoading(false);
      return setFormState({
        ...formState,
        errors: {
          email: errors.email,
          name: errors.name,
          passwordConfirm: errors.passwordConfirm,
          password: 'Password must include an uppercase letter and a number!',
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
      handleLogin()
        .then(({ record: { email, username, id, token } }) => {
          const newUser = {
            id,
            email,
            name: username,
            token,
          };
          setUser(newUser);
          setItem(StorageKeys.USER, JSON.stringify(newUser));
        })
        .catch((err) => console.log(err))
        .then(() => setLoading(false));
    } else {
      const userData = {
        email,
        password,
        passwordConfirm,
        username: name,
      };
      pb.collection('users')
        .create(userData)
        .then(() => {
          handleLogin()
            .then(({ record: { email, username, id, token } }) => {
              const newUser = {
                id,
                email,
                name: username,
                token,
              };
              setUser(newUser);
              setItem(StorageKeys.USER, JSON.stringify(newUser));
            })
            .catch((err) => console.error(err))
            .then(() => setLoading(false));
        })
        .catch((err) => console.error(err));
    }

    setLoading(false);
  };

  if (user) return null;

  return (
    <View className="bg-black w-[100vw] h-[100vh] flex items-center justify-center">
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
          <View className="flex flex-row">
            <Button
              mode="contained"
              textColor="white"
              buttonColor="#60a5fa"
              disabled={loading}
              className="mx-auto rounded-md w-[45%]"
              icon="account"
              onPress={() => (login ? setLogin(false) : handleSubmit())}
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
              onPress={() => (login ? handleSubmit() : setLogin(true))}
            >
              Login
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default LoginScreen;
