import { ChangeEvent } from "react";
import useAuth from "@/hooks/useAuth";
import useSheet from "@/hooks/useSheet";
import Avatar from "@/components/Avatar";
import { debounce, getStaticUrl } from "@/utils";

const Header = () => {
  const { user, logout } = useAuth();

  const { sheetDetail, handleTitleChange } = useSheet();

  const handleChange = debounce((event: ChangeEvent<HTMLInputElement>) => {
    handleTitleChange(event.target.value);
  }, 500);

  return (
    <div className="flex justify-between items-center h-[var(--header-height)] px-4">
      <div className="flex items-center gap-2">
        <img className="w-12 h-12" src={getStaticUrl("/logo.png")} />
        <input
          className="text-dark-gray font-medium text-lg outline outline-1 outline-transparent hover:outline-dark-gray rounded-sm focus:outline-2 focus:outline-dark-blue px-2"
          defaultValue={sheetDetail?.title}
          onChange={handleChange}
        />
      </div>
      {user && <Avatar user={user} logout={logout} />}
    </div>
  );
};

export default Header;
