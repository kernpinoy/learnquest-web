"use client";

import { Skeleton } from "~/components/ui/skeleton";

export default function ClassroomsAreaSkeleton() {
  return (
    <>
      {/** Button */}
      <div className="mb-4 flex justify-end">
        <Skeleton className="h-10 rounded bg-gray-300 px-4 py-2">
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
