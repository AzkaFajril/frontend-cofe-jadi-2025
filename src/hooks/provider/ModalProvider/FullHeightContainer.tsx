interface FullHeightContainerProps {
  children: React.ReactNode;
}

export default function FullHeightContainer({ children }: FullHeightContainerProps) {
  return <div className="flex-1 min-h-0 overflow-y-auto ...">{children}</div>;
}
