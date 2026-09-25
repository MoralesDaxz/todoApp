export const Footer = () => {
  return (
    <div className="absolute bottom-2 w-full mt-8 mx-auto">
      <p className=" w-full text-center z-10 text-bondiBlue-40 font-medium text-[.7rem] sm:text-[.8rem] opacity-80">
        ToDoApp - Copyright © - {new Date().getFullYear()}
      </p>
    </div>
  );
};
