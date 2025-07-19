interface FullHeightContainerProps {
  children: React.ReactNode;
}

export default function FullHeightContainer({ children }: FullHeightContainerProps) {
  return <div className="flex-1 p-4 overflow-y-auto max-h-full">{children}</div>;
}
