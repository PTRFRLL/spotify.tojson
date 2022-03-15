export default function Container({children}) {
    return (
      <div className="flex flex-col items-center justify-center items-start max-w-2xl border-gray-200 mx-auto pb-4">
          {children}
      </div>
    );
  }