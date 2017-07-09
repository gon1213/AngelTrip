import React from 'react';
// import MobileTearSheet from '../../../MobileTearSheet';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import {grey400} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import NavigationArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward.js';
import {Tabs, Tab} from 'material-ui/Tabs';
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';


function handleTouchTap() {
  alert('onTouchTap triggered on the title component');
}

export default class OutsideTripList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let fullDetails = [];
    let primaryTextName = '';
    let secondaryTextaddress = '';
    let keyId = '';
    let imgUrl = '';
    for(var i=0; i<this.props.outsideRouteDetails.length; i++) {
      primaryTextName = this.props.outsideRouteDetails[i].name;
      secondaryTextaddress = this.props.outsideRouteDetails[i].address;
      keyId = this.props.outsideRouteDetails[i].id;
      imgUrl = this.props.outsideRouteDetails[i].icon_url;
      fullDetails.push(
        <ListItem
          key={keyId} 
          value={i}
          primaryText={primaryTextName}
          secondaryText={
              <p>
                {secondaryTextaddress}
              </p>  
          }
          secondaryTextLines={2}
          leftAvatar={<Avatar src={imgUrl} />} />
      );
    }
    

    return (
      <div style={{marginTop:'20px'}}>
        <AppBar
          title={this.props.outsideRouteTitle} 
          onTitleTouchTap={handleTouchTap}
          iconElementLeft={<IconButton><NavigationArrowUpward /></IconButton>}
          onLeftIconButtonTouchTap={this.props.toOutsideTrip}
        />
        <List>
          {fullDetails}
        </List>
      </div>
    );
  }
}

