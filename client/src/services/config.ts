const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "http://localhost:8000";

const userUrl = `${baseURL}/api/user`;

export const User = {
  signIn: `${userUrl}/sign-in`,
  signUp: `${userUrl}/sign-up`,
};
