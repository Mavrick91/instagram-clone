import { cn } from "@/lib/utils";

type Props = {
  loginChoice: "custom" | "mocked";
  setLoginChoice: (value: "custom" | "mocked") => void;
};

const LoginMode = ({ loginChoice, setLoginChoice }: Props) => {
  return (
    <div className="relative flex h-16 items-center rounded-full bg-slate-50 shadow-md">
      <div
        className={cn(
          "bg-white shadow-lg absolute transition-all top-0 w-1/2 h-full z-10 flex-1 flex rounded-full",
          {
            "translate-x-0": loginChoice === "custom",
            "translate-x-full": loginChoice === "mocked",
          },
        )}
      />
      <button
        className="z-10 h-full flex-1 text-center text-lg font-medium"
        type="button"
        onClick={() => {
          return setLoginChoice("custom");
        }}
      >
        Custom
      </button>
      <button
        className="z-10 h-full flex-1 text-center text-lg font-medium"
        type="button"
        onClick={() => {
          return setLoginChoice("mocked");
        }}
      >
        Mocked
      </button>
    </div>
  );
};

export default LoginMode;
