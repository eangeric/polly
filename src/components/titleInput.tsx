import React from "react";

type TitleInputProps = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

export const TitleInput = ({ text, setText }: TitleInputProps) => {
  return (
    <input
      className="bg-white text-black"
      placeholder="Title"
      onChange={(event) => {
        setText(event.target.value);
      }}
      value={text}
    ></input>
  );
};
