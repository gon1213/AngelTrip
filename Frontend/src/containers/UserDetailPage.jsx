import React from 'react';
import Auth from '../services/AuthService.jsx'
// import {Link} from 'react-router';
import UserActions from '../actions/UserActions.jsx';
import UserStore from '../stores/UserStore.jsx';
import UserConstants from '../constants/UserConstants';
import axios from 'axios';

class UserDetailPage extends React.Component {

  constructor() {
      super();
      this.state = {
        userData: {}
      };
      this.fetchMessage = this.fetchMessage.bind(this);
      // need .bind(this), otherwise this will be UserStore
      // this.loadUserDetail = this.loadUserDetail.bind(this);
      this.tableStyles = {
          fontSize: "14px"
      }
  }

  

  fetchMessage() {
    const config = {
      headers:  { Authorization: 'Token ' + localStorage.getItem('user_token')}
        };
    axios.get(UserConstants.USER_DETAIL_URL, config)
       .then(response => {
       /* console.log(response);*/
        this.setState({
          userData: response.data 
        });
        console.log("userdata: ", this.state.userData)
      });
    }

  componentWillMount() {
    this.fetchMessage();
  }

  // componentWillReceiveProps(nextProps) {
    
  // }

  // componentDidMount() {
  // }

  // componentDidUpdate(prevProps, prevState) {
    
  // }

  // shouldComponentUpdate(nextProps,nextState) {
     
  // }
  render() {
      console.log('detail render', this.state.user, UserStore.token, localStorage)
      return (
          <div className="container jumbotron">
              <h2>User Detail</h2>
              
          </div>
      )
  }
}


export default UserDetailPage;