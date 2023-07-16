export const cookie = {
  set: <T>({
    name,
    value,
    days,
  }: {
    name: string;
    value: T;
    days: number;
  }): void => {
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + days * 24 * 60 * 60 * 1000);
    let expires = "; expires=" + expireDate.toUTCString();
    document.cookie = name + "=" + JSON.stringify(value) + expires + "; path=/";
  },

  get: (name: string): string | null => {
    let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  },

  remove: (name: string): void => {
    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  },
};

export const debounce = <T>(
  fn: (args: T) => void,
  delay: number
): ((args: T) => void) => {
  let timeoutId: any;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const throttle = (fn: Function, t: number) => {
  let wait = false;
  let pendingArgs: any[] | null = null;

  let timerFunc = () => {
    if (pendingArgs) {
      fn(...pendingArgs);
      pendingArgs = null;
      setTimeout(timerFunc, t);
    } else {
      wait = false;
    }
  };

  return (...args: any[]) => {
    if (wait) {
      pendingArgs = args;
      return;
    }

    fn(...args);
    wait = true;
    setTimeout(timerFunc, t);
  };
};

export const getStaticUrl = (path: string) => {
  return `${
    process.env.NODE_ENV === "production" ? "/google-sheets" : ""
  }${path}`;
};
