import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center py-20">
      <div className="text-6xl font-bold text-primary">404</div>
      <h1 className="mt-4 text-2xl font-semibold">Summoner not found</h1>
      <p className="mt-2 text-muted-foreground">
        Double-check the Riot ID and region, then try again.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to search</Link>
      </Button>
    </div>
  );
}
