export default {
  translation: {
    modals: {
      addChannel: {
        title: "Добавить канал",
        cancelBtn: "Отменить",
        confirmBtn: "Отправить",
      },
      renameChannel: {
        title: "Переименовать канал",
        cancelBtn: "Отменить",
        confirmBtn: "Отправить",
      },
      removeChannel: {
        title: "Удалить канал",
        subTitle: "Уверены?",
        cancelBtn: "Отменить",
        confirmBtn: "Удалить",
      },
    },
    mainPage: {
      header: {
        chatLink: "Hexlet Chat",
        logOutBtn: "Выйти",
      },
      channelsListHeader: "Каналы",
      chatArea: {
        submitBtn: "Отправить",
        inputPlaceholder: "Введите сообщение...",
      },
    },
    loginPage: {
      greeting: "Войти в IT",
      autFailed: "Неверные имя пользователя или пароль",
      noAccount: "Нет аккаунта?",
      usernamePlaceholder: "Ваш ник",
      pwdPlaceholder: "Пароль",
      register: "Регистрация",
      logIn: "Войти",
    },
    signupPage: {
      chatBtn: "SnusChat",
      usernamePlaceholder: "Имя пользователя",
      pwdPlaceholder: "Пароль",
      confirmpwdPlaceholder: "Подтверждение пароля",
      greeting: "Регистрация",
      signUpFailed: "Пользователь с таким именем уже существует",
      signUp: "Зарегистрироваться",
      validationMessages: {
        maxNameLength: "От 3 до 20 символов",
        required: "Обязательное поле",
        minPwdLength: "Не менее 6 символов",
        onlyLatinaPwd: "Пароль должен содержать только латинские буквы",
        notMatches: "Пароли должны совпадать",
      },
    },
    toasters: {
      added: "Канал создан",
      renamed: "Канал переименован",
      removed: "Канал удалён",
      networkError: "Ошибка соединения",
    },
  },
};
