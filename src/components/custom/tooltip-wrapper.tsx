import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "~/components/ui/tooltip";
import { ReactNode } from "react";

interface TooltipWrapperProps {
  children: ReactNode;
  content: string;
  disableHoverableContent?: boolean;
  delayDuration?: number;
  side?: "top" | "bottom" | "left" | "right";
}

export default function TooltipWrapper({
  children,
  content,
  disableHoverableContent,
  delayDuration = 100,
  side = "right",
}: TooltipWrapperProps) {
  return (
    <TooltipProvider disableHoverableContent={disableHoverableContent}>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
