import useHeader from '../../hooks/useHeader';
import useLogin from '../../hooks/useLogin';
import './index.css';

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { handleLogout } = useLogin();
  const { val, handleInputChange, handleKeyDown } = useHeader();

  return (
    <div id='header' className='header'>
      <div></div>
      <div className='title'>Fake Stack Overflow</div>
      <input
        id='searchBar'
        placeholder='Search ...'
        type='text'
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button type='button' className='logout' onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Header;
