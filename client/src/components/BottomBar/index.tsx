const BottomBar = () => {
  return (
    <div className="fixed left-0 bottom-0 w-full h-[var(--bottom-bar-height)] after:absolute after:top-[-1px] after:right-0 after:w-[var(--scrollbar-size)] after:h-[1px] after:bg-light-gray">
      Bottom Bar
    </div>
  );
};

export default BottomBar;
