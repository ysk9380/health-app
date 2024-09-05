import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { changeLanguage } from "../i18n";
import { getLanguages } from "../services/master-data-service";
import { Language } from "../models/master";
import { useDispatch } from "react-redux";
import { setLoading } from "../store/loading-slice";

const fetchLanguageOptions = async () => {
  const languages = await getLanguages();
  return languages;
};

const LanguageSwitcher: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [languageOptions, setLanguageOptions] = useState<Language[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getLanguages = async () => {
      dispatch(setLoading(true));
      const languages = await fetchLanguageOptions();
      setLanguageOptions(languages);
      dispatch(setLoading(false));
    };

    getLanguages();
  }, [dispatch]);

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    setSelectedLanguage(event.target.value);
  };

  const handleButtonClick = () => {
    changeLanguage(selectedLanguage);
  };

  return (
    <Card style={{ maxWidth: 400, margin: "0 auto" }}>
      <CardContent>
        <Typography variant="subtitle1">Change Language</Typography>
        <Select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          fullWidth
          size="small"
          displayEmpty
        >
          {languageOptions.map((option) => (
            <MenuItem key={option.languageCode} value={option.languageCode}>
              {option.languageName}
            </MenuItem>
          ))}
        </Select>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Apply
        </Button>
      </CardActions>
    </Card>
  );
};

export default LanguageSwitcher;
