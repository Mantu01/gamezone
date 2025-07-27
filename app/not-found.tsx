// app/not-found.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        404 - Not Found
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Oops! The page you are looking for could not be found.
      </p>
      <Link href="/home">
        <Button variant="default" className="bg-orange-400 hover:bg-orange-500" size="lg">
          <Home className="mr-2 h-4 w-4" />
          Go Home
        </Button>
      </Link>
    </div>
  );
}