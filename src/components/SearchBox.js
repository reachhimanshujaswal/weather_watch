import React,{useRef} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import { debounce } from 'throttle-debounce';
import './../styles.css';
import app from './../app.config'

const WTF_GEO_API= app.WTF_GEO_API;
export default function SearchBox(props) {
  const {onSearchChange} = props;

  const valueRef = useRef('')
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [optionTotalCount, setOptionTotalCount] = React.useState([]);
  const [isLoading,setLoading] = React.useState(false);
  const [searchText,setSearchText]=React.useState('');
  const [value,setValue]=React.useState(null);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleInputChange = (event, value, reason) => {
    // Only invoke API for a new search, if character is deleted or
    // search criteria is too wide and API is returning max number of suggestions
    if (
      value.length > 0 && valueRef.current.value.length>0 &&
      (options.length === 0 ||
        (optionTotalCount >= app.SUGGESTION_LIMIT &&
          searchText.length !== value.length) ||
        searchText.length > value.length)) 
    {
      setLoading(true);
      
      var rapidOptions = {
        method: "GET",
        url: "https://wft-geo-db.p.rapidapi.com/v1/geo/cities",
        params: {
          namePrefix: value,
          limit: app.SUGGESTION_LIMIT
        },
        headers: {
          "x-rapidapi-key":WTF_GEO_API,
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com"
        }
      };

      axios.request(rapidOptions)
        .then((response) => {
          const countries = response.data.data.map((x) => {
            return {
              ...x,
              fullAddress: `${x.name}${
                x.region.length > 0 ? ", " + x.region : ""
              }${x.country === undefined ? "" : ", " + x.country}`
            };
          });
          setOptions(Object.keys(countries).map((key) => countries[key]));
          setSearchText(valueRef.current.value);
          setLoading(false);
          setOptionTotalCount(response.data.metadata.totalCount);
        });
    }

    //Suggestion should be visible only if there is atleast 1 character in searchBox
    if (value.length === 0) setOptions([]);
  };

  const handleInputChangeDebounced =  React.useCallback(debounce(1000, false,handleInputChange),[]);
  
  return (
      <div>
    <Autocomplete
      id="searchBar"
      className="autocomplete"
      open={open}
      value = {value}
      onChange = {(event, newValue) => {
        setValue(newValue);
        //console.log(newValue);
        onSearchChange(newValue);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onInputChange={(event, value, reason) => {
        if (reason==="input")
          handleInputChangeDebounced(event, value,reason)
      }}
      getOptionSelected={(option, value) => option.fullAddress === value.fullAddress}
      getOptionLabel={(option) => option.fullAddress}
      options={options}
      loading={isLoading}
      noOptionsText = "No Suggestions"
      renderInput={(params) => (
        <TextField id="txtField"
          {...params}
          label="Search by City"
          inputRef={valueRef}  
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
    </div>
  );
}
