import { ChangeEvent, KeyboardEvent, useState } from "react";
import Avatar from "../Avatar";
import { getStaticUrl } from "@/utils";

import { IUser } from "@/types/User";

type IHeader = {
  user: IUser;
  onLogout: () => void;
};

let keys = ["b", "i", "u", "s"];

const Header = ({ user, onLogout }: IHeader) => {
  const handleChange = (event: ChangeEvent<HTMLDivElement>) => {
    console.log(event.target.innerText);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.ctrlKey && keys.includes(event.key)) event.preventDefault();
  };

  return (
    <div className="flex justify-between items-center h-[var(--header-height)] px-4">
      <div className="flex items-center gap-3">
        <img className="w-[40px] h-[40px]" src={getStaticUrl("/logo.svg")} />
        <div
          className="text-dark-gray font-medium text-lg outline outline-1 outline-transparent hover:outline-dark-gray rounded-sm focus:outline-2 focus:outline-dark-blue px-2"
          contentEditable={true}
          onKeyDown={handleKeyDown}
          onInput={handleChange}
          dangerouslySetInnerHTML={{ __html: "Untitled Spreadsheet" }}
        />
      </div>
      <Avatar user={user} logout={onLogout} />
    </div>
  );
};

export default Header;
