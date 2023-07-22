const TypingBar = () => {
  return (
    <div className="flex gap-2 px-2 items-center h-[var(--typing-bar-height)]">
      <input
        name="id"
        className="outline-none w-[100px] px-2 bg-transparent text-sm border-2 rounded-sm border-transparent hover:bg-[#ededed] focus:border-[#0b57d0]"
      />
      <div className="w-[2px] bg-[#dadce0] h-[50%] border-none"></div>
      <div className="flex items-center w-full">
        <i className="icon-format-text text-[#a8a9a9] font-bold"></i>
        <input
          name="content"
          className="w-full border-none outline-none bg-transparent px-2 text-sm"
        />
      </div>
    </div>
  );
};

export default TypingBar;
