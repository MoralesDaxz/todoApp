import { TbLoader } from "react-icons/tb";
interface Props {
  classContainer?: string
}
const Loader = ({classContainer}:Props) => {
  return (
    <div className={`flex flex-col items-center mt-[20%] text-lg gap-2 ${classContainer}`}>
      <p className="text-gray-300 font-medium">Cargando...</p>
      <TbLoader className="w-20 h-20 animate-spin  text-green-500 " />
    </div>
  );
};

export default Loader;
