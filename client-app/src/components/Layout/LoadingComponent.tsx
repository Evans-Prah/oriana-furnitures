import './Loading.scss';

interface Props {
  message?: string;
}

const LoadingComponent = ({message = 'Loading...'}: Props) => {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
      <h3 className='loading-message'>{message}</h3>
    </div>
  );
}

export default LoadingComponent