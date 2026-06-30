const USERS_KEY = "__nutyum_demo_users__";

interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

function getStore(): Map<string, DemoUser> {
  if (!(globalThis as any)[USERS_KEY]) {
    (globalThis as any)[USERS_KEY] = new Map<string, DemoUser>();
  }
  return (globalThis as any)[USERS_KEY] as Map<string, DemoUser>;
}

export function createUser(name: string, email: string, password: string): DemoUser {
  const store = getStore();
  if (store.has(email)) {
    throw new Error("User already exists");
  }
  const user: DemoUser = {
    id: `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    email,
    password,
  };
  store.set(email, user);
  return user;
}

export function findUser(email: string): DemoUser | undefined {
  return getStore().get(email);
}
