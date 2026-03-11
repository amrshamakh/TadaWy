
const PageHeader = ({ title, subtitle, resultCount }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
      {resultCount !== undefined && (
        <p className="text-sm text-gray-500 mt-2">
          Showing {resultCount} {resultCount === 1 ? 'clinic' : 'clinics'}
        </p>
      )}
    </div>
  );
};

export default PageHeader;