const AUTH_ERROR_MAP: Record<string, string> = {
  "Invalid login credentials": "Неверный email или пароль",
  "Email not confirmed": "Подтвердите email — проверьте почту",
  "User already registered": "Пользователь с таким email уже зарегистрирован",
  "Password should be at least 6 characters":
    "Пароль должен быть не короче 6 символов",
  "Unable to validate email address: invalid format":
    "Некорректный формат email",
  "Signup requires a valid password": "Укажите пароль",
  "Email rate limit exceeded":
    "Слишком много попыток. Подождите пару минут и попробуйте снова",
  "For security purposes, you can only request this once every 60 seconds":
    "Подождите минуту перед повторной отправкой",
  "New password should be different from the old password":
    "Новый пароль должен отличаться от старого",
};

export function translateAuthError(message: string): string {
  if (AUTH_ERROR_MAP[message]) {
    return AUTH_ERROR_MAP[message];
  }

  if (message.includes("invalid format")) {
    return "Некорректный формат email";
  }
  if (message.includes("Password")) {
    return "Пароль слишком простой или короткий";
  }
  if (message.includes("rate limit")) {
    return "Слишком много попыток. Попробуйте позже";
  }

  return "Что-то пошло не так. Попробуйте ещё раз";
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return "Укажите email";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Некорректный формат email";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Укажите пароль";
  if (password.length < 6) return "Пароль должен быть не короче 6 символов";
  return null;
}

export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed && trimmed.length < 2) {
    return "Имя должно быть не короче 2 символов";
  }
  return null;
}
