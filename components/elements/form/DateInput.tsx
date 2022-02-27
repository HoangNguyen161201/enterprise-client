import { Space, DatePicker } from 'antd';
import React from 'react';
import { Controller } from 'react-hook-form';
import moment from 'moment'
import { IInput } from 'models/formType';

export const DateInput = ({
  formSetting,
  name,
  label,
  require = true,
}: IInput) => {
  const {
    formState: { errors },
    control,
  } = formSetting;
  return (
    <Space direction="vertical" size={'small'}>
      <span className="font-1">
        {label} {require && <span className="color-red">*</span>}
      </span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => <DatePicker disabledDate={(currentDate)=> currentDate && currentDate < moment()} format="YYYY-MM-DD HH:mm:ss" showTime showToday {...field} style={{ width: '100%' }} size="large" />}
      />
      {errors[name] && <span className="color-red">{errors[name].message}</span>}
    </Space>
  );
};
