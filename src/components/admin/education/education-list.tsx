// components/admin/education/education-list.tsx
'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building2, Edit, Trash2 } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import EducationModal from "./education-modal";
import { EducationRequest, EducationResponse } from "@/types/education";
import { useResources } from "@/hooks/private/use-resource";
import { useDeleteResource } from "@/hooks/private/use-delete-resource";

export default function EducationList() {
  const { data: response } = useResources<EducationResponse[]>("educations");
  const deleteOne = useDeleteResource<EducationResponse>("educations");

  const [educations, setEducations] = useState<EducationResponse[]>([]);
  const [editingEducation, setEditingEducation] = useState<EducationResponse>();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setEducations(response?.data ?? []);
  }, [response]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

  const formatPeriod = (startDate: string, endDate?: string, current?: boolean) => {
    return current ? `${formatDate(startDate)} - Present` : `${formatDate(startDate)} - ${formatDate(endDate || "")}`;
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteOne.mutateAsync(deleteId);
      } catch (err) {
        console.error(err);
      }
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const getEducationToDelete = () => educations.find((edu) => edu.educationId === deleteId);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 size={20} />
            Education List ({educations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {educations.length === 0 ? (
            <div className="text-center py-8">
              <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No education entries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Degree/Program</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {educations.map((edu) => (
                    <TableRow key={edu.educationId}>
                      <TableCell>
                        <p className="font-medium">{edu.degree}</p>
                        {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{edu.institution}</p>
                        {edu.location && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin size={12} />
                            {edu.location}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} className="text-gray-400" />
                          {formatPeriod(edu.startDate, edu.endDate, edu.current)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={edu.current ? "default" : "secondary"}>
                          {edu.current ? "Current" : "Completed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingEducation(edu)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => {
                              setDeleteId(edu.educationId);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal untuk edit education */}
      <EducationModal
        education={editingEducation}
        trigger={<></>}
        onSave={async () => setEditingEducation(undefined)}
        open={!!editingEducation}
        setOpen={(val) => !val && setEditingEducation(undefined)}
      />

      {/* Dialog konfirmasi delete */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Education"
        description={
          getEducationToDelete()
            ? `Delete '${getEducationToDelete()?.degree}' from ${getEducationToDelete()?.institution}?`
            : "Are you sure?"
        }
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
}
