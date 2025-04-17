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
  const [selected, setSelected] = useState<string>("");
  const [voted, setVoted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    const loadPoll = async () => {
      const { data, error } = await supabase
        .from("poll")
        .select()
        .eq("id", params.id)
        .single();
      if (!error && data) setTitle(data.title);
    };

    const loadOptions = async () => {
      const { data, error } = await supabase
        .from("option")
        .select()
        .eq("poll_id", params.id);
      if (!error && data) setOptions(data);
    };

    const load = async () => {
      await loadPoll();
      await loadOptions();
      setLoading(false);
    };

    load();

    // Creates a new realtime channel named "realtime-options"
    const channel = supabase
      .channel("realtime-options")
      // Sets up a listener on Postgres changes, listens only when a row in the option table is updated
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "option" },
        // When an update happens, Supabase sends a payload with the new row data in payload.new.
        (payload) => {
          setOptions((prev) =>
            prev.map((option) =>
              option.id === payload.new.id
                ? { ...option, votes: payload.new.votes }
                : option
            )
          );
        }
      )
      // Starts the real-time subscription
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.id]);

  const voteHandler = async () => {
    if (selected) {
      const { error } = await supabase.rpc("increment_vote", {
        option_id: selected,
      });
      if (error) return console.error(error);

      setVoted(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return voted ? (
    <div>
      {" "}
      <div>{title}</div>
      {options.map((option) => (
        <div
          onClick={() => setSelected(option.id)}
          key={option.id}
          className={`${selected === option.id && "bg-blue-600"}`}
        >
          {option.text} {option.votes}
        </div>
      ))}
    </div>
  ) : (
    <div>
      <div>{title}</div>
      {options.map((option) => (
        <div
          onClick={() => setSelected(option.id)}
          key={option.id}
          className={`${selected === option.id && "bg-blue-600"}`}
        >
          {option.text}
        </div>
      ))}
      <button onClick={voteHandler}>Submit vote</button>
    </div>
  );
};

export default PollPage;
