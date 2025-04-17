"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useParams } from "next/navigation";

type Option = {
  id: string;
  text: string;
  votes: number;
};

const PollPage = () => {
  const params = useParams<{ id: string }>();
  const [title, setTitle] = useState<string>("");
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const loadPoll = async () => {
      const { data, error } = await supabase
        .from("poll")
        .select()
        .eq("id", params.id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setTitle(data.title);
      }
    };

    const loadOptions = async () => {
      const { data, error } = await supabase
        .from("option")
        .select()
        .eq("poll_id", params.id);

      if (error) {
        console.error(error);
      } else {
        setOptions(data);
      }
    };

    loadPoll();
    loadOptions();
  }, [params.id]);

  return (
    <div>
      <div>{title}</div>
      {options.map((option) => (
        <div key={option.id}>{option.text}</div>
      ))}
    </div>
  );
};

export default PollPage;
