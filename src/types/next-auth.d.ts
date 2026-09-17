import "next-auth";
import "next-auth/jwt";

type Role = "MEMBER" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      avatar: string;
    };
  }
  interface User {
    id: string;
    role: Role;
    avatar?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    avatar: string;
  }
}
