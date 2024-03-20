export default function FormField({ id, label, type, value, onChange, onBlur, required, isTouched, error, isChecking }) {
    return (
        <div>
            <label
                htmlFor={id}
                className={`block text-sm font-medium leading-6 text-gray-900 ${
                    isTouched ? 'text-gray-900' : error ? 'text-red-600' : 'text-green-600'
                }`}
            >
                {label}
            </label>
            <div className="relative mt-2">
                <input
                    id={id}
                    name={id}
                    type={type}
                    autoComplete={id}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    required={required}
                    className={`block w-full ${isChecking && 'pr-[94px]'} rounded-md border p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        isChecking ? 'bg-blue-50 border-blue-500' : '' || isTouched ? '' : error ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'
                    }`}
                />
                {isChecking && (
                    <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 text-xs gap-2">
                        <div
                            className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        <span>Checking...</span>
                    </div>
                )}
            </div>
            {error && (
                <div className="mt-2 text-xs italic text-red-600">
                    {Array.isArray(error) ? (
                        error.map((error, index) => (
                            <div className="flex items-center gap-2" key={index}>
                                {/*<span className="h-3 w-3 border-2 border-solid border-current"></span>*/}
                                <p key={index}>{error}</p>
                            </div>
                        ))
                    ) : (
                        <p>{error}</p>
                    )}
                </div>
            )}
        </div>
    );
}
