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

const completedTasks: CompletedTasks[] = [
  {
    id: 1,
    emberType: "Self-Awareness & Mindset",
    taskInstructions: "Write down one thing you're proud of today.",
  },
  {
    id: 2,
    emberType: "Self-Awareness & Mindset",
    taskInstructions:
      "Take 5 minutes for a mindfulness exercise to connect with your thoughts.",
  },
  {
    id: 3,
    emberType: "Self-Awareness & Mindset",
    taskInstructions:
      "Reflect on a challenging situation today—what did you learn from it?",
  },
  {
    id: 4,
    emberType: "Self-Awareness & Mindset",
    taskInstructions:
      "Reflect on a challenging situation today—what did you learn from it?",
  },
];

export default function TaskHistory() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
