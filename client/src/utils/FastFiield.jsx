import { FastField, ErrorMessage } from 'formik';
import { Input } from '@nextui-org/react';

const FastFieldInput = ({ label, ...props }) => {
  return (
    <div className="mb-4">
      <FastField
        name={props.name}
        render={({ field }) => (
          <Input
            {...field}
            {...props}
            className="p-2 block w-full border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            label={
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
            }
          />
        )}
      />
      <ErrorMessage
        name={props.name}
        component="div"
        className="mt-1 text-sm text-red-600"
      />
    </div>
  );
};

export default FastFieldInput;
