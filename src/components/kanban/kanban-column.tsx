"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  title: string
  count: number
  children: React.ReactNode
  className?: string
}

export function KanbanColumn({
  title,
  count,
  children,
  className,
}: KanbanColumnProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col rounded-lg bg-secondary/30 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-medium">
          {title} <span className="ml-1 text-muted-foreground">({count})</span>
        </h3>
      </div>
      <div className="flex flex-col gap-2 p-2 overflow-y-auto max-h-[calc(100vh-200px)]">
        {children}
      </div>
    </div>
  )
}
