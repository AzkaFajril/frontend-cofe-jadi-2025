interface FlexContainerProps {
  children: React.ReactNode;
}

export default function FlexContainer({ children }: FlexContainerProps) {
  return (
    <div className="flex flex-col h-full bg-white sm:max-w-lg sm:mx-auto sm:rounded-lg sm:shadow-lg sm:my-8 sm:border">
      {children}
    </div>
  );
}
