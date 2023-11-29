import { Fragment, useMemo } from "react";

type AvatarProps = {
  user?: IUser;
  logout: () => void;
};

const Avatar = ({ user, logout }: AvatarProps) => {
  let userInitial = useMemo(() => {
    if (!user) return "";
    let [firstName, lastName = ""] = user.name.split(" ");
    return `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ""}`.trim();
  }, [user]);

  return (
    <Fragment>
      <div className="w-10 h-10 flex justify-center items-center rounded-full bg-blue cursor-pointer">
        <span className="text-base text-white font-medium">
          {userInitial || "AK"}
        </span>
      </div>
    </Fragment>
  );
};

export default Avatar;
