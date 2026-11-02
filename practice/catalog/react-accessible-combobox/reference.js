export function AccessibleCombobox({ options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [query, setQuery] = useState('');

  const activeOptionId = activeIndex >= 0 && options[activeIndex] 
    ? `option-${options[activeIndex].id}` 
    : undefined;

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && activeIndex >= 0) {
        onSelect(options[activeIndex]);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div>
      <input
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="combobox-options-list"
        aria-activedescendant={activeOptionId}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
        onKeyDown={handleKeyDown}
      />
      {isOpen && (
        <ul id="combobox-options-list" role="listbox">
          {options.map((opt, i) => (
            <li
              key={opt.id}
              id={`option-${opt.id}`}
              role="option"
              aria-selected={activeIndex === i}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
