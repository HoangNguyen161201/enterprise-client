import React from 'react';
import { Input as AntInput, Space } from 'antd';
import { IInput } from '../../models';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from '@ant-design/icons';
import { Controller } from 'react-hook-form';

export const Input = ({ type = 'text', formSetting, name, label, placeholder }: IInput) => {
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
                prefix={<UserOutlined color="blue" />}
                placeholder={placeholder || ''}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            );
          }
          return (
            <AntInput
              id="radius-10"
              {...field}
              prefix={<UserOutlined color="blue" />}
              type={type}
              placeholder={placeholder || ''}
            />
          );
        }}
      />
      {errors[name] && <span className="color-red">{errors[name].message}</span>}
    </Space>
  );
};
