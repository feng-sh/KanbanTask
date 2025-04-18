"use client"

import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Task } from "./kanban-board"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, UserCircle2 } from "lucide-react"

interface TaskCardProps {
  task: Task
  className?: string
  teamMembers: Array<{
    id: string
    name: string
    avatar?: string
  }>
  onAssigneeChange: (assigneeId: string | null) => void
}

export function TaskCard({ task, className, teamMembers, onAssigneeChange }: TaskCardProps) {
  const [open, setOpen] = React.useState(false)

  // Define priority badge colors
  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="p-3 pb-0">
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
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            ID: {task.id}
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-dashed justify-start"
              >
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                      <AvatarFallback>{getInitials(task.assignee.name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{task.assignee.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4" />
                    <span className="text-xs">Assign</span>
                  </div>
                )}
                <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="end">
              <div className="max-h-[300px] overflow-auto">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-secondary",
                      task.assignee?.id === member.id && "bg-secondary"
                    )}
                    onClick={() => {
                      onAssigneeChange(member.id)
                      setOpen(false)
                    }}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                    {task.assignee?.id === member.id && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </div>
                ))}
                {task.assignee && (
                  <div
                    className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-secondary border-t"
                    onClick={() => {
                      onAssigneeChange(null)
                      setOpen(false)
                    }}
                  >
                    <UserCircle2 className="h-4 w-4" />
                    <span>Unassign</span>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  )
}
