import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { OptionsLogUser } from "./OptionsLogUser";
import { AnimatePresence, motion } from "framer-motion";

const LogUser = () => {
  const { user } = useAuth();
  const [isActiveModalOptions, setIsActiveModalOptions] = useState(false);

  return (
    <>
      <article className="absolute top-1 right-1 z-10">
        <AnimatePresence mode="wait">
          {!isActiveModalOptions ? (
            <motion.button
              title={user?.email}
              key="avatar"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsActiveModalOptions(true)}
              className="w-9 h-9 rounded-full bg-gray-900 text-md font-semibold text-gray-300 flex items-center justify-center cursor-pointer"
            >
              {user?.email?.substring(0, 1).toUpperCase()}
            </motion.button>
          ) : (
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <OptionsLogUser
                email={user?.email}
                nickname={user?.user_metadata?.nickname}
                setIsActiveModalOptions={setIsActiveModalOptions}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    </>
  );
};

export default LogUser;
