export const Footer = () => {
  return (
    <div className="absolute bottom-2 w-full mt-8 mx-auto text-gray-400">
      <p className=" w-full text-center z-10 text-bondiBlue-40 font-medium text-xs">
        ToDoApp - Copyright © - {new Date().getFullYear()}
      </p>
    </div>
  );
};
