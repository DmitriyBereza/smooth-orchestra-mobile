export const useRouter = jest.fn(() => ({
  replace: jest.fn(),
  push: jest.fn(),
  back: jest.fn(),
}));
export const useLocalSearchParams = jest.fn(() => ({}));
export const useSegments = jest.fn(() => []);
export const router = { replace: jest.fn(), push: jest.fn(), back: jest.fn() };
export const Redirect = ({ href }: { href: string }) => null;
export const Slot = () => null;
export const Stack = ({ children }: any) => children;
Stack.Screen = ({ children }: any) => children ?? null;
export const Tabs = ({ children }: any) => children;
Tabs.Screen = () => null;
export const Link = ({ children }: any) => children;
