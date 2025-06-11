"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

// Assume this function fetches and sets up the question data
import { getFlagQuestion, GuessDataType } from "@/lib/flagQuizApi";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Lucide React Icons
import { CheckCircle2, XCircle, RefreshCw, LoaderCircle } from "lucide-react";

export default function GuessFlag() {
  const [guessData, setGuessData] = useState<GuessDataType | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadNewQuestion = useCallback(async () => {
    setIsSubmitting(true);
    setLoading(true);
    setSelected(null);
    try {
      const data = await getFlagQuestion(); // Your function to get a new question
      setGuessData(data);
    } catch (error) {
      console.error("Failed to load a new question:", error);
      // Optionally set an error state here
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  }, []);

  useEffect(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  const handleGuess = (name: string) => {
    setSelected(name);
  };

  const getButtonVariant = (optionName: string) => {
    if (!selected) return "outline";
    if (optionName === guessData?.correct.name.common) return "default"; // Correct answer is always shown as default/success
    if (optionName === selected) return "destructive"; // The selected wrong answer
    return "outline";
  };

  const getButtonIcon = (optionName: string) => {
    if (!selected) return null;
    if (optionName === guessData?.correct.name.common)
      return <CheckCircle2 className="mr-2 h-5 w-5" />;
    if (optionName === selected) return <XCircle className="mr-2 h-5 w-5" />;
    return null;
  };

  // Renders a skeleton loader for a better loading experience
  if (loading && !guessData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <Skeleton className="w-full aspect-video rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!guessData)
    return (
      <p className="text-center text-red-500">
        Failed to load the game. Please try refreshing.
      </p>
    );

  const isCorrect = selected === guessData.correct.name.common;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
        {/* Flag Image */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border">
          <Image
            src={guessData.correct.flags.svg}
            alt={guessData.correct.flags.alt || "Flag of a country"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>

        {/* Options and Feedback */}
        <div className="flex flex-col justify-center gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guessData.options.map((option) => (
              <Button
                key={option.cca2}
                className="h-14 text-md justify-start p-4 transition-all duration-300"
                variant={getButtonVariant(option.name.common)}
                onClick={() => handleGuess(option.name.common)}
                disabled={!!selected || isSubmitting}
              >
                {getButtonIcon(option.name.common)}
                <span className="truncate flex-1 text-center">
                  {option.name.common}
                </span>
              </Button>
            ))}
          </div>

          {/* Feedback Alert Section */}
          {selected &&
            (isCorrect ? (
              <Alert className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-600/50">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Correct!</AlertTitle>
                <AlertDescription className="flex flex-col sm:flex-row justify-between items-center mt-2">
                  You are absolutely right!
                  <Button
                    size="sm"
                    onClick={loadNewQuestion}
                    disabled={isSubmitting}
                    className="mt-2 sm:mt-0"
                  >
                    {isSubmitting && (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Next Question
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Not Quite!</AlertTitle>
                <AlertDescription className="mt-2">
                  <p>
                    The correct answer was{" "}
                    <strong>{guessData.correct.name.common}</strong>.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelected(null)}
                      disabled={isSubmitting}
                    >
                      Try Again
                    </Button>
                    <Button
                      size="sm"
                      onClick={loadNewQuestion}
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Next Question
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
        </div>
      </div>
    </div>
  );
}
