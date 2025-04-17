import { Option } from "./option";

type OptionsProps = {
  options: string[];
  deleteOption: (index: number) => void;
  changeOption: (index: number, value: string) => void;
  addOption: () => void;
};

export const Options = ({
  options,
  deleteOption,
  changeOption,
  addOption,
}: OptionsProps) => (
  <div>
    {options.map((opt, i) => (
      <Option
        key={i}
        index={i}
        value={opt}
        isLast={i === options.length - 1}
        onChange={(val) => changeOption(i, val)}
        onDelete={() => deleteOption(i)}
        onAdd={addOption}
      />
    ))}
  </div>
);
