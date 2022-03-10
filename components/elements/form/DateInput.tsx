import { Space, DatePicker } from 'antd';
import React, { useContext } from 'react';
import { Controller } from 'react-hook-form';
import moment from 'moment'
import { IInput } from 'models/formType';
import { GlobalContext } from 'contextApi/globalContext';

export const DateInput = ({
  formSetting,
  name,
  label,
  require = true,
  dark= true
}: IInput) => {
  const {desColor} = useContext(GlobalContext)
  const {
    formState: { errors },
    control,
  } = formSetting;return (
    <Space direction="vertical" size={'small'}>
      <label htmlFor={name} className={dark ? `font-1 ${desColor}`: 'font-1 des-1'}>
        {label} {require && <span className="color-red">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => <DatePicker id={name} disabledDate={(currentDate)=> currentDate && currentDate < moment()} format="YYYY-MM-DD HH:mm:ss" showTime showToday {...field} style={{ width: '100%' }} size="large" />}
      />
      {errors[name] && <span className="color-red">{errors[name].message}</span>}
    </Space>
  );
};
