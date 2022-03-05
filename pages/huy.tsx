import { GithubOutlined, GoogleOutlined } from '@ant-design/icons';
import { Avatar, Col, Dropdown, Image, Row, Space } from 'antd';
import React from 'react';

export default function huy() {
  return (
    <div>

      <Row style={{
        maxWidth: 1000,
        marginBlock: 'auto',
        marginInline: 'auto'
      }} gutter={[30, 0]} justify="center" >
        <Col span={4}>
          <Dropdown
            arrow
            overlay={
              <Space
                style={{
                  borderRadius: 5,
                }}
                direction="vertical"
              >
                <Space size={15} align="center">
                  <Avatar
                    size={'large'}
                    src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg"
                  />
                  <span
                    className="font-2"
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    Nguyen Quang Hoang
                  </span>
                </Space>
                <a>
                  <Space
                    style={{
                      height: 30,
                      paddingLeft: 10,
                    }}
                    size={15}
                    align="center"
                  >
                    <GoogleOutlined />
                    <span>hoangdev161201@gmail.com</span>
                  </Space>
                </a>
                <Space
                  style={{
                    height: 30,
                    paddingLeft: 10,
                  }}
                  size={15}
                  align="center"
                >
                  <GithubOutlined />
                  <span>HoangNguyen161201</span>
                </Space>
              </Space>
            }
          >
            <Image preview={false} src="/assets/trong.svg" />
          </Dropdown>
        </Col>
        <Col
          span={4}
          style={{
            display: 'flex',
            alignItems: 'end',
          }}
        >
          <Dropdown
            arrow
            overlay={
              <Space
                style={{
                  borderRadius: 5,
                }}
                direction="vertical"
              >
                <Space size={15} align="center">
                  <Avatar
                    size={'large'}
                    src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg"
                  />
                  <span
                    className="font-2"
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    Nguyen Quang Hoang
                  </span>
                </Space>
                <a>
                  <Space
                    style={{
                      height: 30,
                      paddingLeft: 10,
                    }}
                    size={15}
                    align="center"
                  >
                    <GoogleOutlined />
                    <span>hoangdev161201@gmail.com</span>
                  </Space>
                </a>
                <Space
                  style={{
                    height: 30,
                    paddingLeft: 10,
                  }}
                  size={15}
                  align="center"
                >
                  <GithubOutlined />
                  <span>HoangNguyen161201</span>
                </Space>
              </Space>
            }
          >
            <Image preview={false} src="/assets/hoang.svg" />
          </Dropdown>
        </Col>
        <Col
          span={4}
          style={{
            display: 'flex',
            alignItems: 'end',
          }}
        >
          <Dropdown
            arrow
            overlay={
              <Space
                style={{
                  borderRadius: 5,
                }}
                direction="vertical"
              >
                <Space size={15} align="center">
                  <Avatar
                    size={'large'}
                    src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg"
                  />
                  <span
                    className="font-2"
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    Nguyen Quang Hoang
                  </span>
                </Space>
                <a>
                  <Space
                    style={{
                      height: 30,
                      paddingLeft: 10,
                    }}
                    size={15}
                    align="center"
                  >
                    <GoogleOutlined />
                    <span>hoangdev161201@gmail.com</span>
                  </Space>
                </a>
                <Space
                  style={{
                    height: 30,
                    paddingLeft: 10,
                  }}
                  size={15}
                  align="center"
                >
                  <GithubOutlined />
                  <span>HoangNguyen161201</span>
                </Space>
              </Space>
            }
          >
            <Image preview={false} src="/assets/huy.svg" />
          </Dropdown>
        </Col>
      </Row>
    </div>
  );
}
