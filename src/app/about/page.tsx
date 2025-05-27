"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
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
    <div className="bg-custom-green">
      <Header />
      <div className="absolute top-4 left-4">
        <button
          onClick={handleLogout}
          className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
      <div className="max-w-3xl mx-auto mt-16 px-4 py-8 text-gray-600">
        <h1 className="text-4xl font-semibold text-center text-custom-white mb-8">
          About Our App
        </h1>

        <section className="mb-12 p-6 bg-white border border-emerald-700 rounded-lg">
          <h2 className="text-3xl font-semibold text-gray-600 mb-4">
            We are Team Random Acts
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            We’re a passionate team of developers driven by the belief that
            technology can be a force for good. We are Luke, Conner, Maddy,
            Adam, and Kit—five individuals united by a common mission: to help
            people thrive in a fast-paced world.
          </p>
          <p className="text-lg text-gray-600">
            At Random Acts, we aim to create innovative solutions that empower
            individuals to prioritize personal growth, enhance their well-being,
            and build connections with others. We believe in the transformative
            power of tech, and with our app, Novari, we want to support you
            every step of the way in your journey towards becoming your best
            self.
          </p>
        </section>

        <section className="mb-12 p-6 bg-white border border-green-500 rounded-lg">
          <h2 className="text-3xl font-semibold text-gray-600 mb-4">
            The Problem We’re Solving
          </h2>
          <p className="text-lg mb-4">
            In today’s fast-paced world, personal growth often takes a backseat.
            Many people feel stuck, disconnected, or unsure of where to begin in
            their journey towards self-improvement. This is where Novari comes
            in.
          </p>
          <p className="text-lg">
            Our app is designed to create a supportive, all-in-one space where
            users can cultivate self-awareness, build emotional resilience,
            develop new skills, prioritise well-being, and set meaningful goals.
            With engaging tools that fit seamlessly into daily life, we empower
            individuals to grow with confidence and find a like-minded community
            along the way.
          </p>
        </section>

        <section className="mb-12 p-6 bg-white border border-green-500 rounded-lg">
          <h2 className="text-3xl font-semibold text-gray-600 mb-4">
            The Five Embers of Growth
          </h2>
          <p className="text-lg mb-6">
            We believe personal growth happens through continuous, mindful
            practice. That’s why we’ve divided the growth process into five key
            areas, or “embers,” each playing a crucial role in your development:
          </p>

          <div className="mb-8 p-6 bg-white border border-green-500 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              1. Self-Awareness & Mindset
            </h3>
            <p className="text-lg">
              Understanding yourself—your strengths, weaknesses, triggers, and
              values—is crucial to personal growth. Developing a growth mindset,
              where you believe you can improve through effort and learning,
              allows you to adapt and overcome challenges. Practices like
              journaling, mindfulness, and self-reflection can help you develop
              this self-awareness.
            </p>
          </div>

          <div className="mb-8 p-6 bg-white border border-green-500 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              2. Emotional Intelligence & Relationships
            </h3>
            <p className="text-lg">
              Mastering emotional regulation, empathy, and communication is
              vital for strengthening both personal and professional
              relationships. By learning to handle criticism, resolve conflicts,
              and set healthy boundaries, you build a foundation for long-term
              growth.
            </p>
          </div>

          <div className="mb-8 p-6 bg-white border border-green-500 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              3. Skill Development & Knowledge
            </h3>
            <p className="text-lg">
              Learning new skills—whether technical, creative, or soft
              skills—keeps you competitive and adaptable. Whether you’re
              reading, taking courses, or gaining hands-on experience in areas
              that interest or challenge you, this ember is all about continuous
              improvement and expanding your horizons.
            </p>
          </div>

          <div className="mb-8 p-6 bg-white border border-green-500 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              4. Health & Well-Being
            </h3>
            <p className="text-lg">
              Physical and mental health are the foundation of personal growth.
              Prioritising sleep, nutrition, exercise, and stress management
              (through practices like meditation or therapy) fuels your energy,
              focus, and overall well-being, helping you show up as the best
              version of yourself.
            </p>
          </div>

          <div className="mb-8 p-6 bg-white border border-green-500 rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              5. Purpose & Goal-Setting
            </h3>
            <p className="text-lg">
              Having a sense of purpose or direction gives your growth journey
              meaning. Setting clear, achievable goals—both big and
              small—ensures progress and keeps you motivated. Regularly
              reviewing and adjusting your goals helps prevent stagnation and
              ensures you stay aligned with your vision.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
