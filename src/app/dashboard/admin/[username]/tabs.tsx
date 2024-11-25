"use client";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function SirJomer() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList>
        <TabsTrigger value="profile">Teacher Profile</TabsTrigger>
        <TabsTrigger value="classroom">Classroom</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
