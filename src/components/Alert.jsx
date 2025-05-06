const Alert = ({ type, message }) => (
    <div
      className={`mt-3 p-3 rounded ${type === 'success' ? 'alert alert-success' : 'alert alert-danger'}`}
      role="alert"
    >
      {message}
    </div>
  );
  
  export default Alert;