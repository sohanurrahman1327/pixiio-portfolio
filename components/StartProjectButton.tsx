import Link from "next/link";

type StartProjectButtonProps = {
  href?: string;
  className?: string;
};

export default function StartProjectButton({
  href = "#contact",
  className = "",
}: StartProjectButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 bg-primary text-white text-xs font-semibold tracking-wider pl-2 pr-6 py-2 rounded-full hover:bg-primary-dark transition-colors ${className}`}
    >
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white shrink-0">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M4 12L12 4M12 4H6M12 4V10"
            stroke="#5b5fef"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      START A PROJECT
    </Link>
  );
}
