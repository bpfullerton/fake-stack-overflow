import { NavLink } from 'react-router-dom';
import './index.css';

/**
 * The SideBarNav component has three menu items: "Questions", "Tags", and "Messages".
 * It highlights the currently selected item based on the active page and
 * triggers corresponding functions when the menu items are clicked.
 */
const SideBarNav = () => (
  <div id='sideBarNav' className='sideBarNav'>
    <NavLink
      to='/home'
      id='menu_questions'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      Questions
    </NavLink>
    <NavLink
      to='/tags'
      id='menu_tag'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      Tags
    </NavLink>
    <NavLink
      to='/messages'
      id='menu_messages'
      className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
      Messages
    </NavLink>
  </div>
);

export default SideBarNav;
