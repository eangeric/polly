"use client";
import React, { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";

type GenerateProps = {
  text: string;
  options: string[];
};

export const Generate = ({ text, options }: GenerateProps) => {
  const [generated, setGenerated] = useState<string>("");

  // Create link
  const generateLink = async () => {
    // title is not empty and at least one element is not empty string in options
    if (!text.trim() || !options.some((opt) => opt.trim() !== "")) {
      console.error("Title or options missing.");
      return;
    }

    const { data: poll, error: pollError } = await supabase
      .from("poll")
      .insert({ title: text })
      .select()
      .single();

    if (pollError || !poll) {
      console.error(pollError);
      return;
    }
    // Insert each option into the 'options' table
    const validOptions = options.filter((option) => option.trim().length > 0);
    const { error: optionsError } = await supabase.from("option").insert(
      validOptions.map((option) => ({
        poll_id: poll.id,
        text: option,
      }))
    );

    if (optionsError) {
      console.error(optionsError);
      return;
    }

    const baseUrl = window.location.origin;
    setGenerated(`${baseUrl}/vote/${poll.id}`);
  };

  return (
    <div>
      <button className="bg-blue-700" onClick={generateLink}>
        Create poll
      </button>
      <div>{generated && <Link href={generated}>{generated}</Link>}</div>
    </div>
  );
};
