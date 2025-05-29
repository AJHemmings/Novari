"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TaskHistoryCard from "../components/TaskHistoryCard";

interface CompletedTasks {
  id: number;
  emberType: string;
  taskInstructions: string;
}

interface Task {
  id: number;
  "Ember Type": string;
  "Task Instructions": string;
}

export default function TaskHistory() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<CompletedTasks[]>([]);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      const user = data?.session?.user || null;

      if (error) {
        console.error("Error fetching user:", error);
      }

      if (isMounted) {
        setUser(user);
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/signin");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      if (!user) return;
      // Step 1: Get completed task IDs
      const { data: completed, error } = await supabase
        .from("completed_tasks")
        .select("id, task_id")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });
      if (error || !completed) return;

      const taskIds = completed.map((row) => row.task_id);
      if (taskIds.length === 0) {
        setCompletedTasks([]);
        return;
      }

      // Step 2: Get task details for those IDs
      const { data: tasks, error: tasksError } = await supabase
        .from("Tasks")
        .select('id, "Ember Type", "Task Instructions"')
        .in("id", taskIds);

      if (tasksError || !tasks) {
        setCompletedTasks([]);
        return;
      }

      // Map completed tasks to include task details
      const completedWithDetails = completed
        .map((row) => {
          const task = (tasks as Task[]).find((t) => t.id === row.task_id);
          return task
            ? {
                id: row.id,
                emberType: task["Ember Type"],
                taskInstructions: task["Task Instructions"],
              }
            : null;
        })
        .filter((x): x is CompletedTasks => x !== null);

      setCompletedTasks(completedWithDetails);
    };
    fetchCompletedTasks();
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      router.replace("/auth/signin");
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return null; // Prevent rendering before redirecting
  }

  return (
    <div className="bg-custom-green min-h-screen flex flex-col">
      <Header />
      <div className="absolute top-4 left-4">
        <button
          onClick={handleLogout}
          className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
      <div className="flex-grow flex flex-col">
        <h2 className="text-5xl pt-20 text-custom-white font-bold text-center mt-10 mb-10">
          Completed Tasks
        </h2>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4 items-center">
            {completedTasks.map((completedTask: CompletedTasks) => (
              <TaskHistoryCard
                key={completedTask.id}
                emberType={completedTask.emberType}
                taskInstructions={completedTask.taskInstructions}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
