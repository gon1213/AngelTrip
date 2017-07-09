import Auth from '../modules/Auth';
import NavigationMenu from 'react-material-icons/icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
import React, { Component } from 'react';
import { Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

class Base extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }

  toggleDrawer = () => this.setState({ open: !this.state.open })

  render() {
    return (
      <div className="top-bar">
        <IconButton> <NavigationMenu onTouchTap={this.toggleDrawer} /> </IconButton>

        {Auth.isUserAuthenticated() ? (
          <div className="top-bar-right">
            <Link to="/logout">Log out</Link>
            <Link to="/user">User Detail</Link>
          </div>
        ) : (
          <div className="top-bar-right">
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
          </div>
        )}

        <Drawer
          docked={false}
          width={300}
          onRequestChange={this.toggleDrawer}
          open={this.state.open}
        >
          <AppBar title="Angel Trip" onLeftIconButtonTouchTap={this.toggleDrawer} />

          <MenuItem
            primaryText="City Trip"
            containerElement={<Link to="/" />}
            onTouchTap={() => {
              this.toggleDrawer()
            }}
          />

          <MenuItem
            primaryText="Exlore Around"
            containerElement={<Link to="/explore" />}
            onTouchTap={() => {
              this.toggleDrawer()
            }}
          />

          <MenuItem
            primaryText="Create Trip"
            containerElement={<Link to="/create" />}
            onTouchTap={() => {
              this.toggleDrawer()
            }}
          />

          <MenuItem
            primaryText="Share Trip"
            containerElement={<Link to="/posts" />}
            onTouchTap={() => {
              this.toggleDrawer()
            }}
          />

        </Drawer>
        <div style={{ textAlign: 'center' }}>
          {this.props.children}

        </div>

      </div>
    )
  }
}

export default Base