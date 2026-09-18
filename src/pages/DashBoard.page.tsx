import { useLists } from "../features/todos/hooks/useLists";
import { useState } from "react";
import Loader from "../components/ui/loader/Loader";
import { PickLists } from "../features/todos/components/PickLists";
import { CreateOrJoinList } from "../features/todos/components/CreateOrJoinList";
import LogUser from "../components/layout/userMenu/LogUser";
import { Lists } from "../features/todos/components/Lists";

export const DashBoard = () => {
  const { isLoading } = useLists();
  const [pickList, setPickList] = useState<"myLists" | "sharedLists">(
    "myLists",
  );

  if (isLoading) {
    return <Loader />;
  }
  return (
    <section>
      <LogUser />
      <h1 className="text-center text-4xl my-8 font-medium">Gestiones</h1>
      <CreateOrJoinList />
      <PickLists pickList={pickList} setPickList={setPickList} />
      <Lists pickList={pickList} />
    </section>
  );
};

export default DashBoard;
