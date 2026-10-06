import { Card } from "@/components/ui/card";

export function PlaceholderPanel({ children }: { children: string }) {
  return (
    <Card className="border-dashed text-sm text-slate-500">
      <span>TODO: </span>
      {children}
    </Card>
  );
}
