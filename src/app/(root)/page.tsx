"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { fetchDashboardStats } from "@/lib/services/api";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import type { DashboardStats } from "@/lib/services/api";

export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardStats();
        setDashboardStats(data);
        setError(null);
      } catch (err) {
        setError("Failed to load dashboard statistics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !dashboardStats) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-destructive">
        {error || "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Students Overview */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Students Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Students
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {dashboardStats.totalStudents}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Active Courses
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {dashboardStats.activeCourses}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Average Attendance
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {dashboardStats.averageAttendance}%
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Performance Index
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {dashboardStats.performanceIndex}
            </p>
          </Card>
        </div>
      </section>

      {/* Teachers Overview */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Teachers Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Teachers
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {dashboardStats.totalTeachers}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Departments
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {dashboardStats.departments}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Active Classes
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {dashboardStats.activeClasses}
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              Satisfaction Rate
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {dashboardStats.satisfactionRate}/10
            </p>
          </Card>
        </div>
      </section>

      {/* Additional Statistics */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Additional Statistics</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {/* Performance Distribution */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">
              Performance Distribution
            </h3>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Excellent</span>
                  <span>
                    {dashboardStats.performanceDistribution.excellent} students
                  </span>
                </div>
                <Progress
                  value={
                    (dashboardStats.performanceDistribution.excellent /
                      dashboardStats.totalStudents) *
                    100
                  }
                  className="h-2"
                />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Optimal</span>
                  <span>
                    {dashboardStats.performanceDistribution.optimal} students
                  </span>
                </div>
                <Progress
                  value={
                    (dashboardStats.performanceDistribution.optimal /
                      dashboardStats.totalStudents) *
                    100
                  }
                  className="h-2"
                />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Inefficient</span>
                  <span>
                    {dashboardStats.performanceDistribution.inefficient}{" "}
                    students
                  </span>
                </div>
                <Progress
                  value={
                    (dashboardStats.performanceDistribution.inefficient /
                      dashboardStats.totalStudents) *
                    100
                  }
                  className="h-2"
                />
              </div>
            </div>
          </Card>

          {/* Batch Distribution */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Batch Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>11th Class</span>
                  <span>
                    {dashboardStats.batchDistribution.class11} batches
                  </span>
                </div>
                <Progress
                  value={
                    (dashboardStats.batchDistribution.class11 /
                      dashboardStats.totalBatches) *
                    100
                  }
                  className="h-2"
                />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>12th Class</span>
                  <span>
                    {dashboardStats.batchDistribution.class12} batches
                  </span>
                </div>
                <Progress
                  value={
                    (dashboardStats.batchDistribution.class12 /
                      dashboardStats.totalBatches) *
                    100
                  }
                  className="h-2"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
