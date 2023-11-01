import { ChangeEvent } from "react";
import Avatar from "../Avatar";
import { getStaticUrl } from "@/utils";

import { IUser } from "@/types/User";

type IHeader = {
  user: IUser;
  onLogout: () => void;
};

const Header = ({ user, onLogout }: IHeader) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  };
  return (
    <div className="flex justify-between items-center h-[var(--header-height)] pr-4">
      <div className="flex items-center">
        <img className="w-[60px] h-[42px]" src={getStaticUrl("/logo.png")} />
        <input
          className="text-dark-gray font-medium text-base border border-transparent px-1 outline-none rounded-sm hover:border-gray-500 focus:border-gray-500"
          type="text"
          onChange={handleChange}
          value="Untitled Spreadsheet"
        />
      </div>
      <Avatar user={user} logout={onLogout} />
    </div>
  );
};

export default Header;
