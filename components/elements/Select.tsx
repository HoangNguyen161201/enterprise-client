import React from 'react';
import { Space, Select as AntSelect } from 'antd';
import { IInput } from '../../models';
import { Controller } from 'react-hook-form';

export const Select = ({ formSetting, name, label, placeholder, require = true }: IInput) => {
  const { Option } = AntSelect;
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
        {label} {require && <span className="color-red">*</span>}
      </span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <AntSelect size='large'
              style={{
                width: '100%',
                borderRadius: '10px !important',
              }}
              {...field}
              placeholder={placeholder || ''}
            >
              <Option value="admin">Admin</Option>
              <Option value="staff">Staff</Option>
              <Option value="qa_manager">QA_Manager</Option>
              <Option value="qa_coordinator">QA_Coordinator</Option>
              <Option value="department_manager">department_manager</Option>
            </AntSelect>
          );
        }}
      />
      {errors[name] && <span className="color-red font-1">{errors[name].message}</span>}
    </Space>
  );
};
