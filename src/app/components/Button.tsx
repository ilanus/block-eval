import { ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

export const Button = ({ children, onClick, className }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx("bg-[#707070] rounded-lg text-white h-[42px]", className)}
    >
      {children}
    </button>
  );
};
