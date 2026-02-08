"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CardsSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Cards</h2>
        <p className="text-sm text-muted-foreground">
          Card layouts with header, content, footer, and action slots.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Basic Card</CardTitle>
            <CardDescription>A simple card with title and description.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Card body content goes here. This demonstrates the default card styling.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card with Action</CardTitle>
            <CardDescription>Includes a header action slot.</CardDescription>
            <CardAction>
              <Button variant="outline" size="sm">Edit</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm">The action button is positioned in the top right via the CardAction slot.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card with Footer</CardTitle>
            <CardDescription>Full layout with footer actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Content area with supporting text that fills the main body of the card.</p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">Save</Button>
            <Button variant="ghost" size="sm">Cancel</Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
