"use client";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DataTable } from "@/components/data-table/data-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@clerk/nextjs/server";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { toast } from "sonner";

import { useAuth } from "@clerk/nextjs";

export default function Page() {
  const user = useAuth();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/user");
      return res.json().then((res) => res.data);
    },
  });

  const editMutation = useMutation({
    mutationFn: async (data: { id: string; role: string }) => {
      const res = await fetch(`/api/user/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Data berhasil diubah");
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Username" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex place-items-center gap-4">
            <Image
              src={row.original.imageUrl}
              alt=""
              width={50}
              height={50}
              className="aspect-square rounded-full shadow-md"
            />
            {row.original.firstName} {row.original.lastName}
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        return (
          <>
            <Select
              disabled={(user.sessionClaims?.role as string) !== "admin"}
              value={(row.original.unsafeMetadata.role as string) ?? ""}
              onValueChange={(value) => {
                editMutation.mutate({
                  id: row.original.id,
                  role: value,
                });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Role</SelectLabel>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        );
      },
    },
    // {
    //   id: "actions",
    //   header: "Actions",
    //   cell: ({ row }) => {
    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //           <DropdownMenuItem
    //             onClick={() => navigator.clipboard.writeText(row.id)}
    //           >
    //             Copy ID
    //           </DropdownMenuItem>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuItem onClick={() => FormEdit(row.original)} disabled={user.sessionClaims?.role !== "admin"}>
    //             Edit Data
    //           </DropdownMenuItem>
    //           <DropdownMenuItem>Hapus Data</DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   },
    // },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold col-span-full">Management User</h1>

      <div className="col-span-full">
        {data && <DataTable columns={columns} data={data} />}
      </div>
    </>
  );
}
