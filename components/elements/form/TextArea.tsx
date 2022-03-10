import { Input as AntInput, Space } from 'antd';
import { GlobalContext } from 'contextApi/globalContext';
import { IInput } from 'models/formType';
import React, { useContext } from 'react';
import { Controller } from 'react-hook-form';

export const TextArea = ({ formSetting, dark = true, name, label, require = true }: IInput) => {
  const { desColor } = useContext(GlobalContext);
  const {
    formState: { errors },
    control,
  } = formSetting;
  return (
    <Space direction="vertical" size={'small'}>
      <label htmlFor={name} className={dark ? `font-1 ${desColor}` : 'font-1 des-1'}>
        {label} {require && <span className="color-red">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <AntInput.TextArea
            id={name}
            {...field}
            size="large"
            style={{
              width: '100%',
              minHeight: '100px',
              borderRadius: 5,
            }}
          />
        )}
      />
      {errors[name] && <span className="color-red">{errors[name].message}</span>}
    </Space>
  );
};
