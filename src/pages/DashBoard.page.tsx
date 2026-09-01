import { useLists } from "../features/todos/hooks/useLists";
import { useState } from "react";
import Loader from "../components/ui/loader/Loader";
import { PickLists } from "../features/todos/components/Dinamic.PickLists";
import { CreateOrJoinList } from "../features/todos/components/Dinamic.CreateOrJoinList";
import LogUser from "../components/layout/userMenu/LogUser";
import { Lists } from "../features/todos/components/Lists";

export const DashBoard = () => {
  const { isLoading } = useLists();
  const [pickList, setPickList] = useState<boolean>(true);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section>
      <LogUser />
      <h1 className="text-center text-4xl my-8 font-medium">Gestiones</h1>
      <CreateOrJoinList setPickList={setPickList} />
      <PickLists pickList={pickList} setPickList={setPickList} />
      <Lists pickList={pickList} />
    </section>
  );
};

export default DashBoard;
