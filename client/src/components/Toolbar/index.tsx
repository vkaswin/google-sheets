const Toolbar = () => {
  return (
    <div className="h-[var(--toolbar-height)]">
      <div className="flex items-center h-[65px]">
        <div className="flex items-center">
          <img className="w-[60px] h-[42px]" src="/logo.png" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div
                className="text-[#575a5a] font-[Poppins-Medium] text-lg"
                contentEditable={false}
              >
                Untitled Spreadsheet
              </div>
              <i className="icon-star-outline"></i>
              <i className="icon-folder-move-outline"></i>
              <i className="icon-cloud-check-outline"></i>
            </div>
            <div className="flex gap-2">
              <button>File</button>
              <button>Edit</button>
            </div>
          </div>
        </div>
        <div className=""></div>
        {/* <i className="icon-history"></i>
        <i className="icon-comment-text-outline"></i>
        <i className="icon-lock-outline"></i>
        <img src="https://lh3.googleusercontent.com/ogw/AGvuzYbYUvEKxa6rFyPYlmSyOB0iLAYbAvNNCnB4PZS0fg=s32-c-mo" /> */}
      </div>
      <div className="">Toolbar</div>
    </div>
  );
};

export default Toolbar;
