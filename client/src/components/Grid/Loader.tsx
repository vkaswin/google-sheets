const Loader = () => {
  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <div className="loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <span className="absolute top-[62%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-light-green font-medium">
        Loading...
      </span>
    </div>
  );
};

export default Loader;
