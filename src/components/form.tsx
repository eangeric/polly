"use client";
import React, { useState } from "react";
import { Generate } from "./generate";
import { TitleInput } from "./titleInput";
import { Options } from "./options";

export const Form = () => {
  const [text, setText] = useState<string>("");
  const [options, setOptions] = useState<string[]>([""]);

  const changeOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const deleteOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const addOption = () => {
    setOptions((prev) => [...prev, ""]);
  };

  return (
    <div>
      <TitleInput text={text} setText={setText} />
      <Options
        options={options}
        changeOption={changeOption}
        deleteOption={deleteOption}
        addOption={addOption}
      />
      <Generate text={text} options={options} />
    </div>
  );
};
