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

    setGenerated(`http://localhost:3000/poll/${poll.id}`);
  };

  return (
    <div>
      <button className="bg-blue-700" onClick={generateLink}>
        Create poll
      </button>
      {generated && <Link href={generated}>{generated}</Link>}
    </div>
  );
};
