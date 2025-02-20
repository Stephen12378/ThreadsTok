export function Menu() {
  return (
    <menu className="fixed bottom-0 bg-black text-white text-md w-full max-w-[420px] z-100">
      <div className="flex justify-around items-center py-3">
        <button className="flex flex-col items-center">
          <span className="">Home</span>
        </button>
        <button className="flex flex-col items-center">
          <span className="">Discover</span>
        </button>
        <button className="flex flex-col items-center">
          <span className="">Create</span>
        </button>
        <button className="flex flex-col items-center">
          <span className="">Inbox</span>
        </button>
        <button className="flex flex-col items-center">
          <span className="">Profile</span>
        </button>
      </div>
    </menu>
  );
}
