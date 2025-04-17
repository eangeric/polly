type OptionProps = {
  index: number;
  value: string;
  onChange: (val: string) => void;
  onDelete: () => void;
  onAdd: () => void;
  isLast: boolean;
};

export const Option = ({
  index,
  value,
  onChange,
  onDelete,
  onAdd,
  isLast,
}: OptionProps) => (
  <div>
    <input
      className="bg-white text-black"
      value={value}
      placeholder={`Option ${index + 1}`}
      disabled={!isLast}
      onChange={(e) => onChange(e.target.value)}
    />
    {!isLast && (
      <button
        onClick={onDelete}
        className="px-2 py-1 bg-red-600 text-white rounded"
      >
        -
      </button>
    )}
    {isLast && value.length > 0 && (
      <button
        onClick={onAdd}
        className="px-2 py-1 bg-green-600 text-white rounded"
      >
        +
      </button>
    )}
  </div>
);
