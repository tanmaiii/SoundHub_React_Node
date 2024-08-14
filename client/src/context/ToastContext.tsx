import React, { createContext, useContext, useEffect, useState } from "react";
import ToastMessage from "../components/ToastMessage";

type TToast = {
  value: string;
  type?: "success" | "error" | "warning";
};

interface IToastContext {
  toastMessage: TToast | null;
  setToastMessage: React.Dispatch<React.SetStateAction<TToast | null>>;
}

export const ToastContext = createContext<IToastContext | null>(null);

type Props = {
  children: React.ReactNode;
};

export function useToast() {
  return useContext(ToastContext)!;
}

export const ToastContextProvider = ({ children }: Props) => {
  const [toastMessage, setToastMessage] = useState<TToast | null>(null);
  const toastRef = React.useRef<any>(null);

  useEffect(() => {
    if (toastMessage && toastRef.current) {
      toastRef.current?.show();
    }
  }, [toastMessage]);

  const contextValue = {
    toastMessage,
    setToastMessage,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      <ToastMessage
        type={toastMessage?.type || "success"}
        description={toastMessage?.value || ""}
        showToast={() => console.log("asdas")}
        ref={toastRef}
      />
      {children}
    </ToastContext.Provider>
  );
};
