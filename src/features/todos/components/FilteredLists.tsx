// src/features/todos/components/FilteredLists.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { IoFilter } from "react-icons/io5";
import { useSearchTodos } from "../hooks/useSearchTodos";
import { useAuth } from "../../../context/AuthContext";
import { useLists } from "../hooks/useLists";
import { BsBoxArrowInUpRight, BsCircleFill } from "react-icons/bs";
import { formatRelativeTime } from "../../../utils/date";

export const FilteredLists = () => {
  const { searchQuery, setSearchQuery, results } = useSearchTodos();
  const { lists } = useLists();
  const { user } = useAuth();
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const borderColors = {
    pending: "border-[#e8e7e9c9] shadow shadow-[#e8e7e9c9]",
    done_by_user: "border-[#ff8903b2] shadow shadow-[#ff8903b2]",
    confirmed: "border-[#4ff00fd2] shadow shadow-[#4ff00fd2]",
  };
  return (
    <AnimatePresence>
      <div className="flex flex-col mt-4 ">
        <div className="self-end flex justify-between items-center">
          <button
            onClick={() => {
              setIsOpenFilter(!isOpenFilter);
              setSearchQuery("");
            }}
            className="flex items-center gap-2 bg-gray-900 border border-gray-700  text-gray-300  hover:border-blue-500 px-3 py-1.5 rounded-md text-xs cursor-pointer transition-colors"
          >
            <span>{isOpenFilter ? "Ocultar filtros" : "Buscar"}</span>
            <IoFilter className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {isOpenFilter && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ originY: 0 }}
            className="flex flex-col justify-center w-full bg-gray-900 p-3 rounded-lg border border-gray-600 "
          >
            <div className="relative flex items-center">
              <input
                autoFocus={isOpenFilter}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por tarea..."
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-3 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              {searchQuery.length > 3 && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white text-xs font-medium cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {searchQuery.length > 3 && results.length === 0 ? (
                <p className="text-gray-500 text-sm text-center col-span-3 py-6">
                  No se encontraron coincidencias.
                </p>
              ) : (
                results.map((result) => {
                  const currentList = lists.find(
                    (item) => item.id === result.list_id,
                  );

                  const isOwner = currentList?.owner_id === user?.id;
                  return (
                    <article
                      key={result.id}
                      className={`flex sm:flex-wrap my-3 gap-2 bg-gray-950 rounded-md border ${
                        borderColors[
                          result.status as keyof typeof borderColors
                        ] || ""
                      }`}
                    >
                      <Link
                        to={`/todo/${result.list_id}`}
                        className="w-full flex justify-between items-center p-2"
                      >
                        <div className="flex flex-col gap-1">
                          <h2 className="text-lg font-semibold text-white">
                            {result.task}
                          </h2>
                          <h2 className="text-gray-400 text-xs ">
                            Lista que lo contiene: {currentList?.name}
                          </h2>
                          <span className="flex gap-2">
                            <BsCircleFill
                              className={`${result.status === "pending" ? "text-[#e8e7e9]" : "text-green-500"}`}
                            />
                            <p className=" text-gray-400 text-xs">
                              {isOwner
                                ? "eres Propietario"
                                : currentList?.owner_nickname +
                                  " Comparte contigo"}
                            </p>
                          </span>
                          <p className="text-gray-400 text-xs">
                            {currentList &&  formatRelativeTime(currentList.created_at)}
                          </p>
                        </div>
                        <div className="p-2">
                          <BsBoxArrowInUpRight className="w-6 h-6 text-blue-400" />
                        </div>
                      </Link>
                    </article>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
