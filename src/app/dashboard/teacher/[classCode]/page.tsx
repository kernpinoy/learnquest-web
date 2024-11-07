"use client";

import { useState } from 'react'
import { ArrowLeft, Plus, Search, Folder, FileText, Image, Video, FileAudio } from 'lucide-react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Card, CardContent } from "~/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import GoBack from '~/components/ui/go-back';
import ContentLayout from '~/components/sidebar/shared/content-layout';

export default function ClassManagement() {
  const [students, setStudents] = useState([
    { lrn: '1082750081', schoolYear: '2024-2025', name: 'Jeanelle Toque', gender: 'Female', password: 'Kinder', classCode: 'py4c5y1s', avatar: '/avatars/jeanelle.jpg', rank: 1, star: true },
    { lrn: '1082750033', schoolYear: '2024-2025', name: 'Khristine Albino', gender: 'Female', password: 'Kids', classCode: 'py4c5y1s', avatar: '/avatars/khristine.jpg', rank: 2, star: true },
    { lrn: '1082750035', schoolYear: '2024-2025', name: 'Kern Paulo Jacobo', gender: 'Male', password: 'Children', classCode: 'py4c5y1s', avatar: '/avatars/kern.jpg', rank: 3, star: true },
    { lrn: '1082750036', schoolYear: '2024-2025', name: 'Gia Gonzales', gender: 'Female', password: 'Student', classCode: 'py4c5y1s', avatar: '/avatars/gia.jpg', rank: 4, star: false },
    { lrn: '1082750037', schoolYear: '2024-2025', name: 'Gabby Smith', gender: 'Female', password: 'Student', classCode: 'py4c5y1s', avatar: '/avatars/gabby.jpg', rank: 5, star: false },
    { lrn: '1082750038', schoolYear: '2024-2025', name: 'Nica Arroyo', gender: 'Female', password: 'Student', classCode: 'py4c5y1s', avatar: '/avatars/nica.jpg', rank: 6, star: false },
  ])

  const [newStudent, setNewStudent] = useState({ lrn: '', name: '', gender: '' })
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState('today')

  const handleAddStudent = () => {
    setStudents([...students, { ...newStudent, schoolYear: '2024-2025', password: 'NewPassword', classCode: 'py4c5y1s', avatar: '/avatars/default.jpg', rank: students.length + 1, star: false }])
    setNewStudent({ lrn: '', name: '', gender: '' })
  }

  const learningMaterials = [
    { name: 'Mathematics', type: 'folder', icon: <Folder className="h-4 w-4" /> },
    { name: 'Science', type: 'folder', icon: <Folder className="h-4 w-4" /> },
    { name: 'English Literature', type: 'folder', icon: <Folder className="h-4 w-4" /> },
    { name: 'History', type: 'folder', icon: <Folder className="h-4 w-4" /> },
    { name: 'Algebra Basics.pdf', type: 'file', icon: <FileText className="h-4 w-4" /> },
    { name: 'Photosynthesis Diagram.jpg', type: 'file', icon: <Image className="h-4 w-4" alt="Image ng kambing"/> },
    { name: 'Shakespeare Introduction.docx', type: 'file', icon: <FileText className="h-4 w-4" /> },
    { name: 'World War II Timeline.pdf', type: 'file', icon: <FileText className="h-4 w-4" /> },
    { name: 'Chemistry Lab Safety.mp4', type: 'file', icon: <Video className="h-4 w-4" /> },
    { name: 'French Pronunciation Guide.mp3', type: 'file', icon: <FileAudio className="h-4 w-4" /> },
  ]

  return (
    <ContentLayout title="Classroom files">
      <div className="min-h-screen">
        <GoBack />
        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="learningMaterials">Learning Materials</TabsTrigger>
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
                            onChange={(e) => setNewStudent({...newStudent, lrn: e.target.value})}
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
                            onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
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
                            onChange={(e) => setNewStudent({...newStudent, gender: e.target.value})}
                            className="col-span-3"
                 Mathematics         />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleAddStudent}>Save</Button>
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
                          <Button variant="outline" size="sm">Edit</Button>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {learningMaterials.map((material, index) => (
                      <TableRow key={index}>
                        <TableCell className="flex items-center">
                          {material.icon}
                          <span className="ml-2">{material.name}</span>
                        </TableCell>
                        <TableCell>{material.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="leaderboard">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-center space-x-4 mb-8">
                  {students.slice(0, 3).map((student, index) => (
                    <Card key={student.name} className="w-32">
                      <CardContent className="p-4 flex flex-col items-center">
                        <Avatar className="w-16 h-16 mb-2">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="text-xl font-bold">{index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : 'rd'}</div>
                        <div className="text-sm text-center">{student.name}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="flex space-x-2 mb-4">
                  <Button
                    variant={activeLeaderboardTab === 'today' ? 'default' : 'outline'}
                    onClick={() => setActiveLeaderboardTab('today')}
                  >
                    Today
                  </Button>
                  <Button
                    variant={activeLeaderboardTab === 'allTime' ? 'default' : 'outline'}
                    onClick={() => setActiveLeaderboardTab('allTime')}
                  >
                    All Time
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Star</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.name}>
                        <TableCell>{student.rank}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="text-right">
                          {student.star && <span className="text-yellow-500">★</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ContentLayout>
  )
}
