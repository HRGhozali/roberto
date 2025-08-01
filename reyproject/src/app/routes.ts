import {Routes} from '@angular/router';
import {Home} from './home/home';
import {Login} from './login/login';
import {AddUser} from './add-user/add-user';
import {EditUser} from './edit-user/edit-user';
import {EditEmail} from './edit-email/edit-email';
import {DeleteUser} from './delete-user/delete-user';
import {EnableDisable} from './enable-disable/enable-disable';
import {Search} from './search/search';

const routeConfig: Routes = [
  {
    path: '',
    component: Home,
    title: 'LPM: Home',
  },
  {
    path: 'login',
    component: Login,
    title: 'LPM: Login',
  },
  {
    path: 'addUser',
    component: AddUser,
    title: 'LPM: Add User',
  },
  {
    path: 'editUser',
    component: EditUser,
    title: 'LPM: Edit User',
  },
  {
    path: 'editEmail',
    component: EditEmail,
    title: 'LPM: Edit Email',
  },
  {
    path: 'deleteUser',
    component: DeleteUser,
    title: 'LPM: Delete User',
  },
  {
    path: 'search',
    component: Search,
    title: 'LPM: Search Users',
  },
  {
    path: 'enableDisable',
    component: EnableDisable,
    title: 'LPM: Enable/Disable Users',
  },
];
export default routeConfig;