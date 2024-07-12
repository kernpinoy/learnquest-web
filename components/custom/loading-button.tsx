import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "~/components/ui/button";

interface ButtonLoadingProps extends ButtonProps {
  isDisabled: boolean;
  textNotLoading: string;
  textLoading: string;
}

export function ButtonLoading({
  isDisabled,
  textLoading,
  textNotLoading,
  ...props
}: ButtonLoadingProps) {
  return (
    <Button disabled={isDisabled} {...props}>
      {isDisabled && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isDisabled ? textNotLoading : textLoading}
    </Button>
  );
}
