import { Col, Image, Row } from 'antd';
import { GlobalContext } from 'contextApi/globalContext';
import { NextPageWithLayout } from 'models/layoutType';
import { useContext as UseContext } from 'react';
import { BsArrowDown, BsArrowRight } from 'react-icons/bs';
import { ClientLayout } from '../components/layouts';

const index: NextPageWithLayout = () => {
  const { darkMode, color, color2 } = UseContext(GlobalContext);
  return (
    <>
      <Row
        gutter={[0, 0]}
        style={{
          height: '40vh',
        }}
      >
        <Col
          style={{
            height: '100%',
            position: 'relative',
            paddingRight: 20,
            paddingBottom: 20,
          }}
          span={16}
        >
          <Image
            alt="greenwich"
            height={'100%'}
            width={'100%'}
            preview={false}
            src="/assets/greenwich.jpg"
            style={{
              objectFit: 'cover',
            }}
          />
        </Col>
        <Col
          span={8}
          style={{
            borderLeft: darkMode ? '2px solid white' : '2px solid #001529',
          }}
        >
          <div
            style={{
              width: '100%',
              borderBottom: darkMode ? '2px solid white' : '2px solid #001529',
              paddingBlock: 10,
              paddingInline: 20,
              position: 'relative',
            }}
          >
            <span
              className="font-4 color-3"
              style={{
                fontWeight: 'bold',
              }}
            >
              CMS
            </span>

            <BsArrowRight
              className={`${color}`}
              style={{
                bottom: -15,
                position: 'absolute',
                fontSize: 27,
                right: -5,
              }}
            />
          </div>
        </Col>
      </Row>
      <Row
        gutter={[0, 0]}
        style={{
          height: '40vh',
          borderTop: darkMode ? '2px solid white' : '2px solid #001529',
        }}
      >
        <Col
          style={{
            height: '100%',
            position: 'relative',
            paddingRight: 20,
            paddingTop: 20,
          }}
          span={16}
        >
          <Row
            gutter={[20, 0]}
            style={{
              height: '100%',
              position: 'relative',
            }}
          >
            <Col
              span={12}
              style={{
                height: '100%',
                position: 'relative',
              }}
            >
              <Image
                alt="submission1"
                height={'100%'}
                width={'100%'}
                preview={false}
                src="/assets/submission1.svg"
                style={{
                  objectFit: 'cover',
                  background: 'white',
                }}
              />
            </Col>
            <Col
              span={12}
              style={{
                height: '100%',
                position: 'relative',
              }}
            >
              <Image
                alt="submission2"
                height={'100%'}
                width={'100%'}
                preview={false}
                src="/assets/submission2.svg"
                style={{
                  objectFit: 'cover',
                  background: 'white',
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col
          span={8}
          style={{
            borderLeft: darkMode ? '2px solid white' : '2px solid #001529',
          }}
        >
          <div
            style={{
              width: '100%',
              borderBottom: darkMode ? '2px solid white' : '2px solid #001529',
              paddingBlock: 10,
              paddingInline: 20,
              position: 'relative',
            }}
          >
            <span
              className="font-4 color-3"
              style={{
                fontWeight: 'bold',
              }}
            >
              Magazine Submission
            </span>

            <BsArrowRight
              className={`${color}`}
              style={{
                bottom: -15,
                position: 'absolute',
                fontSize: 27,
                right: -5,
              }}
            />
          </div>
          <BsArrowDown
            className={`${color}`}
            style={{
              left: -15,
              position: 'absolute',
              fontSize: 27,
              bottom: -5,
            }}
          />
        </Col>
      </Row>
    </>
  );
};

index.getLayout = ClientLayout;

export default index;
