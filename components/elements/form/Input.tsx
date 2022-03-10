import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { AutoComplete, Input as AntInput, Space } from 'antd';
import { GlobalContext } from 'contextApi/globalContext';
import { IInput } from 'models/formType';
import React, { useContext, useState } from 'react';
import { Controller } from 'react-hook-form';

export const Input = ({
  type = 'text',
  formSetting,
  name,
  label,
  placeholder,
  disable,
  icon,
  require = true,
  dark = true,
}: IInput) => {
  const { desColor } = useContext(GlobalContext);

  const [options, setOptions] = useState([{ value: '@gmail.com' }]);

  const handleSearch = (value: string) => {
    setOptions([{ value: value + '@gmail.com' }]);
  };

  const {
    formState: { errors },
    control,
  } = formSetting;
  return (
    <Space direction="vertical" size={'small'}>
      <span className={dark ? `font-1 ${desColor}` : 'font-1 des-1'}>
        {label} {require && <span className="color-red">*</span>}
      </span>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          switch (type) {
            case 'password':
              return (
                <AntInput.Password
                  style={{
                    width: '100%',
                  }}
                  {...field}
                  disabled={disable}
                  prefix={
                    <span
                      style={{
                        marginRight: 5,
                        color: 'gray'
                      }}
                    >
                      {icon}
                    </span>
                  }
                  size="large"
                  placeholder={placeholder || ''}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              );
            case 'email':
              return (
                <AutoComplete
                  {...field}
                  style={{ width: '100%' }}
                  onSearch={handleSearch}
                  options={options}
                  disabled={disable}
                >
                  <AntInput
                    size="large"
                    prefix={
                      <span
                        style={{
                          marginRight: 5,
                          color: 'gray'
                        }}
                      >
                        {icon}
                      </span>
                    }
                    type={type}
                    placeholder={placeholder || ''}
                  />
                </AutoComplete>
              );

            default:
              return (
                <AntInput
                  {...field}
                  style={{ width: '100%' }}
                  size="large"
                  disabled={disable}
                  prefix={
                    <span
                      style={{
                        marginRight: 5,
                        color: 'gray'
                      }}
                    >
                      {icon}
                    </span>
                  }
                  type={type}
                  placeholder={placeholder || ''}
                />
              );
          }
        }}
      />
      {errors[name] && <span className="color-red">{errors[name].message}</span>}
    </Space>
  );
};
