import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Cookie } from "lucide-react";

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Happy late night";
};

const getUserName = (email?: string | null) => {
  if (!email) return "there";
  return email.split("@")[0];
};

const getPersonalizedMessages = (username: string, timeGreeting: string) => [
  `${timeGreeting}, ${username}!`,
  `${username}, welcome back!`,
  `Back at it, ${username}!`,
  `Happy reading, ${username}!`,
  `Let's get started, ${username}!`,
  `Ready for YouTube magic, ${username}?`,
  `Hope you're having a great day, ${username}!`,
  `${timeGreeting}!`,
];

const PersonalizedGreeting: React.FC = () => {
  const { user } = useAuth();
    const username = getUserName(user?.email);
    const isApplied = useRef(false);
    const timeGreeting = getTimeGreeting();
    const messages = getPersonalizedMessages(username, timeGreeting);
    
    const [randomMessage, setRandomMessage] = useState(messages[Math.floor(Math.random() * messages.length)]);

    
    useEffect(() => {
        if (!isApplied.current) {
            setRandomMessage(messages[Math.floor(Math.random() * messages.length)]);
            isApplied.current = true;
        }
    }, [messages]);

  return (
    <div
      className="mb-4 text-4xl font-serif text-center text-foreground"
      style={{ letterSpacing: "0.5px", fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
    >
      <div className="flex items-center justify-center gap-2">
        <Cookie className="h-7 w-7 text-primary" />
        {randomMessage}
      </div>
    </div>
  );
};

export default PersonalizedGreeting;