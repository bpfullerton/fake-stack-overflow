import { ChangeEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import login from '../services/authService';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to handle login input and submission.
 *
 * @returns formRef - The reference to the form element.
 * @returns disabled - A boolean indicating whether the submit button is disabled.
 * @returns username - The current value of the username input.
 * @returns password - The current value of the password input.
 * @returns errorText - Error message on login process.
 * @returns handleUsernameInputChange - Function to handle changes in the username input field.
 * @returns handlePasswordInputChange - Function to handle changes in the password input field.
 * @returns handleSubmit - Function to handle login submission
 * @returns handleLogout - Function to handle logout
 */
const useLogin = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');
  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  /**
   * Function to handle the username input change event.
   *
   * @param e - the event object.
   */
  const handleUsernameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (formRef.current) {
      setDisabled(!formRef.current.checkValidity());
    }
  };

  /**
   * Function to handle the username input change event.
   *
   * @param e - the event object.
   */
  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (formRef.current) {
      setDisabled(!formRef.current.checkValidity());
    }
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await login(username, password);
    if (result) {
      setUser({ username });
      navigate('/home');
    } else {
      setErrorText('Login failed');
    }
  };

  /**
   * Function to handle logout
   *
   */
  const handleLogout = () => {
    setUser({ username: '' });
    navigate('/');
  };

  return {
    formRef,
    username,
    password,
    disabled,
    errorText,
    handleUsernameInputChange,
    handlePasswordInputChange,
    handleSubmit,
    handleLogout,
  };
};

export default useLogin;
