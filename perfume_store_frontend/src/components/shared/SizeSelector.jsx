export default function SizeSelector({ sizes, selectedSize, onSelect, prices }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">Size</span>
        {selectedSize && (
          <span className="text-sm text-text-secondary">${prices[selectedSize]}</span>
        )}
      </div>
      <div className="flex gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all duration-300 ${
              selectedSize === size
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-text-secondary hover:border-primary/50"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
