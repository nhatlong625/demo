function Card({ title, description, action, children, className = "" }) {
  return (
    <section
      className={`bg-white rounded-3xl p-[22px] shadow-[0_10px_30px_rgba(100,76,155,0.08)] border border-violet-600/[0.06] ${className}`}
    >
      {(title || description || action) && (
        <div className="flex items-start justify-between gap-3 mb-[18px]">
          <div>
            {title && <h3 className="m-0 text-[1.05rem] font-bold text-gray-900">{title}</h3>}
            {description && <p className="mt-1.5 text-sm text-[#655b7a] leading-relaxed">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export default Card;
