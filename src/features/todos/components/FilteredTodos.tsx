import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { Todo } from "../../types";
import type { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants } from "../../../utils/motionVariants";
import { Todos } from "./Todos";
import { IoFilter } from "react-icons/io5";
import { TbFilter2, TbFilter2Down, TbFilter2X } from "react-icons/tb";
import { TaskProgressBar } from "./TaskProgressBar";

type FilterStatus = "all" | "pending" | "confirmed" | "mine";

interface Props {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: Dispatch<SetStateAction<FilterStatus>>;
  todos: Todo[];
  user: User | null;
  statusOrder: Record<string, number>;
  isEditor: boolean;
}

export const FilteredTodos = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  statusOrder,
  todos,
  user,
  isEditor,
}: Props) => {
  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        const matchesSearch = todo.task
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim());

        let matchesFilter = true;
        if (statusFilter === "pending")
          matchesFilter = todo.status === "pending";
        if (statusFilter === "confirmed")
          matchesFilter = todo.status === "confirmed";
        if (statusFilter === "mine")
          matchesFilter = todo.created_by === user?.id;

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      })
      .sort(
        (a, b) => (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99),
      );
  }, [todos, searchQuery, statusFilter, user?.id, statusOrder]);

  const [isActiveFilter, setIsActiveFilter] = useState({
    modal: false,
    subModal: false,
  });

  const filterOptions = [
    { id: "all", label: "Todas" },
    { id: "pending", label: "Pendientes" },
    { id: "confirmed", label: "Completadas" },
    { id: "mine", label: "Mis tareas" },
  ];

  const handleFilter = () => {
    if (!isActiveFilter.modal) {
      setIsActiveFilter({ modal: true, subModal: false });
      return;
    }
    if (isActiveFilter.modal && !isActiveFilter.subModal) {
      setIsActiveFilter({ ...isActiveFilter, subModal: true });
      return;
    }
    if (isActiveFilter.modal && isActiveFilter.subModal) {
      setIsActiveFilter({ modal: false, subModal: false });
      return;
    }
  };

  const styleButtonFilter = "text-gray-300 w-5 h-5 mx-2";

  return (
    <section className="w-[95%] mx-auto mt-4">
      <TaskProgressBar todos={todos} />
      <AnimatePresence mode="wait">
        {!isActiveFilter.modal ? (
          <motion.button
            key="filter-trigger"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            onClick={() =>
              setIsActiveFilter({ ...isActiveFilter, modal: true })
            }
            className="flex justify-end w-full"
          >
            <div className="flex justify-between bg-gray-900 border border-gray-700 hover:border-blue-500 px-3 py-1.5 rounded-md cursor-pointer w-fit gap-2">
              <p className="text-gray-400 text-xs">
                Buscar / Filtrar / Ordenar
              </p>
              <IoFilter className="text-gray-400 w-4 h-4" />
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="filter-modal"
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ originY: 0 }}
            className="flex flex-col gap-2 w-full mx-auto mt-2 mb-4 overflow-hidden"
          >
            <div className="relative flex justify-between items-center w-full">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full rounded-lg px-2 py-4 text-sm text-gray-400 placeholder-gray-400 focus:outline-none bg-gray-900 border border-gray-700 focus:border-blue-500 transition-colors"
              />

              <button
                onClick={handleFilter}
                className="bg-gray-900 py-4 px-2 rounded-md border border-gray-700 cursor-pointer"
              >
                {!isActiveFilter.modal && (
                  <TbFilter2 className={styleButtonFilter} />
                )}
                {isActiveFilter.modal && !isActiveFilter.subModal && (
                  <TbFilter2Down className={styleButtonFilter} />
                )}
                {isActiveFilter.modal && isActiveFilter.subModal && (
                  <TbFilter2X className={styleButtonFilter} />
                )}
              </button>
            </div>

            <AnimatePresence>
              {isActiveFilter.subModal && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scaleY: 0.9 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -6, scaleY: 0.9 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  style={{ originY: 0 }}
                  className="flex justify-center gap-2 flex-wrap text-xs font-medium py-1"
                >
                  {filterOptions.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setStatusFilter(tab.id as FilterStatus)}
                      className={`px-2 py-1.5 rounded-full transition-all cursor-pointer ${
                        statusFilter === tab.id
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-gray-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {searchQuery.length > 3 && filteredTodos.length === 0 ? (
          <p className="text-center text-gray-500 text-sm mt-8">
            No se encontraron tareas.
          </p>
        ) : (
          <Todos todos={filteredTodos} isEditor={isEditor} />
        )}
      </motion.section>
    </section>
  );
};
