const toneMap = {
  primary: "bg-violet-100 text-violet-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  default: "bg-gray-100 text-gray-600",
};

function Badge({ tone = "default", children }) {
  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-2 rounded-full text-[0.8rem] font-bold ${toneMap[tone] || toneMap.default}`}
    >
      {children}
    </span>
  );
}

export default Badge;
