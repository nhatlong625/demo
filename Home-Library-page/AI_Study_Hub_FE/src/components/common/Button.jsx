const variantMap = {
  primary: "bg-gradient-to-br from-violet-600 to-violet-400 hover:-translate-y-px hover:from-violet-700 hover:to-violet-500 text-white shadow-[0_10px_30px_rgba(100,76,155,0.18)]",
  secondary: "bg-violet-100 hover:bg-violet-200 text-violet-700",
  ghost: "bg-white hover:bg-gray-50 text-gray-800 border border-[#e7def8]",
  danger: "bg-red-500 hover:bg-red-600 text-white",
};

function Button({ variant = "primary", full = false, className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2.5 px-5 py-3 border-0 rounded-2xl font-bold cursor-pointer transition-all text-sm
        ${variantMap[variant] || variantMap.primary}
        ${full ? "w-full" : ""}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
