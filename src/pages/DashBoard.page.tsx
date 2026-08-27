// src/pages/DashBoard.page.tsx
import { useLists } from "../features/todos/hooks/useLists";
import { useState } from "react";
import LogUser from "../components/UI/logUser/LogUser";
import { Lists } from "../features/dashboard/Lists";
import Loader from "../components/UI/loader/Loader";
import { CreateOrJoinList } from "../features/dashboard/Dinamic.CreateOrJoinList";
import { PickLists } from "../features/dashboard/Dinamic.PickLists";

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
