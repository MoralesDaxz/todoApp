import { useTable, tableFeatures, type ColumnDef } from "@tanstack/react-table";

import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useRemoveMember } from "../hooks/useRemoveMember";
import type { TableMember, TableProps } from "../../types";


export const MembersInList = ({
  listOwner,
  listName,
  listId,
  listMembers,
  isOwner,
  onClose,
}: TableProps) => {
  const data = listMembers ?? [];
  const removeMutation = useRemoveMember();
  const features = tableFeatures({});

  const columns: Array<ColumnDef<typeof features, TableMember>> = [
    {
      accessorKey: "nickname",
      header: "Usuario",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: (info) => (
        <span
          className={`py-0.5 rounded text-xs font-semibold ${
            info.getValue() === "write" ? "text-green-400" : "text-yellow-400"
          }`}
        >
          {info.getValue() === "write" ? "Edición" : "Lectura"}
        </span>
      ),
    },
    ...(isOwner
      ? [
          {
            id: "actions",
            header: "Acción",
            cell: (info) => {
              const member = info.row.original as TableMember;
              return (
                <button
                  onClick={() => {
                    removeMutation.mutate({ listId, userId: member.user_id });
                  }}
                  disabled={removeMutation.isPending}
                  className="text-red-400 hover:text-red-300 text-xs bg-red-950/50 border border-red-800 px-2 py-1 rounded transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Quitar
                </button>
              );
            },
          } as ColumnDef<typeof features, TableMember>,
        ]
      : []),
  ];

  const table = useTable({
    key: "members",
    features,
    columns,
    data,
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.75 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      >
        <div className="absolute inset-0" onClick={() => onClose(false)} />
        <div className="relative border border-gray-700 bg-gray-900 rounded-lg p-4 max-w-md w-full text-white z-10">
          <div className="flex justify-center items-center my-6 gap-2">
            <IoClose
              onClick={() => onClose(false)}
              className="absolute top-2 right-2 text-2xl text-gray-300 opacity-90 rounded-full bg-gray-800 p-1 cursor-pointer hover:text-white"
            />

            <h3 className="font-bold text-xl ">{listName}</h3>
          </div>
          <span className="flex gap-1 text-sm">
            <p className="font-medium text-gray-400">Propietario: </p>
            <p className=" text-gray-100">{listOwner}</p>
          </span>
          <span className="flex gap-1 text-sm">
            <p className="font-medium text-gray-400">Miembros: </p>

            <p className=" text-gray-100">
              {(listMembers?.length > 0 && listMembers?.length + 1) || 0}
            </p>
          </span>

          <table className="w-full text-left mt-5 border-t border-t-gray-800">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-2 text-xs text-gray-400 uppercase border-b border-gray-800"
                    >
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-800/50">
                    {row.getAllCells().map((cell) => (
                      <td key={cell.id} className="p-2 text-sm">
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-2 text-center text-xs text-gray-500"
                  >
                    No hay miembros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
