"use client";

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Batch } from "@/lib/types"

interface BatchCardProps {
  batch: Batch
}

export function BatchCard({ batch }: BatchCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{batch.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Subject: {batch.subject}</p>
        <p>Total Students: {batch.totalStudents}</p>
        <p>Teacher: {batch.teacher}</p>
        <Button className="mt-4" onClick={() => router.push(`/batches/${batch.id}/students`)}>
        View More
        </Button>
      </CardContent>
    </Card>
  )
}