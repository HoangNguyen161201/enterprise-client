import React, { useContext } from 'react';
import { Space, Select as AntSelect } from 'antd';
import { IInput } from 'models/formType';
import { IOptionSelect } from 'models/elementType';
import { Controller } from 'react-hook-form';
import { GlobalContext } from 'contextApi/globalContext';

export const Select = ({ formSetting, dark= true, name, label, placeholder, require = true, data, multiple= false }: IInput) => {
  
  const {desColor} = useContext(GlobalContext)

  const { Option } = AntSelect;
  const {
    formState: { errors },
    control,
  } = formSetting;
  return (
    <Space
      direction="vertical"
      size={'small'}
    >
      <label htmlFor={name} className={dark ? `font-1 ${desColor}`: 'font-1 des-1'}>
        {label} {require && <span className="color-red">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <AntSelect id={name} mode={multiple ? 'multiple': undefined} size='large'
              style={{
                width: '100%',
                borderRadius: '10px !important',
              }}
              {...field}
              placeholder={placeholder || ''}
            >
              {
                !require && <Option key="null" value="">---</Option>
              }
              {
                data && data.map((option: IOptionSelect, key: number)=> <Option key={key} value={option.value}>{option.label}</Option>)
              }
            </AntSelect>
          );
        }}
      />
      {errors[name] && <span className="color-red font-1">{errors[name].message}</span>}
    </Space>
  );
};
