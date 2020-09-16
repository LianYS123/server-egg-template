import { Card, Col, Row } from 'antd';
import styles from './styles.less';

export default function emptyContainer(props) {
  const { isPage = true } = props;

  return (
    <div className={`${styles['empty-container']} ${!isPage && styles.pure}`}>
      <div className={styles['empty-container-wrapper']}>
        <h3 className={styles['empty-container-title']}>{props.title}</h3>
        <Row gutter={40}>
          {(props.steps || []).map((item, index) => (
            <Col span={8}>
              <span className={styles['empty-container-count']}>
                <span className={styles['empty-container-count-text']}>
                  {index + 1}
                </span>
              </span>
              <Card bordered={false}>{item}</Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
