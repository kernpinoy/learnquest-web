import React, { forwardRef } from "react";

const HiddenButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  return (
    <button
      ref={ref}
      style={{ display: "none" }} // Hide the button
      {...props} // Spread any additional props
    >
      Refresh
    </button>
  );
});

HiddenButton.displayName = "HiddenButton";

export default HiddenButton;
