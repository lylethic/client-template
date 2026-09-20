"use client";

import * as React from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value?: string | number;
  change?: string;
  growthRate?: number;
  timeframe?: string;
  note?: string;
  isPositive?: boolean;
  icon: React.ElementType;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  change,
  growthRate,
  timeframe,
  note,
  isPositive,
  icon: Icon,
  loading = false,
}: StatCardProps) {
  return (
    <Card className="border-border/70 hover:border-border shadow-xs transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2.5">
        <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          {title}
        </CardTitle>
        <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
          <Icon className="size-4.5" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="my-1 h-9 w-28" />
        ) : (
          <div className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            {value ?? "—"}
          </div>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          {growthRate !== undefined ? (
            <Badge
              variant={growthRate > 0 ? "default" : growthRate < 0 ? "destructive" : "secondary"}
              className={`px-2 py-0.5 text-xs font-semibold ${
                growthRate > 0 ? "bg-emerald-600 hover:bg-emerald-700" : ""
              }`}
            >
              {growthRate > 0 ? (
                <TrendingUp className="mr-0.5 size-3" />
              ) : growthRate < 0 ? (
                <TrendingDown className="mr-0.5 size-3" />
              ) : (
                <Minus className="mr-0.5 size-3" />
              )}
              {growthRate > 0 ? `+${growthRate.toFixed(1)}%` : `${growthRate.toFixed(1)}%`}
              {timeframe ? ` ${timeframe}` : ""}
            </Badge>
          ) : change ? (
            <span
              className={`font-semibold ${
                isPositive !== undefined
                  ? isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                  : "text-muted-foreground"
              }`}
            >
              {change}
            </span>
          ) : null}

          {note && <span className="text-muted-foreground text-[11px]">{note}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
