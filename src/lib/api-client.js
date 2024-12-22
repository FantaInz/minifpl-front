export const api = {
  get: async (url) => {
    if (url === "/auth/me") {
      return {
        data: {
          id: "1",
          email: "user@example.com",
          firstName: "John",
          lastName: "Doe",
          role: "user",
        },
      };
    }
    throw new Error("Not Found");
  },

  post: async (url) => {
    if (url === "/auth/logout") {
      return { success: true };
    }
    throw new Error("Not Found");
  },
};
