"use client"

import React from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Task } from "./kanban-board"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  className?: string
}

export function TaskCard({ task, className }: TaskCardProps) {
  // Define priority badge colors
  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  }

  return (
    <Card className={cn("cursor-pointer hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{task.title}</h4>
            {task.priority && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                  priorityColors[task.priority]
                )}
              >
                {task.priority}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 text-xs text-muted-foreground">
        ID: {task.id}
      </CardFooter>
    </Card>
  )
}
