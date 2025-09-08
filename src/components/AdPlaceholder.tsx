interface AdPlaceholderProps {
  type: "banner" | "square" | "leaderboard" | "sidebar";
  className?: string;
}

const AdPlaceholder = ({ type, className = "" }: AdPlaceholderProps) => {
  const getAdDimensions = () => {
    switch (type) {
      case "banner":
        return "h-24 md:h-32";
      case "square":
        return "aspect-square";
      case "leaderboard":
        return "h-20 md:h-24";
      case "sidebar":
        return "h-64";
      default:
        return "h-32";
    }
  };

  return (
    <div
      className={`
        ${getAdDimensions()}
        bg-ad-background border-2 border-dashed border-ad-border
        rounded-lg flex items-center justify-center
        text-muted-foreground text-sm font-medium
        ${className}
      `}
      data-ad-slot={type}
      aria-label="Advertisement"
    >
      {/* This div will be replaced with actual ad code */}
      <span className="opacity-50">Advertisement Space - {type}</span>
    </div>
  );
};

export default AdPlaceholder;