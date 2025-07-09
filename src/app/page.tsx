import { ConvexHttpClient } from "convex/browser";
import React from "react";
import { api } from "../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import PurchaseButton from "@/components/PurchaseButton";

const Home = async () => {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const courses = await convex.query(api.courses.getCourses);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Forge Your Path in Modern Development
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master Fullstack skills through engaging, Project-based learing.
            Unlock your potential with MasterClass.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-16">
          {courses.slice(0, 3).map((course) => (
            <Card key={course._id} className="flex flex-col">
              <Link href={`/courses/${course._id}`} className="cursor-pointer">
                <CardHeader>
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    width={640}
                    height={360}
                    className="rounded-md object-cover"
                  />
                  <CardContent className="flex-grow">
                    <CardTitle className="text-xl mb-2 hover:underline">
                      {course.title}
                    </CardTitle>
                  </CardContent>
                </CardHeader>
              </Link>

              <CardFooter className="flex items-center justify-between">
                <Badge variant="default" className="text-lg px-3 py-1">
                  {course.price.toFixed(2)}
                </Badge>
                <SignedIn>
                  <PurchaseButton courseId={course._id} />
                </SignedIn>
                <SignedOut>
                  <SignInButton>
                    <Button variant="outline">Enroll Now</Button>
                  </SignInButton>
                </SignedOut>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
