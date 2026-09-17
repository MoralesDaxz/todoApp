// src/features/todos/components/GlobalTaskSearch.tsx
import { useSearchTodos } from "../hooks/useSearchTodos";
import { Link } from "react-router";
import { IoSearchOutline, IoClose } from "react-icons/io5";

export const GlobalTaskSearch = () => {
  const { searchQuery, setSearchQuery, results, isLoading } = useSearchTodos();

  return (
    <>
      {}
      <div className="relative w-full max-w-md mb-6">
        <div className="relative flex items-center">
          <IoSearchOutline className="absolute left-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Búsqueda profunda en tus tareas..."
            className="w-full bg-gray-900 border border-gray-700 focus:border-blue-500 text-sm text-gray-200 rounded-lg pl-10 pr-10 py-2.5 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-gray-400 hover:text-white"
            >
              <IoClose className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Menú Flotante con Resultados */}
        {searchQuery.trim().length >= 3 && (
          <div className="absolute left-0 right-0 top-12 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden max-h-72 overflow-y-auto">
            {isLoading ? (
              <p className="p-3 text-xs text-gray-400 text-center">
                Buscando...
              </p>
            ) : results.length === 0 ? (
              <p className="p-3 text-xs text-gray-400 text-center">
                No se encontraron coincidencias.
              </p>
            ) : (
              results.map((item) => (
                <Link
                  key={item.id}
                  to={`/todo/${item.list_id}`}
                  onClick={() => setSearchQuery("")}
                  className="flex items-center justify-between p-3 border-b border-gray-800/60 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-white">
                      {item.task}
                    </p>
                    <p className="text-xs text-blue-400">
                      Lista: {item.lists?.name}
                    </p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700 uppercase">
                    {item.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};
