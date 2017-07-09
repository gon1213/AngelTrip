import Base from './components/Base';
import HomePage from './containers/HomePage.jsx';
import DashboardPage from './containers/DashboardPage';
import UserDetailPage from './containers/UserDetailPage';
import OutsideTripPage from './containers/OutsideTripPage';
import CreateTripPage from './containers/CreateTripPage';
import LoginPage from './containers/LoginPage';
import BlogPage from './containers/BlogPage';
import SignUpPage from './containers/SignUpPage';
import Auth from './modules/Auth';
import PostDetailPage from './containers/PostDetailPage';
import PostNewPage from './containers/PostNewPage';


const routes = {
  // base component (wrapper for the whole application).
  component: Base,
  childRoutes: [

    {
      path: '/',
      component: HomePage
      // getComponent: (location, callback) => {
      //   if (Auth.isUserAuthenticated()) {
      //     callback(null, DashboardPage);
      //   } else {
      //     callback(null, HomePage);
      //   }
      // }
    },

    {
      path: '/dashboard',
      component: DashboardPage
    },

    {
      path: '/explore',
      component: OutsideTripPage
    },

    {
      path: '/create',
      component: CreateTripPage
    },

    {
      path: '/user',
      component: UserDetailPage
    },

    {
      path: '/posts',
      component: BlogPage
    },

    {
      path: "/posts/i/:slug",
      component: PostDetailPage
    },

    {
      path: "/posts/new",
      component: PostNewPage
    },

    {
      path: '/login',
      component: LoginPage
    },

    {
      path: '/signup',
      component: SignUpPage
    },

    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();

        // change the current URL to /
        replace('/');
      }
    }

  ]
};

export default routes;