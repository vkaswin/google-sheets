import { ChangeEvent } from "react";
import {
  Avatar,
  MenuList,
  MenuButton,
  Menu,
  MenuItem,
  Portal,
} from "@chakra-ui/react";
import useAuth from "@/hooks/useAuth";
import { getStaticUrl } from "@/utils";
import useSheet from "@/hooks/useSheet";

const Header = () => {
  const { user, logout } = useAuth();

  const { metaData, handleTitleChange } = useSheet();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  };

  return (
    <div className="flex justify-between items-center h-[var(--header-height)] px-4">
      <div className="flex items-center gap-2">
        <img className="w-[40px] h-[40px]" src={getStaticUrl("/logo.svg")} />
        <input
          className="text-dark-gray font-medium text-lg outline outline-1 outline-transparent hover:outline-dark-gray rounded-sm focus:outline-2 focus:outline-dark-blue px-2"
          defaultValue={metaData?.title}
          onChange={handleChange}
        />
      </div>

      <Menu placement="bottom-end">
        {user && (
          <MenuButton>
            <Avatar name={user?.name} bg={user?.colorCode} color="white" />
          </MenuButton>
        )}
        <Portal>
          <MenuList zIndex={999}>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuList>
        </Portal>
      </Menu>
    </div>
  );
};

export default Header;
