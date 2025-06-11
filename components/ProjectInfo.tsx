"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Info,
  Code2,
  CheckCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

export function ProjectInfo() {
  const [isOpen, setIsOpen] = useState(false);

  const features = [
    "Next.js 15.3.3 with App Router",
    "React & TypeScript",
    "Tailwind CSS for styling",
    "shadcn/ui for component primitives",
    "Dynamic & smart pagination",
    "Interactive 'Guess the Flag' Game",
    "Fully Responsive & Dark Mode Support",
  ];

  return (
    <section>
      <Accordion
        type="single"
        collapsible
        className="w-full rounded-lg border bg-card text-card-foreground shadow-sm"
        onValueChange={(value) => setIsOpen(!!value)}
      >
        <AccordionItem value="item-1" className="border-b-0">
          {/* The new trigger now includes the main title and the summary */}
          <AccordionTrigger className="p-6 text-xl font-semibold hover:no-underline">
            <div className="flex w-full flex-col items-start text-left">
              <div className="flex items-center gap-3">
                <Info className="h-6 w-6 text-primary" />
                <span>About This Project</span>
              </div>
              <p className="mt-2 text-sm font-normal text-muted-foreground">
                A portfolio project by Leo Khani demonstrating modern web
                development. Click to see the tech stack and details...
              </p>
            </div>
            {/* Custom chevron that we manually animate */}
          </AccordionTrigger>

          {/* The full content remains the same */}
          <AccordionContent className="px-6 pb-6 pt-0 text-base">
            <div className="relative">
              {/* This is the "trick" to entice users. 
                  It shows a faded preview of the content when closed. */}
              {!isOpen && (
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-card via-card/80 to-transparent" />
              )}
              <div
                className={`space-y-6 text-muted-foreground ${
                  !isOpen ? "max-h-24 overflow-hidden" : ""
                }`}
              >
                <p>
                  This comprehensive country lookup application was built to
                  demonstrate a strong command of modern front-end technologies.
                  It leverages a powerful tech stack to create a fast,
                  responsive, and feature-rich user experience.
                </p>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Code2 className="h-5 w-5" />
                    Key Features & Technologies
                  </h3>
                  <ul className="space-y-2 pl-2">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <p className="font-semibold text-foreground">
                    Designed and developed by{" "}
                    <span className="text-primary">Leo Khani</span>.
                  </p>
                  <p className="mt-2">
                    To see more work or to get in touch, please visit his
                    portfolio website.
                  </p>
                  <Button asChild className="mt-4">
                    <a
                      href="https://LeoKhani.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit LeoKhani.com
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
