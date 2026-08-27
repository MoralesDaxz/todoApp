import { useTable, tableFeatures, type ColumnDef } from "@tanstack/react-table";
import { useRemoveMember } from "../todos/hooks/useRemoveMember";
import type { Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

export interface Member {
  nickname: string;
  role: "read" | "write";
}

interface Props {
  listName: string;
  user_id: string;
  listId: string;
  listMembers: Member[] | null;
  isOwner?: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
}

export const MembersInList = ({
  listName,
  listId,
  listMembers,
  isOwner,
  user_id,
  onClose,
}: Props) => {
  const data = listMembers ?? [];
  const removeMutation = useRemoveMember();
  const features = tableFeatures({});

  const columns: Array<ColumnDef<typeof features, Member>> = [
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
          className={` py-0.5 rounded text-xs font-semibold ${
            info.getValue() === "write" ? "text-green-400" : "text-yellow-400"
          }`}
        >
          {info.getValue() === "write" ? "Edición" : "Lectura"}
        </span>
      ),
    },
    // Columna de acciones (solo visible si el usuario actual es el propietario)
    ...(isOwner
      ? [
          {
            id: "actions",
            header: "Acción",
            cell: () => {
              return (
                <button
                  onClick={() => {
                    removeMutation.mutate({ listId, userId: user_id });
                  }}
                  disabled={removeMutation.isPending}
                  className="text-red-400 hover:text-red-300 text-xs bg-red-950/50 border border-red-800 px-2 py-1 rounded transition-colors disabled:opacity-50"
                >
                  Quitar
                </button>
              );
            },
          } as ColumnDef<typeof features, Member>,
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40  backdrop-blur-sm"
      >
        <div className="absolute inset-1" onClick={() => onClose(false)} />
        <div className="relative  border border-gray-700 rounded-lg p-4 max-w-md w-full text-white">
          <div className="flex justify-center items-center mb-4 gap-2">
            <IoClose
              onClick={() => onClose(false)}
              className="absolute top-1 right-1 text-2xl text-gray-300 opacity-90 rounded-full bg-gray-900 p-1 cursor-pointer"
            />
            <span className="bg-gray-500  rounded-[50%] p-1">
              <p className="h-6 w-6 text-center">{listMembers?.length}</p>
            </span>
            <p>Miembros de: </p>
            <h3 className="font-bold">{listName}</h3>
          </div>

          <table className="w-full text-left">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="p-2 text-xs text-gray-400 uppercase border-b border-gray-800 "
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
