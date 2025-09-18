import styles from './Spinner.module.css';

interface IProps {
  size?: number;
  className?: string;
  centered?: boolean;
}

export const Spinner = ({ size, className, centered }: IProps) => {
  const classNameValue = `${styles.loader} ${className} ${
    centered ? styles.loaderCentered : ''
  }`;

  return <span className={classNameValue} style={{ fontSize: `${size}px` }} />;
};
