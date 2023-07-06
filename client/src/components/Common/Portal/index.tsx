import { ReactNode } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  children: ReactNode;
};

const Portal = ({ children }: PortalProps) => {
  return createPortal(children, document.body);
};

export default Portal;
