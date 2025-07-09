import { ConvexHttpClient } from "convex/browser";
import React from "react";
import { api } from "../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

const page = async () => {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const courses = await convex.query(api.courses.getCourses);
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold md-8">All Courses</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:grid-cols-2">
        {courses.map((course) => (
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
              <SignedIn>Purchase</SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline">Enroll Now</Button>
                </SignInButton>
              </SignedOut>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default page;
