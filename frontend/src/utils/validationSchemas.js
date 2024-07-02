import * as Yup from 'yup';

export const signupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Не менее 6 символов')
    .required('Обязательное поле'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Обязательное поле'),
});

export const channelNameSchema = (channels) => Yup.object().shape({
  name: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .matches(/\S/, 'Обязательное поле')
    .required('Обязательное поле')
    .notOneOf(
      channels.map((channel) => channel.name),
      'Должно быть уникальным',
    ),
});
