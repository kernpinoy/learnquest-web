"use client";

import { Skeleton } from "~/components/ui/skeleton";

export default function TeachersAreaSkeleton() {
  return (
    <>
      {/** Button */}
      <div className="flex justify-end mb-4">
        <Skeleton className="rounded h-10 px-4 py-2 bg-gray-300">
          {/** Hacky empty space */}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </Skeleton>
      </div>
      {/** Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-48 w-full rounded-lg bg-gray-300"
          />
        ))}
      </div>
    </>
  );
}
