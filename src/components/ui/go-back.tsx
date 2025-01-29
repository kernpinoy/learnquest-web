"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function GoBack({ link }: { link?: string }) {
  const router = useRouter();

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => (link ? router.push(link) : router.back())} // Updated logic for navigation
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </Button>
    </div>
  );
}
