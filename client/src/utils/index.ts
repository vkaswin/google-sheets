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

export const convertToTitle = (n: number) => {
  if (n < 27) return String.fromCharCode(n + 64);

  let s = "";

  while (n > 0) {
    let temp = n % 26;
    temp = temp == 0 ? 26 : temp;
    s = String.fromCharCode(temp + 64) + s;
    n -= temp;
    n /= 26;
  }

  return s;
};

export const clickOutside = <T extends HTMLElement>({
  ref,
  onClose,
  doNotClose = () => false,
}: {
  ref: T;
  onClose?: () => void;
  doNotClose?: (element: T) => boolean | undefined;
}): Function => {
  const removeEventListener = () => {
    document.removeEventListener("click", handleClickOutside);
  };

  const handleClickOutside = (event: MouseEvent) => {
    let { target } = event;
    if (ref.contains(target as T) || doNotClose(target as T)) return;

    onClose?.();
    removeEventListener();
  };

  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 0);

  return removeEventListener;
};

export const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};
