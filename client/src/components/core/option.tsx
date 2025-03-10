import { cn } from "@/lib/utils";

type OptionProps = {
  onClick: () => void;
  label: string;
  description?: string;
  selected?: boolean;
};
export const Option = ({
  onClick,
  label,
  description,
  selected,
}: OptionProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "animate-slide-up bg-white cursor-pointer max-w-96 w-full rounded-lg border p-4 text-left  active:ring ring-blue-500 flex flex-col",
        selected ? "ring-2" : "hover:ring",
      )}
    >
      <span className="font-medium">{label}</span>
      {description && (
        <span className="text-sm text-secondary font-light">{description}</span>
      )}
    </button>
  );
};
