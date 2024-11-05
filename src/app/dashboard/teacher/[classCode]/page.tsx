"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import GoBack from "~/components/ui/go-back";
import ContentLayout from "~/components/sidebar/shared/content-layout";

export default function ClassManagement() {
  const [students, setStudents] = useState([
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
  ]);

  const [newStudent, setNewStudent] = useState({
    lrn: "",
    name: "",
    gender: "",
  });

  const handleAddStudent = () => {
    setStudents([
      ...students,
      {
        ...newStudent,
        schoolYear: "2024-2025",
        password: "NewPassword",
        classCode: "py4c5y1s",
      },
    ]);
    setNewStudent({ lrn: "", name: "", gender: "" });
  };

  return (
    <ContentLayout title="Classroom">
      <GoBack />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="learningMaterials">
            Learning Materials
          </TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>+ Add Students</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Student</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lrn" className="text-right">
                          LRN
                        </Label>
                        <Input
                          id="lrn"
                          value={newStudent.lrn}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              lrn: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          value={newStudent.name}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              name: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="gender" className="text-right">
                          Gender
                        </Label>
                        <Input
                          id="gender"
                          value={newStudent.gender}
                          onChange={(e) =>
                            setNewStudent({
                              ...newStudent,
                              gender: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleAddStudent}>
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <div className="flex items-center">
                  <Input type="text" placeholder="Search" className="mr-2" />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
                  {students.map((student) => (
                    <TableRow key={student.lrn}>
                      <TableCell>{student.lrn}</TableCell>
                      <TableCell>{student.schoolYear}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.gender}</TableCell>
                      <TableCell>{student.password}</TableCell>
                      <TableCell>{student.classCode}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="learningMaterials">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>+ New</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>New Folder</DropdownMenuItem>
                    <DropdownMenuItem>File Upload</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center">
                  <Input type="text" placeholder="Search" className="mr-2" />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-center text-muted-foreground mt-8">
                No learning materials available
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="leaderboard">
          <div>Hello, world!</div>
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
