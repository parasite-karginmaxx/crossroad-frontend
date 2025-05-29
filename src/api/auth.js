export const loginRequest = async (email, password) => {
    // Здесь будет POST /api/auth/login
    return { email }; // временный ответ
  };
  
  export const registerRequest = async (email, password) => {
    // Здесь будет POST /api/auth/register
    return { email };
  };
  
  export const logoutRequest = async () => {
    // Здесь будет POST /api/auth/logout
  };
  
  export const getProfile = async () => {
    // Здесь будет GET /api/auth/profile
    return null; // если не авторизован
  };
  