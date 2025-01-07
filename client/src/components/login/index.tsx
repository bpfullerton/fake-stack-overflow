import useLogin from '../../hooks/useLogin';
import './index.css';

/**
 * Login Component contains a form that allows the user to input their username, which is then submitted
 * to the application's context through the useLoginContext hook.
 */
const Login = () => {
  const {
    formRef,
    username,
    password,
    disabled,
    errorText,
    handleSubmit,
    handleUsernameInputChange,
    handlePasswordInputChange,
  } = useLogin();

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      <h4>Please enter your account.</h4>
      <form ref={formRef} onSubmit={handleSubmit}>
        {errorText && <p className='error-message'>{errorText}</p>}
        <div>
          <input
            type='text'
            value={username}
            onChange={handleUsernameInputChange}
            placeholder='Enter your username'
            required
            className='input-text'
            id='usernameInput'
          />
        </div>
        <div>
          <input
            type='password'
            value={password}
            onChange={handlePasswordInputChange}
            placeholder='Enter your password'
            required
            className='input-text'
            id='passwordInput'
          />
        </div>
        <div>
          <button type='submit' className='login-button' disabled={disabled}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
