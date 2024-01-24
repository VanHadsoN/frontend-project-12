export default {
  translation: {
    logInPage: {
      title: 'Войти',
      username: 'Ваш ник',
      password: 'Пароль',
      submitBtn: 'Войти',
      noAccount: 'Нет аккаунта?',
      signUp: 'Регистрация',
      authFailed: 'Неверные имя пользователя или пароль',
    },
    signUpPage: {
      title: 'Регистрация',
      username: 'Имя пользователя',
      password: 'Пароль',
      passwordConfirmation: 'Подтвердите пароль',
      submitBtn: 'Зарегистрироваться',
    },
    messages: {
      counter: {
        count_zero: '{{count}} сообщений',
        count_one: '{{count}} сообщение',
        count_few: '{{count}} сообщения',
        count_many: '{{count}} сообщений',
      },
      messagesForm: {
        placeholder: 'Введите сообщение...',
        submitBtn: 'Отправить',
        input: 'Новое сообщение',
      },
    },
    channels: {
      title: 'Каналы',
      channelSign: '#',
      control: 'Управление каналом',
      remove: 'Удалить',
      rename: 'Переименовать',
    },
    errors: {
      smthWentWrong: 'Что-то пошло не так',
      error409: 'Пользователь уже существует',
      error401: 'Ошибка аутентификации',
      errorConnection: 'Ошибка соединения',
    },
    loadingStatus: 'Загрузка...',
    errorPage: {
      title: 'Упс!',
      body: 'Страница не найдена',
      errorName: 'Ошибка 404',
    },
    buttons: {
      reloadBtn: 'Перезагрузить страницу',
      signOut: 'Выйти',
      cancelBtn: 'Отменить',
      chatBtn: 'Hexlet Chat',
    },
    validation: {
      min3: 'От 3 до 20 символов',
      min6: 'Не менее 6 символов',
      max20: 'От 3 до 20 символов',
      required: 'Обязательное поле',
      correctSymbols: 'Только латинские буквы и цифры',
      passwordConfirmation: 'Пароли должны совпадать',
      channelAlreadyExists: 'Канал уже существует',
    },
    modals: {
      add: {
        title: 'Добавить канал',
        name: 'Имя канала',
        submitBtn: 'Отправить',
        toast: 'Канал создан',
      },
      remove: {
        title: 'Удалить канал',
        body: 'Уверены?',
        submitBtn: 'Удалить',
        toast: 'Канал удалён',
      },
      rename: {
        title: 'Переименовать канал',
        name: 'Имя канала',
        submitBtn: 'Отправить',
        toast: 'Канал переименован',
      },
    },
  },
};
