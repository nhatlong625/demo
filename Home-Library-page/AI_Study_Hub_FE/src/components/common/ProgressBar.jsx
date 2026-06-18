function ProgressBar({ value }) {
  return (
    <div
      className="w-full h-2.5 rounded-full bg-[#f1edfb] overflow-hidden"
      aria-label={"Progress " + value + "%"}
    >
      <span
        className="block h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-300"
        style={{ width: value + "%" }}
      />
    </div>
  );
}

export default ProgressBar;
