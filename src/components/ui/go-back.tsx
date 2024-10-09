"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function GoBack() {
  const router = useRouter();

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </Button>
    </div>
  );
}
