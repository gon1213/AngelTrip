import React, { PropTypes } from 'react'
import { AutoComplete }     from 'material-ui';
import {debounce} from 'throttle-debounce';

// encodeURIComponent(myUrl)
const SearchInputField = ({name,searchText, floatingLabelText, dataSource, onUpdateInput, hintText, inputStyle, errors}) => {
  const errorText = (errors === undefined ? '': errors.error_location)
  return (
        <AutoComplete
          name={name}
          searchText={searchText}
          floatingLabelText={floatingLabelText}
          filter={AutoComplete.noFilter}
          openOnFocus={true}
          dataSource={dataSource}
          onUpdateInput={debounce(600,onUpdateInput)} 
          className="searchInputField"
          inputStyle={inputStyle}
          placeholder={hintText}
          errorText={errorText}
        />
      )
}

SearchInputField.propTypes = {
  name: PropTypes.string.isRequired,
  searchText: PropTypes.string.isRequired,
  floatingLabelText: PropTypes.string,
  dataSource: PropTypes.array.isRequired,
  onUpdateInput: PropTypes.func.isRequired,
  hintText: PropTypes.string,
  inputStyle: PropTypes.object,
  errors: PropTypes.object,

};

export default SearchInputField;
