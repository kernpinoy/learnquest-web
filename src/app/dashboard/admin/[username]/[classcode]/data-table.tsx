"use client";

import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const students = [
  {
    lrn: "1082750081",
    schoolYear: "2024-2025",
    name: "Jeanelle Toque",
    gender: "Female",
    password: "Kinder",
    classCode: "py4c5y1s",
  },
  {
    lrn: "1082750033",
    schoolYear: "2024-2025",
    name: "Khristine Albino",
    gender: "Female",
    password: "Kids",
    classCode: "py4c5y1s",
  },
  {
    lrn: "1082750035",
    schoolYear: "2024-2025",
    name: "Kern Paulo Jacobo",
    gender: "Male",
    password: "Children",
    classCode: "py4c5y1s",
  },
];

const learningMaterials = [
  {
    id: 1,
    title: "Introduction to Math",
    type: "PDF",
    dateUploaded: "2023-06-01",
  },
  {
    id: 2,
    title: "Science Experiment Guide",
    type: "Video",
    dateUploaded: "2023-06-05",
  },
  {
    id: 3,
    title: "English Grammar Workbook",
    type: "PDF",
    dateUploaded: "2023-06-10",
  },
];

export default function ClassManagement() {
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [materialSearchTerm, setMaterialSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      Object.values(student).some((value) =>
        value.toLowerCase().includes(studentSearchTerm.toLowerCase())
      )
    );
  }, [studentSearchTerm]);

  const filteredMaterials = useMemo(() => {
    return learningMaterials.filter((material) =>
      material.title.toLowerCase().includes(materialSearchTerm.toLowerCase())
    );
  }, [materialSearchTerm]);

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="materials">Learning Materials</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-end mb-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border rounded-md"
                value={studentSearchTerm}
                onChange={(e) => setStudentSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>LRN</TableHead>
                  <TableHead>School Year</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Class Code</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.lrn}>
                    <TableCell>{student.lrn}</TableCell>
                    <TableCell>{student.schoolYear}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.password}</TableCell>
                    <TableCell>{student.classCode}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="materials">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <Button>
              <Plus className="h-5 w-5 mr-2" />
              New
            </Button>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border rounded-md"
                value={materialSearchTerm}
                onChange={(e) => setMaterialSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>{material.title}</TableCell>
                    <TableCell>{material.type}</TableCell>
                    <TableCell>{material.dateUploaded}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
