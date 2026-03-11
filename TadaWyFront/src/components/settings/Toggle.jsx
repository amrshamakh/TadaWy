const Toggle = ({ checked, onToggle }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onToggle}
      />

      {/* Track */}
      <div className="w-12 h-7 rounded-full bg-gray-300 
                      peer-checked:bg-teal-500 
                      transition-colors duration-200" />

      {/* Thumb */}
      <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full 
                       transition-transform duration-200 ease-in-out
                       peer-checked:translate-x-5" />
    </label>
  );
};

export default Toggle;
