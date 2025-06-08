import React, { useState } from 'react';
import {
  Box,
  TextField,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';

const SearchBar = () => {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const searchItems = async (query) => {
    if (query.length < 2) {
      setOptions([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOptions(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    searchItems(newValue);
  };

  const handleOptionClick = (option) => {
    setShowResults(false);
    setInputValue('');
    // Rediriger vers la page appropriée selon le type d'élément
    switch (option.type) {
      case 'intervention':
        window.location.href = `/technicien/interventions/${option.id}`;
        break;
      case 'portique':
        window.location.href = `/conducteur/anomalies?portique=${option.id}`;
        break;
      case 'technicien':
        window.location.href = `/responsable/techniciens?id=${option.id}`;
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ width: 300, position: 'relative' }}>
      <TextField
        fullWidth
        placeholder="Rechercher..."
        value={inputValue}
        onChange={handleInputChange}
        InputProps={{
          endAdornment: loading ? <CircularProgress size={20} /> : null,
        }}
      />
      {showResults && options.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1,
            mt: 1,
            maxHeight: 300,
            overflow: 'auto',
          }}
        >
          {options.map((option, index) => (
            <Box
              key={index}
              onClick={() => handleOptionClick(option)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <SearchIcon sx={{ mr: 1 }} />
              <Box>
                <Typography variant="body1">{option.label}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {option.type}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar; 