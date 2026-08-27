interface Props {
  message?: string | null;
}
export const ErrorMessage = ({ message }: Props) => {
  return (
    <>
      {message && (
        <p className="text-xs text-red-400 mt-2 bg-red-950/60 border border-red-800 px-3 py-1.5 rounded-md my-2 ">
          {message}
        </p>
      )}
    </>
  );
};
