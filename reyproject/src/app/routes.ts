import {Routes} from '@angular/router';
import {Home} from './home/home';
import {Login} from './login/login';
import {AddUser} from './add-user/add-user';
import {EditUser} from './edit-user/edit-user';

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
];
export default routeConfig;