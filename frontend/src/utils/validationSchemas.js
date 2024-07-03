import * as Yup from 'yup';

export const getSignupSchema = (t) => Yup.object().shape({
  username: Yup.string()
    .min(3, t('error.min3max20'))
    .max(20, t('error.min3max20'))
    .required(t('error.requiredField')),
  password: Yup.string()
    .min(6, t('error.min6'))
    .required(t('error.requiredField')),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], t('error.samePassword'))
    .required(t('error.requiredField')),
});

export const getChannelNameSchema = (t, channels) => Yup.object().shape({
  name: Yup.string()
    .min(3, t('error.min3max20'))
    .max(20, t('error.min3max20'))
    .matches(/\S/, t('error.requiredField'))
    .required(t('error.requiredField'))
    .notOneOf(
      channels.map((channel) => channel.name),
      t('error.uniqueChannelName'),
    ),
});
