import React from "react";

export default function ParagraphIsh({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="m-28 md:m-24 flex flex-col">
        {children}
      </div>
    </div>
  );
}
