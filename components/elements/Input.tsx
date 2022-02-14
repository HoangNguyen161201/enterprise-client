import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { AutoComplete, Input as AntInput, Space } from 'antd';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { IInput } from '../../models';

export const Input = ({ type = 'text', formSetting, name, label, placeholder, icon }: IInput) => {
  const [options, setOptions] = useState([{ value: '@gmail.com' }]);

  const handleSearch = (value: string) => {
    setOptions([{ value: value + '@gmail.com' }]);
  };

  const {
    formState: { errors },
    control,
  } = formSetting;
  return (
    <Space
      style={{
        minWidth: 300,
      }}
      direction="vertical"
      size={'small'}
    >
      <span className="font-2">
        {label} <span className="color-red">*</span>
      </span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          if (type == 'password') {
            return (
              <AntInput.Password
                {...field}
                prefix={icon}
                size='large'
                placeholder={placeholder || ''}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            );
          }

          return (
            <AutoComplete
              {...field}
              style={{ width: '100%' }}
              onSearch={handleSearch}
              options={options}
            >
              <AntInput size='large' prefix={icon} type={type} placeholder={placeholder || ''} />
            </AutoComplete>
          );
        }}
      />
      {errors[name] && <span className="color-red">{errors[name].message}</span>}
    </Space>
  );
};
